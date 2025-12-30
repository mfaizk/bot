"use client";

import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import React from "react";
import { PAYPAL_CLIENT_ID, PAYPAL_ENV } from "../config/index";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { createConfig, WagmiProvider } from "wagmi";
import { mainnet, polygon, optimism, arbitrum, base } from "wagmi/chains";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { qieChain, QieCustomWallet } from "@/const/index";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import { Provider as JotaiProvider } from "jotai";
import {
  metaMaskWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
const connectors = connectorsForWallets(
  [
    {
      groupName: "Recommended",
      wallets: [QieCustomWallet, metaMaskWallet, walletConnectWallet],
    },
  ],
  {
    appName: "Qbots",
    projectId: "YOUR_PROJECT_ID",
  }
);
const config = createConfig({
  connectors,
  appName: "Qbots",
  projectId: "YOUR_PROJECT_ID",
  chains: [qieChain],
  ssr: false,
});

const initialOptions = {
  clientId: PAYPAL_CLIENT_ID,
  intent: "capture",
  environment: PAYPAL_ENV,
};

const ClientProvider = ({ children }) => {
  return (
    <JotaiProvider>
      <WagmiProvider config={config}>
        <RainbowKitProvider>
          <PayPalScriptProvider options={initialOptions}>
            {children}
          </PayPalScriptProvider>
        </RainbowKitProvider>
      </WagmiProvider>
    </JotaiProvider>
  );
};

export default ClientProvider;
