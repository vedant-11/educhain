import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";

import { marketplaceAddress } from "../config";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Image from "next/image";
import { useQuery } from "react-query";

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-mumbai.g.alchemy.com/v2/aHoj3FXdzVxzS_5mVRn6S6MQu8gIW3UZ"
);
const contract = new ethers.Contract(
  marketplaceAddress,
  NFTMarketplace.abi,
  provider
);

export default function Collection() {
  async function loadNFTs() {
    const data = await contract.fetchMarketItems();

    /*
     *  map over items returned from smart contract and format
     *  them as well as fetch their token metadata
     */
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
          name: meta.data.name,
          description: meta.data.description,
        };
        return item;
      })
    );
    return items;
  }

  const { data: nfts, isLoading } = useQuery(["NFTs"], loadNFTs, {
    staleTime: 1000,
  });

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <h1 className="px-20 py-10 text-black text-xl">Loading...</h1>
      </div>
    );

  if (!nfts?.length)
    return (
      <div className="h-screen">
        <h1 className="px-20 py-10 text-3xl">No items in marketplace</h1>
      </div>
    );

  return (
    <div>
      <main className="mx-20 min-h-screen ">
        <h1 className="  text-center text-4xl poppins font-medium">
          Collection
        </h1>
        <p className="text-center text-white/50 my-10 ">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="" style={{ maxWidth: "1600px" }}>
          <div className="grid grid-cols-4 mb-20 sm:grid-cols-1 gap-4 pt-4">
            {nfts.map((nft, i) => (
              <div
                key={i}
                className=" drop-shadow-md px-4 sm:w-60 rounded-md overflow-hidden bg-white flex flex-col py-4 justify-between items-center "
              >
                <div className="flex flex-col bg-white justify-center items-center">
                  <img
                    src={nft.image}
                    className=" object-cover z-0 float-left  w-full h-80 rounded-md sm:h-36  "
                  />
                  <div className=" bg-white w-72 flex justify-end mt-2 z-500   ">
                    <p className=" text-white text-center w-40 rounded-sm bg-gray-300 ">
                      {nft.price} CGPA
                    </p>
                  </div>
                </div>

                {/* <audio controls className="my-2" src={nft.audio}>
                  Your browser does not support the
                  <code>audio</code> element.
                </audio> */}
                <div>
                  <div className="flex flex-row-reverse items-center w-80 justify-around bg-white ">
                    <p className=" bg-white text-center poppins text-sm">
                      SRM University
                    </p>
                    <p className=" bg-white text-center text-sm w-20  truncate poppins text-medium">
                      {nft.name}
                    </p>
                  </div>

                  <p className=" bg-white text-left ml-10 poppins">
                    {nft.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
