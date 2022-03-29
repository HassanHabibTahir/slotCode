import React from "react";
import { AppContext } from "../context/context";

import "./header.scss";
export const Header = () => {
  const { account, signer, connect, disconnect } = React.useContext(AppContext);
  return (
    <div className="container_header">
      <div className="_content">
        <div className="c_logo">logo</div>
        <div>
          <button
            className="button"
            onClick={() => {
              account ? disconnect() : connect();
            }}
          >
            {account
              ? account.slice(0, 5) + "..." + account.slice(-5)
              : "Connect to Wallet"}
          </button>
        </div>
      </div>
    </div>
  );
};
