"use client";

import { useState } from "react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenCreationForm from "@/components/TokenCreationForm";
import TokenGallery from "@/components/TokenGallery";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Header */}
      <header className="border-b border-purple-700 bg-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
                Token Minter
              </div>
              <div className="text-xs text-purple-300 bg-purple-800/50 px-2 py-1 rounded">
                Powered by Solana
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-200">
                <span className="opacity-70">Network:</span> <span className="font-semibold">Devnet</span>
              </div>
              <div className="text-sm text-purple-200 opacity-50">
                | Coming Soon: <span className="text-yellow-300">$GOR Chain</span>
              </div>
              <WalletMultiButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "create"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-purple-800/30 text-purple-300 hover:bg-purple-800/50"
            }`}
          >
            Create Token
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === "gallery"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-purple-800/30 text-purple-300 hover:bg-purple-800/50"
            }`}
          >
            Token Gallery
          </button>
        </div>

        {/* Content */}
        {activeTab === "create" ? (
          <div className="max-w-3xl mx-auto">
            {!connected ? (
              <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700 rounded-xl p-12 text-center">
                <h2 className="text-2xl font-bold text-purple-100 mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-purple-300 mb-6">
                  Connect your Solana wallet to start creating SPL tokens
                </p>
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
              </div>
            ) : (
              <TokenCreationForm />
            )}
          </div>
        ) : (
          <TokenGallery />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-purple-700 bg-purple-900/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-purple-300">
            <div>
              Created by{" "}
              <a
                href="https://x.com/cyouindream"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-200 hover:text-purple-100 underline"
              >
                @cyouindream
              </a>
            </div>
            <div className="flex gap-6">
              <span>Token-2022 Standard</span>
              <span>•</span>
              <span>Solana Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
