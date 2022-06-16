import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import hero from "../assets/heroimage.png";
import about from "../assets/about.png";
import Link from "next/link";
import { marketplaceAddress } from "../config";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import polygon from "../assets/Polygon.svg";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Image from "next/image";

export default function Home() {
  const [nfts, setNfts] = useState([]);
  const [loadingState, setLoadingState] = useState("not-loaded");
  useEffect(() => {
    loadNFTs();
  }, []);
  async function loadNFTs() {
    const provider = new ethers.providers.JsonRpcProvider(
      "https://polygon-mumbai.g.alchemy.com/v2/aHoj3FXdzVxzS_5mVRn6S6MQu8gIW3UZ"
    );
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      provider
    );
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
    setNfts(items);
    setLoadingState("loaded");
  }
  async function buyNft(nft) {
    /* needs the user to sign the transaction, so will use Web3Provider and sign it */
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = new ethers.Contract(
      marketplaceAddress,
      NFTMarketplace.abi,
      signer
    );

    /* user will be prompted to pay the asking proces to complete the transaction */
    const price = ethers.utils.parseUnits(nft.price.toString(), "ether");
    const transaction = await contract.createMarketSale(nft.tokenId, {
      value: price,
    });
    await transaction.wait();
    loadNFTs();
  }
  if (loadingState === "loaded" && !nfts.length)
    return (
      <>
        <section className="w-screen min-h-screen flex flex-row  mx-20 items-center sm:flex-col-reverse sm:flex sm:mx-2 ">
          <article className="flex flex-col w-1/3 h-full mt-20 sm:mt-20 sm:w-full   ">
            <h2 className="font-poppins  text-5xl font-extrabold mt-24 sm:mt-16 sm:text-center "></h2>
            <p className="my-10 text-lg text-black sm:text-center">
              connecting artists and fans all around the world
            </p>
            <div className="sm:flex sm:flex-col sm:w-full sm:justify-center sm:items-center">
              <Link href="/collection">
                <button className="bg-bgprimary w-40 h-10 rounded-lg font-medium poppins ">
                  Explore more
                </button>
              </Link>
            </div>
          </article>

          <div className="w-1/3 sm:w-full sm:ml-2 mt-40 ml-32  h-3/4">
            <Image src={hero} layout="responsive" />
          </div>
        </section>
      </>
    );
  return (
    <>
      <section className="w-screen min-h-screen flex flex-row  mx-20 items-center sm:flex-col-reverse sm:flex sm:mx-2 ">
        <article className="flex flex-col w-1/3 h-full mt-20 sm:mt-20 sm:w-full   ">
          <h2 className="font-poppins  text-5xl font-extrabold mt-24 sm:mt-16 sm:text-center ">
            On-chain degree credentialing platform
          </h2>
          <p className="my-10 text-lg text-black sm:text-center">
            Platform to store university degrees on blockchain with enhanced
            security, permissionless verification and security from forgery.
          </p>
          <div className="sm:flex sm:flex-col sm:w-full sm:justify-center sm:items-center">
            <Link href="/collection">
              <button className="bg-bgprimary w-40 h-10 rounded-lg font-medium poppins ">
                Explore more
              </button>
            </Link>
          </div>
        </article>

        <div className="w-1/3 sm:w-full sm:ml-2 mt-40 ml-32  h-3/4">
          <Image src={hero} layout="responsive" />
        </div>
      </section>
    </>
  );
}
