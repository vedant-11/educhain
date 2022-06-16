import { ethers } from "ethers";
import { useEffect, useState } from "react";
import axios from "axios";
import Web3Modal from "web3modal";
import hero from "../assets/university.jpeg";
import about from "../assets/about.png";
import Link from "next/link";
import { marketplaceAddress } from "../config";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import polygon from "../assets/Polygon.svg";

import NFTMarketplace from "../artifacts/contracts/NFTMarketplace.sol/NFTMarketplace.json";
import Image from "next/image";
import { useQuery } from "react-query";

export default function Home() {
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
