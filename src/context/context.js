import React from "react";
import { createContext } from "react";
import { useState } from "react";
// import WalletLink from "walletlink";
import { providers } from "ethers";
import WalletConnectProvider from "@walletconnect/web3-provider";
import Web3Modal from "web3modal";
// const INFURA_ID = "460f40a260564ac4a4f4b3fffb032dad";
const providerOptions = {
  walletconnect: {
    package: WalletConnectProvider, // required
    options: {
      network: "binance",
      networkUrl: "https://bsc-dataseed.binance.org/",
      rpc: {
        56: "https://bsc-dataseed.binance.org/",
      },
      chainId: 56,
      pollingInterval: 12000,
    },
    network: "mainnet",
  },
  //   "custom-walletlink": {
  //     display: {
  //       logo: "https://play-lh.googleusercontent.com/PjoJoG27miSglVBXoXrxBSLveV6e3EeBPpNY55aiUUBM9Q1RCETKCOqdOkX2ZydqVf0",
  //       name: "Coinbase",
  //       description: "Connect to Coinbase Wallet (not Coinbase App)",
  //     },
  //     options: {
  //       appName: "Coinbase", // Your app name
  //       networkUrl: `https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161`,
  //       chainId: 1,
  //     },
  //     package: WalletLink,

  //     connector: async (_, options) => {
  //       const { appName, networkUrl, chainId } = options;
  //       const walletLink = new WalletLink({
  //         appName,
  //       });
  //       const provider = walletLink.makeWeb3Provider(networkUrl, chainId);
  //       await provider.enable();
  //       return provider;
  //     },
  //   },
};
const web3Modal = new Web3Modal({
  network: "mainnet", // optional
  // cacheProvider: true,
  providerOptions, // required
  theme: {
    background: "rgb(28, 33, 53)",
    main: "rgb(199, 199, 199)",
    secondary: "rgb(136, 136, 136)",
    // border: "rgba(195, 195, 195, 0.14)",
    hover: "rgb(16, 26, 32)",
  },
});
let initialState = {
  provider: null,
  web3Provider: null,
  account: null,
  chainId: null,
  signer: null,
  balance: null,
};
export const AppContext = createContext(initialState);

export const AppContextProvider = ({ children }) => {
  const [state, setState] = useState(initialState);
  const connect = async () => {
    // This is the initial `provider` that is returned when
    // using web3Modal to connect. Can be MetaMask or WalletConnect.

    const provider = await web3Modal.connect();

    // We plug the initial `provider` into ethers.js and get back
    // a Web3Provider. This will add on methods from ethers.js and
    // event listeners such as `.on()` will be different.
    const web3Provider = new providers.Web3Provider(provider);
    const signer = web3Provider.getSigner();
    // const assign_key =
    const account = await signer.getAddress();
    const balance = await web3Provider.getBalance(account);
    const network = await web3Provider.getNetwork();

    setState({
      ...state,
      provider: provider,
      web3Provider: web3Provider,
      account: account,
      signer: signer,
      chainId: network.chainId,
      balance: balance,
    });
  };

  const disconnect = React.useCallback(
    async function () {
      await web3Modal.clearCachedProvider();
      if (
        state.provider?.disconnect &&
        typeof state.provider.disconnect === "function"
      ) {
        await state.provider.disconnect();
      }
      setState({
        ...state,

        provider: null,
        web3Provider: null,
        account: null,
        chainId: null,
        signer: null,
      });
      window.location.reload();
    },
    [state.provider]
  );

  React.useEffect(() => {
    if (state.provider?.on) {
      const handleAccountsChanged = (accounts) => {
        // eslint-disable-next-line no-console
        // console.log("accountsChanged", accounts);

        setState({
          ...state,
          account: accounts[0],
        });
      };

      // https://docs.ethers.io/v5/concepts/best-practices/#best-practices--network-changes
      const handleChainChanged = (_hexChainId) => {
        window.location.reload();
      };
      const handleDisconnect = (error) => {
        // eslint-disable-next-line no-console
        // console.log("disconnect", error);
        disconnect();
      };

      state.provider.on("accountsChanged", handleAccountsChanged);
      state.provider.on("chainChanged", handleChainChanged);
      state.provider.on("disconnect", handleDisconnect);

      // Subscription Cleanup
      return () => {
        if (state.provider.removeListener) {
          state.provider.removeListener(
            "accountsChanged",
            handleAccountsChanged
          );
          state.provider.removeListener("chainChanged", handleChainChanged);
          state.provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [state.provider, disconnect]);
  // console.log(state);
  return (
    <AppContext.Provider
      value={{
        account: state.account,
        signer: state.signer,
        provider: state.provider,
        balance: state.balance,
        connect,
        disconnect,
        chainId: state.chainId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
