"use client";

import { useEffect, useState } from "react";
import { CreatedToken } from "@/types/token";

export default function TokenGallery() {
  const [tokens, setTokens] = useState<CreatedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/tokens");
      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }
      const data = await response.json();
      setTokens(data.tokens || []);
    } catch (err) {
      console.error("Error fetching tokens:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load tokens"
      );
    } finally {
      setLoading(false);
    }
  };

  const getExplorerUrl = (mintAddress: string, network: string) => {
    if (network === "gor") {
      return `#`; // Future: GOR chain explorer
    }
    const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
    return `https://solscan.io/token/${mintAddress}${cluster}`;
  };

  if (loading) {
    return (
      <div className="text-center text-purple-200 py-12">
        Loading tokens...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
        {error}
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center text-purple-300 py-12">
        <p className="text-xl mb-2">No tokens created yet</p>
        <p className="text-purple-400">Be the first to create a token!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-purple-100 mb-6">
        Created Tokens ({tokens.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="bg-purple-800/30 backdrop-blur-sm border border-purple-700 rounded-xl p-6 hover:border-purple-500 transition-all"
          >
            {/* Token Image */}
            {token.metadata.imageUrl && (
              <div className="mb-4 flex justify-center">
                <img
                  src={token.metadata.imageUrl}
                  alt={token.metadata.name}
                  className="w-24 h-24 rounded-full border-2 border-purple-600"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Token Info */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-purple-100 mb-1">
                {token.metadata.name}
              </h3>
              <p className="text-purple-300 font-mono">${token.metadata.symbol}</p>
            </div>

            {/* Description */}
            {token.metadata.description && (
              <p className="text-purple-200 text-sm mb-4 line-clamp-2">
                {token.metadata.description}
              </p>
            )}

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between text-purple-300">
                <span>Supply:</span>
                <span className="text-purple-100 font-semibold">
                  {token.metadata.totalSupply.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Decimals:</span>
                <span className="text-purple-100">{token.metadata.decimals}</span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Network:</span>
                <span className="text-purple-100 capitalize">
                  {token.network === "gor" ? (
                    <span className="text-yellow-300">$GOR Chain</span>
                  ) : (
                    token.network
                  )}
                </span>
              </div>
              <div className="flex justify-between text-purple-300">
                <span>Mintable:</span>
                <span
                  className={
                    token.metadata.mintable ? "text-green-400" : "text-red-400"
                  }
                >
                  {token.metadata.mintable ? "Yes" : "No"}
                </span>
              </div>
            </div>

            {/* Mint Address */}
            <div className="mb-4">
              <p className="text-purple-400 text-xs mb-1">Mint Address:</p>
              <p className="text-purple-200 text-xs font-mono bg-purple-900/50 p-2 rounded break-all">
                {token.mintAddress}
              </p>
            </div>

            {/* View on Explorer */}
            <a
              href={getExplorerUrl(token.mintAddress, token.network)}
              target="_blank"
              rel="noopener noreferrer"
              className={`block w-full text-center py-2 rounded-lg font-semibold transition-all ${
                token.network === "gor"
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700 text-white"
              }`}
            >
              {token.network === "gor"
                ? "GOR Explorer (Coming Soon)"
                : "View on Solscan"}
            </a>

            {/* Created Date */}
            <p className="text-purple-400 text-xs text-center mt-3">
              Created {new Date(token.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
