import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import { useRouter } from "next/router";

import { marketplaceAddress } from "../config";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";

export default function MyAssets() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  const router = useRouter();
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

    const marketplaceContract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );
    const data = await marketplaceContract.fetchMyNFTs();

    const items = await Promise.all(
      data.map(async (i) => {
        const tokenURI = await marketplaceContract.tokenURI(i.tokenId);
        const meta = await axios.get(tokenURI);
        let price = ethers.utils.formatUnits(i.price.toString(), "ether");
        let item = {
          price,
          tokenId: i.tokenId.toNumber(),
          seller: i.seller,
          owner: i.owner,
          image: meta.data.image,
          tokenURI,
        };
        return item;
      })
    );
    setNfts(items);
    setLoadingState("loaded");
  }
  function listNFT(nft) {
    router.push(`/resell-nft?id=${nft.tokenId}&tokenURI=${nft.tokenURI}`);
  }
  if (loadingState === "loaded" && !nfts.length)
    return <h1 className="poppins py-40 px-20 text-3xl">No NFTs owned</h1>;
  return (
    <div className="flex justify-center">
      <div className="p-4 mt-40">
        <h1 className="text-3xl poppins text-center">
          Collection of all your nfts
        </h1>
        <div className="grid grid-cols-4 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 my-10 mx-20 ">
          {nfts.map((nft, i) => (
            <div
              key={i}
              className=" drop-shadow-md px-4 sm:w-60 rounded-md overflow-hidden bg-white/10 flex flex-col py-4 justify-between items-center "
            >
              <img
                src={nft.image}
                className=" object-cover w-full h-80 sm:h-60 rounded-md "
              />
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
              <div className=" w-full">
                <button
                  className="bg-gradient-to-r from-purple-500 w-full h-10 rounded-lg font-medium poppins to-pink-500"
                  onClick={() => listNFT(nft)}
                >
                  List
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
