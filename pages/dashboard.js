import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import MyAssets from "../components/myNFT";

export default function CreatorDashboard() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const web3Modal = new Web3Modal({
      network: "mainnet",
      cacheProvider: true,
    });
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await contract.fetchItemsListed();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenUri = await contract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenUri);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          audio: meta.data.audio,
        };
        return item;
      })
    );

    setNfts(items);
    setLoadingState("loaded");
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="py-10 px-20 text-3xl">No NFTs listed</h1>;
  return (
    <div>
      <div className="p-4 ">
        <h2 className="text-2xl mx-40 mt-40 sm:mx-2 poppins text-3xl text-center">
          Items Listed
        </h2>
        <div className="grid grid-cols-4 sm:grid-cols-1 lg:grid-cols-2 mx-40 gap-4 pt-4">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className="  drop-shadow-md px-4 sm:w-60 rounded-md overflow-hidden bg-white/10 flex flex-col py-4 justify-between items-center "
            >
              <img
                src={nft.image}
                className=" object-cover w-full h-80 sm:h-60 rounded-md "
              />
              <audio controls src={nft.audio}>
                Your browser does not support the
                <code>audio</code> element.
              </audio>
              <div>
                <h1 className="text-center poppins text-medium">{nft.name}</h1>
                <div className="flex flex-row">
                  <span className="poppins">
                    <p className="text-white/50">current price</p>
                    <p className="text-center">{nft.price} Matic</p>
                  </span>
                </div>
                <p className="text-center poppins">{nft.description}</p>
              </div>
              <div className=" w-full"></div>
            </div>
          ))}
        </div>
      </div>
      <MyAssets />
    </div>
  );
}
