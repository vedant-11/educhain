import { useState } from "react";
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useRouter } from "next/router";
import Web3Modal from "web3modal";
import { Select } from "@chakra-ui/react";

const client = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function CreateItem() {
  const [fileUrl, setFileUrl] = useState(null);
  const [audioFileUrl, setAudioFileUrl] = useState(null);
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
  async function onChangeAudio(e) {
    /* upload image to IPFS */
    const file = e.target.files[0];
    try {
      const added = await client.add(file, {
        progress: (prog) => console.log(`received: ${prog}`),
      });

      const audioUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      setAudioFileUrl(audioUrl);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  async function uploadToIPFS() {
    const { name, description, price } = formInput;
    if (!name || !description || !price || !fileUrl || !audioFileUrl) return;
    /* first, upload metadata to IPFS */
    const data = JSON.stringify({
      name,
      description,
      image: fileUrl,
      audio: audioFileUrl,
    });
    try {
      const added = await client.add(data);
      const url = `https://ipfs.infura.io/ipfs/${added.path}`;
      const audioUrl = `https://ipfs.infura.io/ipfs/${added.path}`;
      /* after metadata is uploaded to IPFS, return the URL to use it in the transaction */
      return url, audioUrl;
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
        <h1 className="text-4xl poppins text-center ">Create NFT</h1>
        <p className="text-black/50 text-center poppins sm:text-center ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat.{" "}
        </p>
        <label>Name</label>
        <input
          placeholder="Asset Name"
          className="mt-2 bg-white border-2 rounded-lg p-4 border-[#CED4DA] bg-white/10"
          onChange={(e) =>
            updateFormInput({ ...formInput, name: e.target.value })
          }
        />
        <label>Description</label>
        <textarea
          placeholder="Asset Description"
          className="mt-2 bg-white border-2 border-[#CED4DA]  bg-white/10 rounded-lg p-4"
          onChange={(e) =>
            updateFormInput({ ...formInput, description: e.target.value })
          }
        />
        <label>Select Genre</label>
        <Select
          w="300px"
          border="2px"
          my={2}
          bg="white"
          borderColor="#CED4DA"
          color="#868E96"
          placeholder="Select option"
        >
          <option value="option1">Genre 1</option>
          <option value="option2">Genre 2</option>
          <option value="option3">Genre 3</option>
        </Select>
        <label>Price</label>
        <input
          placeholder="Asset Price in Matic"
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
          {fileUrl && (
            <img className="rounded mt-4" width="350" src={fileUrl} />
          )}
        </label>
        <label className="w-60 my-4 text-center pt-2 bg-bgprimary  border-[#CED4DA] rounded-lg h-10">
          Upload Audio File
          <input
            type="file"
            className="my-4 hidden"
            name="Asset"
            onChange={onChangeAudio}
            border-2
          />
          {audioFileUrl && (
            <audio controls src={audioFileUrl}>
              Your browser does not support the
              <code>audio</code> element.
            </audio>
          )}
        </label>

        <button
          onClick={listNFTForSale}
          className="bg-bgprimary  w-full h-12 rounded-lg font-medium poppins "
        >
          Create NFT
        </button>
      </div>
    </div>
  );
}
