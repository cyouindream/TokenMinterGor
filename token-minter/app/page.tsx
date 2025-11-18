"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Image from "next/image";
import TokenCreationForm from "@/components/TokenCreationForm";
import TokenGallery from "@/components/TokenGallery";
import WalletButton from "@/components/WalletButton";

export default function Home() {
  const { connected } = useWallet();
  const [activeTab, setActiveTab] = useState<"create" | "gallery">("create");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent-lime/30 bg-dark-green-transparent backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src="/GorbaganaIcon.png"
                alt="Gorbagana Logo"
                width={48}
                height={48}
                className="w-12 h-12 rounded-full shadow-lg shadow-accent-lime/30"
              />
              <div className="text-3xl font-bold text-accent-lime drop-shadow-lg animate-glow">
                Token Minter
              </div>
              <div className="text-xs text-foreground-muted bg-dark-green-secondary px-3 py-1.5 rounded-lg border border-accent-lime/30 shadow-lg">
                Gorbagana SPL Token Minter
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm text-foreground-muted">
                <span className="opacity-70">Network:</span> <span className="font-semibold text-accent-lime">Devnet</span>
              </div>
              <WalletButton />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab("create")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === "create"
                ? "bg-accent-lime text-dark-green shadow-xl shadow-accent-lime/50 border border-accent-lime"
                : "bg-dark-green-secondary text-foreground-muted hover:bg-dark-green-transparent hover:text-accent-lime border border-accent-lime/30 hover:border-accent-lime/50"
            }`}
          >
            Create Token
          </button>
          <button
            onClick={() => setActiveTab("gallery")}
            className={`px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105 ${
              activeTab === "gallery"
                ? "bg-accent-lime text-dark-green shadow-xl shadow-accent-lime/50 border border-accent-lime"
                : "bg-dark-green-secondary text-foreground-muted hover:bg-dark-green-transparent hover:text-accent-lime border border-accent-lime/30 hover:border-accent-lime/50"
            }`}
          >
            Token Gallery
          </button>
        </div>

        {/* Content */}
        {activeTab === "create" ? (
          <div className="max-w-3xl mx-auto">
            {!connected ? (
              <div className="bg-dark-green-transparent backdrop-blur-sm border border-accent-lime/30 rounded-xl p-12 text-center shadow-2xl shadow-accent-lime/10 animate-fade-in">
                <h2 className="text-3xl font-bold text-accent-lime mb-4 animate-glow">
                  Connect Your Wallet
                </h2>
                <p className="text-foreground-muted mb-6 text-lg">
                  Connect your Gorbagana wallet to start creating SPL tokens
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
      <footer className="border-t border-accent-lime/30 bg-dark-green-transparent backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between text-sm text-foreground-muted">
            <div>
              Created by{" "}
              <a
                href="https://x.com/cyouindream"
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-lime-bright hover:text-accent-lime underline font-semibold transition-colors"
              >
                @cyouindream
              </a>
            </div>
            <div className="flex gap-6">
              <span>Token-2022 Standard</span>
              <span className="text-accent-lime/50">•</span>
              <span>Gorbagana Network</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
