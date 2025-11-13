export interface TokenMetadata {
  name: string;
  symbol: string;
  description: string;
  decimals: number;
  totalSupply: number;
  imageUrl?: string;
  mintable: boolean;
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

export interface TokenCreationResponse {
  success: boolean;
  token?: CreatedToken;
  error?: string;
  signature?: string;
}
