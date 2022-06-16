// import react from "react";
import "../styles/globals.css";
import Link from "next/link";
import { DAppProvider } from "@usedapp/core";
import ConnectButton from "../components/ConnectButton";
import { ChakraProvider } from "@chakra-ui/react";
// import { Button, ButtonGroup } from "@chakra-ui/react";
import Footer from "../components/Footer";

import { useDisclosure } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <div>
      <nav className=" drop-shadow-sm z-50 bg-[#F1F3F5] px-20 h-20 sm:px-2 flex flex-row justify-between items-center fixed w-screen ">
        <Link href="/">
          <p className="text-4xl font-semibold poppins">EduChain</p>
        </Link>
        <div className=" poppins font-medium flex flex-row items-center justify-center ">
          <Link href="/collection">
            <a className="mr-4 text-black ">Degree</a>
          </Link>
          {/* <Button colorScheme="blue">Button</Button> */}
          <Link href="/create-nft">
            <a className="mr-6 text-black">Create Degree</a>
          </Link>

          <Link href="/dashboard">
            <a className="mr-6 text-black">Dashboard</a>
          </Link>
          <Modal />
        </div>
      </nav>

      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
      <Footer />
    </div>
  );
}

export default MyApp;
