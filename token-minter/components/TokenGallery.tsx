"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
    const cluster = network === "mainnet-beta" ? "" : `?cluster=${network}`;
    return `https://solscan.io/token/${mintAddress}${cluster}`;
  };

  if (loading) {
    return (
      <div className="text-center text-foreground-muted py-12 text-lg animate-pulse">
        Loading tokens...
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 shadow-lg shadow-red-500/10">
        {error}
      </div>
    );
  }

  if (tokens.length === 0) {
    return (
      <div className="text-center text-foreground-muted py-12">
        <p className="text-xl mb-2">No tokens created yet</p>
        <p className="text-foreground-muted/70">Be the first to create a token!</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-accent-lime mb-6 animate-glow">
        Created Tokens ({tokens.length})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tokens.map((token) => (
          <div
            key={token.id}
            className="bg-dark-green-transparent backdrop-blur-sm border border-accent-lime/30 rounded-xl p-6 hover:border-accent-lime hover:shadow-xl hover:shadow-accent-lime/20 transition-all transform hover:scale-105 animate-fade-in"
          >
            {/* Token Image */}
            {token.metadata.imageUrl && (
              <div className="mb-4 flex justify-center">
                <Image
                  src={token.metadata.imageUrl}
                  alt={token.metadata.name}
                  width={96}
                  height={96}
                  className="w-24 h-24 rounded-full border-4 border-accent-lime/50 shadow-lg shadow-accent-lime/20"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Token Info */}
            <div className="text-center mb-4">
              <h3 className="text-xl font-bold text-accent-lime mb-1">
                {token.metadata.name}
              </h3>
              <p className="text-accent-lime-bright font-mono font-bold text-lg">${token.metadata.symbol}</p>
            </div>

            {/* Description */}
            {token.metadata.description && (
              <p className="text-foreground-muted text-sm mb-4 line-clamp-2">
                {token.metadata.description}
              </p>
            )}

            {/* Details */}
            <div className="space-y-2 mb-4 text-sm bg-dark-green-secondary p-3 rounded-lg border border-accent-lime/20">
              <div className="flex justify-between text-foreground-muted">
                <span>Supply:</span>
                <span className="text-accent-lime font-semibold">
                  {token.metadata.totalSupply.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-foreground-muted">
                <span>Decimals:</span>
                <span className="text-accent-lime">{token.metadata.decimals}</span>
              </div>
              <div className="flex justify-between text-foreground-muted">
                <span>Network:</span>
                <span className="text-accent-lime capitalize font-semibold">
                  {token.network}
                </span>
              </div>
              <div className="flex justify-between items-center text-foreground-muted">
                <span>Revoke Mint:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      token.metadata.revokeMint ? "text-accent-lime-bright font-semibold" : "text-red-400 font-semibold"
                    }
                  >
                    {token.metadata.revokeMint ? "Yes" : "No"}
                  </span>
                  {token.metadata.revokeMint && (
                    <span className="text-[10px] font-bold text-dark-green bg-accent-lime-bright px-1.5 py-0.5 rounded">FREE</span>
                  )}
                </div>
              </div>
              <div className="flex justify-between items-center text-foreground-muted">
                <span>Revoke Freeze:</span>
                <div className="flex items-center gap-2">
                  <span
                    className={
                      token.metadata.revokeFreeze ? "text-accent-lime-bright font-semibold" : "text-red-400 font-semibold"
                    }
                  >
                    {token.metadata.revokeFreeze ? "Yes" : "No"}
                  </span>
                  {token.metadata.revokeFreeze && (
                    <span className="text-[10px] font-bold text-dark-green bg-accent-lime-bright px-1.5 py-0.5 rounded">FREE</span>
                  )}
                </div>
              </div>
            </div>

            {/* Mint Address */}
            <div className="mb-4">
              <p className="text-foreground-muted text-xs mb-1 font-semibold">Mint Address:</p>
              <p className="text-accent-lime text-xs font-mono bg-dark-green-secondary p-2 rounded border border-accent-lime/20 break-all">
                {token.mintAddress}
              </p>
            </div>

            {/* View on Explorer */}
            <a
              href={getExplorerUrl(token.mintAddress, token.network)}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full text-center py-3 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg bg-accent-lime hover:bg-accent-lime-bright text-dark-green shadow-accent-lime/30 hover:shadow-accent-lime/50 border-2 border-accent-lime/50 hover:border-accent-lime"
            >
              View on Solscan
            </a>

            {/* Created Date */}
            <p className="text-foreground-muted/70 text-xs text-center mt-3">
              Created {new Date(token.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
