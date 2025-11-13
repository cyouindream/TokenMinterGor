"use client";

import { FC, ReactNode, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";

// Import wallet adapter CSS
require("@solana/wallet-adapter-react-ui/styles.css");

interface WalletContextProviderProps {
  children: ReactNode;
}

export const WalletContextProvider: FC<WalletContextProviderProps> = ({
  children,
}) => {
  // Get network from environment variable, default to devnet
  const networkEnv = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'devnet';
  const network = networkEnv === 'mainnet-beta'
    ? WalletAdapterNetwork.Mainnet
    : networkEnv === 'testnet'
      ? WalletAdapterNetwork.Testnet
      : WalletAdapterNetwork.Devnet;

  // Use custom RPC URL if provided, otherwise use default cluster URL
  const endpoint = useMemo(() => {
    const customRpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    return customRpcUrl || clusterApiUrl(network);
  }, [network]);

  // Initialize all the wallets you want to support
  // Removed TorusWalletAdapter to fix duplicate MetaMask key error
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};
