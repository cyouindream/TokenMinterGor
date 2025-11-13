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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div
        className={`bg-gradient-to-br from-purple-900/95 to-pink-900/95 border-2 border-purple-500 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ${
          showAnimation
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header with Animation */}
        <div className="text-center p-8 border-b border-purple-700">
          <div className="mb-4 flex justify-center">
            <div
              className={`w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center transition-all duration-700 ${
                showAnimation ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <svg
                className="w-12 h-12 text-white"
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
            className={`text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500 mb-2 transition-all duration-500 delay-200 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Congratulations!
          </h2>
          <p
            className={`text-xl text-purple-200 transition-all duration-500 delay-300 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your SPL Token Has Been Successfully Created! 🎉
          </p>
        </div>

        {/* Token Information */}
        <div className="p-6 space-y-6">
          {/* Token Details */}
          <div
            className={`bg-purple-800/40 border border-purple-600 rounded-lg p-5 transition-all duration-500 delay-400 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-lg font-semibold text-purple-200 mb-3 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              Token Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-purple-300">Name:</span>
                <span className="text-purple-100 font-semibold">
                  {token.metadata.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Symbol:</span>
                <span className="text-purple-100 font-semibold">
                  {token.metadata.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-300">Mint Address:</span>
                <span className="text-purple-100 font-mono text-xs">
                  {truncateAddress(token.mintAddress)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div
            className={`bg-blue-900/30 border border-blue-600 rounded-lg p-5 transition-all duration-500 delay-500 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-lg font-semibold text-blue-200 mb-3 flex items-center gap-2">
              <span className="text-2xl">💸</span>
              Transaction Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-blue-300">From Wallet:</span>
                <span className="text-blue-100 font-mono text-xs">
                  {truncateAddress(transactionDetails.fromWallet)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">To Wallet (Service):</span>
                <span className="text-blue-100 font-mono text-xs">
                  {truncateAddress(transactionDetails.toWallet)}
                </span>
              </div>
              <div className="border-t border-blue-700 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Service Fee:</span>
                <span className="text-blue-100 font-semibold">
                  {formatSOL(transactionDetails.serviceFee)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300">Network Fee (Gas):</span>
                <span className="text-blue-100 font-semibold">
                  {formatSOL(transactionDetails.networkFee)} SOL
                </span>
              </div>
              <div className="border-t border-blue-700 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-blue-300 font-semibold">Total Cost:</span>
                <span className="text-blue-100 font-bold text-base">
                  {formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Balance Changes */}
          <div
            className={`bg-emerald-900/30 border border-emerald-600 rounded-lg p-5 transition-all duration-500 delay-600 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-lg font-semibold text-emerald-200 mb-3 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Wallet Balance
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">Before Transaction:</span>
                <span className="text-emerald-100 font-semibold">
                  {formatSOL(transactionDetails.balanceBefore)} SOL
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300">After Transaction:</span>
                <span className="text-emerald-100 font-semibold">
                  {formatSOL(transactionDetails.balanceAfter)} SOL
                </span>
              </div>
              <div className="border-t border-emerald-700 my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-red-300 font-semibold">Change:</span>
                <span className="text-red-300 font-bold text-base">
                  -{formatSOL(transactionDetails.totalCost)} SOL
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Link */}
          <div
            className={`bg-indigo-900/30 border border-indigo-600 rounded-lg p-4 transition-all duration-500 delay-700 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-indigo-300 text-sm">View on Solscan:</span>
              <a
                href={`https://solscan.io/tx/${transactionDetails.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 underline text-sm font-mono"
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
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
            >
              Return to Main Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
