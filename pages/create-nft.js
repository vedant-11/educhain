import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Select } from "@chakra-ui/react";

const client = ipfsHttpClient({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  apiPath: "/ipfs/api/v0",
});

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);

  const [formInput, updateFormInput] = useState({
    price: "",
    name: "",
    description: "",
  });
  const router = useRouter();

  async function onChange(e) {
    /* upload image to IPFS */
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl) return;
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const audioUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url;
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function listNFTForSale() {
    const url = await uploadToIPFS();
    const audioUrl = await uploadToIPFS();
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    /* create the NFT */
    const price = ethers.utils.parseUnits(formInput.price, "ether");
    let contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    let listingPrice = await contract.getListingPrice();
    listingPrice = listingPrice.toString();
    let transaction = await contract.createToken(audioUrl, price, {
      value: listingPrice,
    });
    await transaction.wait();

    router.push("/");
  }

  return (
    <div className="flex justify-center">
      <div className="w-1/2 flex flex-col pb-12 mt-40 sm:w-80 sm:text-center ">
        <h1 className="text-4xl poppins text-center mb-4 ">
          Upload Report Card as NFT
        </h1>
        <p className="text-black/50 text-center poppins sm:text-center ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
        <label>Name</label>
        <input
          placeholder="Name of Student"
          className="mt-2 bg-white border-2 rounded-lg p-4 border-[#CED4DA] bg-white/10"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <label>Degree</label>
        <input
          placeholder="Enter course name"
          className="mt-2 bg-white border-2 border-[#CED4DA]  bg-white/10 rounded-lg p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />

        <label>CGPA</label>
        <input
          placeholder="Enter CGPA obtained"
          className="mt-2 bg-white border-2 w-60 rounded-lg p-4 bg-white/10 border-[#CED4DA] "
          onChange={(e) =>
            updateFormInput({ ...formInput, price: e.target.value })
          }
        />
        <label className="w-60 text-center mt-4 pt-2 bg-bgprimary  border-[#CED4DA] rounded-lg h-10">
          Upload Preview Image
          <input
            type="file"
            name="Asset"
            className="my-4 hidden"
            onChange={onChange}
          />
        </label>
        {fileUrl && <img className="rounded mt-4" width="350" src={fileUrl} />}
        <div className="mt-4">
          <button
            onClick={listNFTForSale}
            className="bg-bgprimary w-full h-12 rounded-lg font-medium poppins "
          >
            Create Degree NFT
          </button>
        </div>
      </div>
    </div>
  );
}
