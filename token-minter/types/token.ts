export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  totalSupply: number;
  imageUrl?: string;
  revokeMint: boolean;
  revokeFreeze: boolean;
}

export interface CreatedToken {
  id: string;
  mintAddress: string;
  metadata: TokenMetadata;
  creator: string;
  network: "devnet" | "mainnet-beta" | "gor";
  createdAt: number;
  txSignature: string;
}

export interface TokenCreationRequest {
  metadata: TokenMetadata;
  walletAddress: string;
  network: "devnet" | "mainnet-beta" | "gor";
}

export interface TransactionDetails {
  fromWallet: string;
  toWallet: string;
  serviceFee: number; // in SOL
  networkFee: number; // in SOL (gas fees)
  totalCost: number; // in SOL
  balanceBefore: number; // in SOL
  balanceAfter: number; // in SOL
  signature: string;
}

export interface TokenCreationResponse {
  success: boolean;
  token?: CreatedToken;
  error?: string;
  signature?: string;
  transactionDetails?: TransactionDetails;
}
