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
        className={`bg-gradient-to-br from-purple-900/98 via-pink-950/98 to-pink-900/98 dark:from-purple-950/98 dark:via-pink-900/98 dark:to-pink-950/98 border-4 border-pink-500/50 dark:border-pink-600/50 rounded-2xl shadow-2xl shadow-pink-500/30 dark:shadow-pink-500/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ${
          showAnimation
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header with Animation */}
        <div className="text-center p-8 border-b border-pink-600/50 dark:border-pink-700/50 bg-gradient-to-r from-pink-900/30 to-purple-900/30 dark:from-pink-950/30 dark:to-purple-950/30">
          <div className="mb-4 flex justify-center">
            <div
              className={`w-24 h-24 bg-gradient-to-br from-purple-300 to-purple-500 dark:from-purple-400 dark:to-purple-600 rounded-full flex items-center justify-center transition-all duration-700 shadow-xl shadow-purple-400/50 dark:shadow-purple-500/40 ${
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
            className={`text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-pink-400 dark:from-purple-200 dark:via-pink-200 dark:to-pink-300 mb-3 transition-all duration-500 delay-200 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            ✨ Congratulations! ✨
          </h2>
          <p
            className={`text-xl text-purple-100 dark:text-purple-200 font-semibold transition-all duration-500 delay-300 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your SPL Token Has Been Successfully Created! ✨💫
          </p>
        </div>

        {/* Token Information */}
        <div className="p-6 space-y-6">
          {/* Token Details */}
          <div
            className={`bg-gradient-to-r from-purple-900/50 to-pink-900/50 dark:from-purple-950/50 dark:to-pink-950/50 border-2 border-pink-600/50 dark:border-pink-700/50 rounded-lg p-5 shadow-lg dark:shadow-md transition-all duration-500 delay-400 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-pink-300 dark:text-pink-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              Token Information
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Name:</span>
                <span className="text-purple-100 dark:text-purple-50 font-bold">
                  {token.metadata.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Symbol:</span>
                <span className="text-pink-300 dark:text-pink-200 font-bold text-lg">
                  ${token.metadata.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Mint Address:</span>
                <span className="text-purple-100 dark:text-purple-50 font-mono text-sm bg-purple-950/50 dark:bg-purple-900/70 px-2 py-1 rounded">
                  {truncateAddress(token.mintAddress)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div
            className={`bg-gradient-to-r from-pink-950/50 to-purple-950/50 dark:from-pink-900/50 dark:to-purple-900/50 border-2 border-pink-600/40 dark:border-pink-700/40 rounded-lg p-5 shadow-lg dark:shadow-md transition-all duration-500 delay-500 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-pink-300 dark:text-pink-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">💸</span>
              Transaction Details
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">From Wallet:</span>
                <span className="text-purple-100 dark:text-purple-50 font-mono text-sm bg-purple-950/50 dark:bg-purple-900/70 px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.fromWallet)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">To Wallet (Service):</span>
                <span className="text-purple-100 dark:text-purple-50 font-mono text-sm bg-purple-950/50 dark:bg-purple-900/70 px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.toWallet)}
                </span>
              </div>
              <div className="border-t border-pink-700/50 dark:border-pink-600/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Service Fee:</span>
                <div className="flex items-center gap-2">
                  <span className="text-pink-300 dark:text-pink-200 font-bold">
                    {formatSOL(transactionDetails.serviceFee)} SOL
                  </span>
                  <a
                    href={`https://solscan.io/tx/${transactionDetails.signature}?cluster=devnet`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink-400 dark:text-pink-300 hover:text-pink-300 dark:hover:text-pink-200 transition-colors text-sm underline"
                    title="View transaction on Solscan"
                  >
                    View
                  </a>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Network Fee (Gas):</span>
                <span className="text-pink-300 dark:text-pink-200 font-bold">
                  {formatSOL(transactionDetails.networkFee)} SOL
                </span>
              </div>
              <div className="border-t border-pink-700/50 dark:border-pink-600/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-pink-300 dark:text-pink-200 font-bold text-lg">Total Cost:</span>
                <span className="text-pink-300 dark:text-pink-200 font-bold text-xl">
                  {formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Balance Changes */}
          <div
            className={`bg-gradient-to-r from-purple-950/50 to-pink-950/50 dark:from-purple-900/50 dark:to-pink-900/50 border-2 border-purple-600/40 dark:border-purple-700/40 rounded-lg p-5 shadow-lg dark:shadow-md transition-all duration-500 delay-600 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-purple-300 dark:text-purple-200 mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Wallet Balance
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">Before Transaction:</span>
                <span className="text-purple-100 dark:text-purple-50 font-bold">
                  {formatSOL(transactionDetails.balanceBefore)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-300 dark:text-purple-200 font-semibold">After Transaction:</span>
                <span className="text-purple-100 dark:text-purple-50 font-bold">
                  {formatSOL(transactionDetails.balanceAfter)} SOL
                </span>
              </div>
              <div className="border-t border-purple-700/50 dark:border-purple-600/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-pink-400 dark:text-pink-300 font-bold text-lg">Change:</span>
                <span className="text-pink-400 dark:text-pink-300 font-bold text-xl">
                  -{formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Link */}
          <div
            className={`bg-gradient-to-r from-pink-950/50 to-purple-950/50 dark:from-pink-900/50 dark:to-purple-900/50 border-2 border-pink-600/40 dark:border-pink-700/40 rounded-lg p-5 shadow-lg dark:shadow-md transition-all duration-500 delay-700 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-pink-200 dark:text-pink-100 font-semibold">🔍 View on Solscan:</span>
              <a
                href={`https://solscan.io/tx/${transactionDetails.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-pink-400 dark:text-pink-300 hover:text-pink-300 dark:hover:text-pink-200 underline font-mono text-sm transition-colors"
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
              className="w-full bg-gradient-to-r from-pink-600 via-pink-700 to-purple-700 dark:from-pink-700 dark:via-pink-800 dark:to-purple-800 hover:from-pink-700 hover:via-pink-800 hover:to-purple-800 dark:hover:from-pink-600 dark:hover:via-pink-700 dark:hover:to-purple-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-xl shadow-pink-500/50 dark:shadow-pink-500/30 hover:shadow-2xl hover:shadow-pink-500/60 dark:hover:shadow-pink-500/40 transform hover:scale-[1.02]"
            >
              ✨ Return to Main Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
