import React from "react";
import {
  Mainnet,
  DAppProvider,
  useEtherBalance,
  useEthers,
  Config,
} from "@usedapp/core";
import { formatEther } from "@ethersproject/units";

const ConnectButton = () => {
  const { activateBrowserWallet, account } = useEthers();
  const etherBalance = useEtherBalance(account);

  return (
    <>
      <button onClick={() => activateBrowserWallet()}>Connect</button>
    </>
  );
};

export default ConnectButton;
