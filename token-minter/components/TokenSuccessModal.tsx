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

  const formatGOR = (amount: number) => {
    return amount.toFixed(6);
  };

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`bg-dark-green-secondary border-4 border-accent-lime/50 rounded-2xl shadow-2xl shadow-accent-lime/30 max-w-2xl w-full max-h-[90vh] overflow-y-auto transition-all duration-500 ${
          showAnimation
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header with Animation */}
        <div className="text-center p-8 border-b border-accent-lime/50 bg-dark-green-transparent">
          <div className="mb-4 flex justify-center">
            <div
              className={`w-24 h-24 bg-accent-lime rounded-full flex items-center justify-center transition-all duration-700 shadow-xl shadow-accent-lime/50 animate-glow ${
                showAnimation ? "scale-100 rotate-0" : "scale-0 rotate-180"
              }`}
            >
              <svg
                className="w-14 h-14 text-dark-green"
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
            className={`text-4xl font-bold text-accent-lime mb-3 transition-all duration-500 delay-200 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Congratulations!
          </h2>
          <p
            className={`text-xl text-foreground-muted font-semibold transition-all duration-500 delay-300 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            Your SPL Token Has Been Successfully Created!
          </p>
        </div>

        {/* Token Information */}
        <div className="p-6 space-y-6">
          {/* Token Details */}
          <div
            className={`bg-dark-green-transparent border-2 border-accent-lime/50 rounded-lg p-5 shadow-lg transition-all duration-500 delay-400 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-accent-lime mb-4 flex items-center gap-2">
              <span className="text-2xl">🪙</span>
              Token Information
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-foreground-muted font-semibold">Name:</span>
                <span className="text-accent-lime font-bold">
                  {token.metadata.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-muted font-semibold">Symbol:</span>
                <span className="text-accent-lime-bright font-bold text-lg">
                  ${token.metadata.symbol}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">Mint Address:</span>
                <span className="text-accent-lime font-mono text-sm bg-dark-green-secondary px-2 py-1 rounded">
                  {truncateAddress(token.mintAddress)}
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div
            className={`bg-dark-green-transparent border-2 border-accent-lime/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-500 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-accent-lime mb-4 flex items-center gap-2">
              <span className="text-2xl">💸</span>
              Transaction Details
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">From Wallet:</span>
                <span className="text-accent-lime font-mono text-sm bg-dark-green-secondary px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.fromWallet)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">To Wallet (Service):</span>
                <span className="text-accent-lime font-mono text-sm bg-dark-green-secondary px-2 py-1 rounded">
                  {truncateAddress(transactionDetails.toWallet)}
                </span>
              </div>
              <div className="border-t border-accent-lime/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">Service Fee:</span>
                <span className="text-accent-lime-bright font-bold">
                  {formatGOR(transactionDetails.serviceFee)} GOR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">Network Fee (Gas):</span>
                <span className="text-accent-lime-bright font-bold">
                  {formatGOR(transactionDetails.networkFee)} GOR
                </span>
              </div>
              <div className="border-t border-accent-lime/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-accent-lime font-bold text-lg">Total Cost:</span>
                <span className="text-accent-lime-bright font-bold text-xl">
                  {formatGOR(transactionDetails.totalCost)} GOR
                </span>
              </div>
            </div>
          </div>

          {/* Balance Changes */}
          <div
            className={`bg-dark-green-transparent border-2 border-accent-lime/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-600 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <h3 className="text-xl font-bold text-accent-lime mb-4 flex items-center gap-2">
              <span className="text-2xl">💰</span>
              Wallet Balance
            </h3>
            <div className="space-y-3 text-base">
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">Before Transaction:</span>
                <span className="text-accent-lime font-bold">
                  {formatGOR(transactionDetails.balanceBefore)} GOR
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">After Transaction:</span>
                <span className="text-accent-lime font-bold">
                  {formatGOR(transactionDetails.balanceAfter)} GOR
                </span>
              </div>
              <div className="border-t border-accent-lime/50 my-3"></div>
              <div className="flex justify-between items-center">
                <span className="text-accent-lime-bright font-bold text-lg">Change:</span>
                <span className="text-accent-lime-bright font-bold text-xl">
                  -{formatSOL(transactionDetails.totalCost)} GOR
                </span>
              </div>
            </div>
          </div>

          {/* Transaction Link */}
          <div
            className={`bg-dark-green-transparent border-2 border-accent-lime/40 rounded-lg p-5 shadow-lg transition-all duration-500 delay-700 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-foreground-muted font-semibold">View on Solscan:</span>
              <a
                href={`https://solscan.io/tx/${transactionDetails.signature}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-lime hover:text-accent-lime-bright underline font-mono text-sm transition-colors"
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
              className="w-full bg-accent-lime hover:bg-accent-lime-bright text-dark-green font-bold py-4 px-6 rounded-lg transition-all shadow-xl shadow-accent-lime/50 hover:shadow-2xl hover:shadow-accent-lime/60 transform hover:scale-[1.02] border-2 border-accent-lime/50 hover:border-accent-lime"
            >
              Return to Main Screen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
