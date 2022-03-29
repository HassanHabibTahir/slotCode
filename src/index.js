import { StrictMode } from "react";
import ReactDOM from "react-dom";

import App from "./App";
import { AppContextProvider } from "./context/context";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <ToastContainer />
      <App />
    </AppContextProvider>
  </StrictMode>,
  rootElement
);
