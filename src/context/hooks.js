import React from "react";
import { Contract } from "@ethersproject/contracts";
import spinABI from "./environment/spinContractABI.json";
import tokenABI from "./environment/tokenAbi.json";
// import spinABI from "./environment/spinContractABI.json";

import { ethers } from "ethers";

import Environment from "./environment/env";
// import { web3SeederMain, web3Seeder } from "./seeder";
let walletAddress = "0x8ba1f109551bD432803012645Ac136ddd64DBA72";
const provider = new ethers.providers.JsonRpcProvider(
  "https://data-seed-prebsc-1-s1.binance.org:8545/"
);
const VoidSigner = new ethers.VoidSigner(walletAddress, provider);
function useContract(address, ABI, signer) {
  return React.useMemo(() => {
    if (signer) {
      return new Contract(address, ABI, signer);
    } else {
      return new Contract(address, ABI, VoidSigner);
    }
  }, [address, ABI, signer]);
}
export function UseSpinContract(signer) {
  return useContract(Environment.SpinContractAddress, spinABI, signer);
}
export function UseSpinTokenContract(signer) {
  return useContract(Environment.tokenSpinAddress, tokenABI, signer);
}
