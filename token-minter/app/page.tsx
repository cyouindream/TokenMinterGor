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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      {/* Header */}
      <header className="border-b border-purple-200/50 dark:border-purple-700/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-lg">
                Token Minter
              </div>
              <div className="text-xs text-purple-700 dark:text-purple-300 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/60 dark:to-pink-900/60 px-3 py-1.5 rounded-lg border border-purple-300/50 dark:border-purple-500/30 shadow-lg">
                Solana SPL Token Minter
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-purple-700 dark:text-purple-300">
                <span className="opacity-70">Network:</span> <span className="font-semibold">Devnet</span>
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
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-xl shadow-purple-300/50 border border-purple-300/30"
                : "bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/40 border border-purple-300/50 dark:border-purple-700/50"
            }`}
          >
            Create Token
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === "gallery"
                ? "bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-xl shadow-purple-300/50 border border-purple-300/30"
                : "bg-purple-100/50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200/50 dark:hover:bg-purple-800/40 border border-purple-300/50 dark:border-purple-700/50"
            }`}
          >
            Token Gallery
          </button>
        </div>

        {/* Content */}
        {activeTab === "create" ? (
          <div className="max-w-3xl mx-auto">
            {!connected ? (
              <div className="bg-white/70 dark:bg-slate-800/70 backdrop-blur-sm border border-purple-300/50 dark:border-purple-700/30 rounded-xl p-12 text-center shadow-2xl">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                  Connect Your Wallet
                </h2>
                <p className="text-purple-700 dark:text-purple-300 mb-6 text-lg">
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
      <footer className="border-t border-purple-200/50 dark:border-purple-700/30 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-purple-700 dark:text-purple-300">
            <div>
              Created by{" "}
              <a
                href="https://x.com/cyouindream"
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-500 dark:text-pink-400 hover:text-pink-600 dark:hover:text-pink-300 underline font-semibold transition-colors"
              >
                @cyouindream
              </a>
            </div>
            <div className="flex gap-6">
              <span>Token-2022 Standard</span>
              <span className="text-purple-400">•</span>
              <span>Solana Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
