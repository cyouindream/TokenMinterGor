"use client";

import { TransactionDetails, CreatedToken } from "@/types/token";
import { useEffect, useState } from "react";

interface TokenSuccessModalProps {
  token: CreatedToken;
  transactionDetails: TransactionDetails;
  onClose: () => void;
}

export default function TokenSuccessModal({
  token,
  transactionDetails,
  onClose,
}: TokenSuccessModalProps) {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    setTimeout(() => setShowAnimation(true), 100);
  }, []);

  const formatSOL = (amount: number) => {
    return amount.toFixed(6);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gradient-to-br from-emerald-900/98 via-red-950/98 to-emerald-900/98 border-4 border-amber-500/50 rounded-2xl shadow-2xl shadow-amber-500/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ${
          showAnimation
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header with Animation */}
        <div className="text-center p-8 border-b border-amber-600/50 bg-gradient-to-r from-red-900/30 to-emerald-900/30">
          <div className="mb-4 flex justify-center">
            <div
              className={`w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl shadow-emerald-500/50 ${
                showAnimation ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <svg
                className="w-14 h-14 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>
          <h2
            className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-amber-300 to-red-400 mb-3 transition-all duration-500 delay-200 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            🎄 Congratulations! 🎄
          </h2>
          <p
            className={`text-xl text-emerald-100 font-semibold transition-all duration-500 delay-300 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your SPL Token Has Been Successfully Created! 🎁✨
          </p>
        </div>

        {/* Token Information */}
        <div className="p-6 space-y-6">
          {/* Token Details */}
          <div
            className={`bg-gradient-to-r from-emerald-900/50 to-red-900/50 border-2 border-amber-600/50 rounded-lg p-5 shadow-lg transition-all duration-500 delay-400 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-amber-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              Token Information
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-emerald-300 font-semibold">Name:</span>
                <span className="text-emerald-100 font-bold">
                  {token.metadata.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-emerald-300 font-semibold">Symbol:</span>
                <span className="text-amber-300 font-bold text-lg">
                  ${token.metadata.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">Mint Address:</span>
                <span className="text-emerald-100 font-mono text-sm bg-emerald-950/50 px-2 py-1 rounded">
                  {truncateAddress(token.mintAddress)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div
            className={`bg-gradient-to-r from-red-950/50 to-emerald-950/50 border-2 border-red-600/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-500 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">💸</span>
              Transaction Details
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">From Wallet:</span>
                <span className="text-emerald-100 font-mono text-sm bg-emerald-950/50 px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.fromWallet)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">To Wallet (Service):</span>
                <span className="text-emerald-100 font-mono text-sm bg-emerald-950/50 px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.toWallet)}
                </span>
              </div>
              <div className="border-t border-red-700/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">Service Fee:</span>
                <span className="text-amber-300 font-bold">
                  {formatSOL(transactionDetails.serviceFee)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">Network Fee (Gas):</span>
                <span className="text-amber-300 font-bold">
                  {formatSOL(transactionDetails.networkFee)} SOL
                </span>
              </div>
              <div className="border-t border-red-700/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-red-300 font-bold text-lg">Total Cost:</span>
                <span className="text-amber-300 font-bold text-xl">
                  {formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Balance Changes */}
          <div
            className={`bg-gradient-to-r from-emerald-950/50 to-red-950/50 border-2 border-emerald-600/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-600 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-emerald-300 mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Wallet Balance
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">Before Transaction:</span>
                <span className="text-emerald-100 font-bold">
                  {formatSOL(transactionDetails.balanceBefore)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-semibold">After Transaction:</span>
                <span className="text-emerald-100 font-bold">
                  {formatSOL(transactionDetails.balanceAfter)} SOL
                </span>
              </div>
              <div className="border-t border-emerald-700/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-red-400 font-bold text-lg">Change:</span>
                <span className="text-red-400 font-bold text-xl">
                  -{formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Link */}
          <div
            className={`bg-gradient-to-r from-amber-950/50 to-red-950/50 border-2 border-amber-600/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-700 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-amber-200 font-semibold">🔍 View on Solscan:</span>
              <a
                href={`https://solscan.io/tx/${transactionDetails.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-400 hover:text-amber-300 underline font-mono text-sm transition-colors"
              >
                {truncateAddress(transactionDetails.signature)}
              </a>
            </div>
          </div>

          {/* Close Button */}
          <div
            className={`pt-4 transition-all duration-500 delay-800 ${
              showAnimation
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95"
            }`}
          >
            <button
              onClick={onClose}
              className="w-full bg-gradient-to-r from-red-600 via-red-700 to-emerald-700 hover:from-red-700 hover:via-red-800 hover:to-emerald-800 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-xl shadow-red-500/50 hover:shadow-2xl hover:shadow-red-500/60 transform hover:scale-[1.02]"
            >
              🎄 Return to Main Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
