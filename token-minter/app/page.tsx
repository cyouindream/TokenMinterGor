"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import TokenCreationForm from "@/components/TokenCreationForm";
import TokenGallery from "@/components/TokenGallery";
import WalletButton from "@/components/WalletButton";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-red-950 to-emerald-900">
      {/* Header */}
      <header className="border-b border-emerald-700/50 bg-gradient-to-r from-red-900/40 via-emerald-900/40 to-red-900/40 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent drop-shadow-lg">
                Token Minter
              </div>
              <div className="text-xs text-amber-200 bg-gradient-to-r from-red-900/60 to-emerald-900/60 px-3 py-1.5 rounded-lg border border-amber-500/30 shadow-lg">
                Powered by Solana
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-emerald-100">
                <span className="opacity-70">Network:</span> <span className="font-semibold">Devnet</span>
              </div>
              <div className="text-sm text-emerald-200 opacity-50">
                | Coming Soon: <span className="text-amber-300 font-semibold">$GOR Chain</span>
              </div>
              <WalletButton />
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
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === "create"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-500/50 border border-red-400/30"
                : "bg-emerald-900/30 text-emerald-200 hover:bg-emerald-800/40 border border-emerald-700/50"
            }`}
          >
            Create Token
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === "gallery"
                ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-xl shadow-red-500/50 border border-red-400/30"
                : "bg-emerald-900/30 text-emerald-200 hover:bg-emerald-800/40 border border-emerald-700/50"
            }`}
          >
            Token Gallery
          </button>
        </div>

        {/* Content */}
        {activeTab === "create" ? (
          <div className="max-w-3xl mx-auto">
            {!connected ? (
              <div className="bg-gradient-to-br from-emerald-900/40 to-red-900/40 backdrop-blur-sm border border-amber-500/30 rounded-xl p-12 text-center shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-red-300 via-amber-200 to-emerald-300 bg-clip-text text-transparent mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-emerald-100 mb-6 text-lg">
                  Connect your Solana wallet to start creating SPL tokens
                </p>
                <div className="flex justify-center">
                  <WalletButton />
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
      <footer className="border-t border-emerald-700/50 bg-gradient-to-r from-red-900/40 via-emerald-900/40 to-red-900/40 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-emerald-200">
            <div>
              Created by{" "}
              <a
                href="https://x.com/cyouindream"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:text-amber-200 underline font-semibold transition-colors"
              >
                @cyouindream
              </a>
            </div>
            <div className="flex gap-6">
              <span>Token-2022 Standard</span>
              <span className="text-amber-400">•</span>
              <span>Solana Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
