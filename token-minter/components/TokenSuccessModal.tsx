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

  const getExplorerUrl = (mintAddress: string, network: string) => {
    const explorerBaseUrl = (process.env.NEXT_PUBLIC_EXPLORER_URL || "https://solscan.io").replace(/\/+$/g, "");
    // Use address path and do not append cluster query string per request
    return `${explorerBaseUrl}/address/${mintAddress}`;
  };

  const formatGOR = (amount: number) => {
    return amount.toFixed(6);
  };

  const formatSupply = (supply: number) => {
    return supply.toLocaleString('en-US');
  };

  const formatTokenAmount = (amount: number) => {
    return amount.toLocaleString('en-US', { maximumFractionDigits: 6 });
  };

  return (
    <div className="fixed inset-0 bg-black/95 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div
        className={`bg-dark-green-secondary rounded-2xl shadow-2xl shadow-accent-lime/30 max-w-2xl w-full transition-all duration-500 ${
          showAnimation
            ? "opacity-100 scale-100"
            : "opacity-0 scale-95"
        }`}
      >
        {/* Success Header with Animation - At top */}
        <div
          className={`text-center p-6 rounded-t-xl border-b-2 border-accent-lime bg-dark-green-transparent transition-all duration-500 delay-200 ${
            showAnimation ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <h2 className="text-3xl font-bold text-accent-lime mb-2">Congratulations!</h2>
          <p className="text-base text-foreground-muted font-semibold">
            Your SPL Token Has Been Successfully Created!
          </p>
        </div>

        {/* Token Information */}
        <div className="p-6 space-y-6">
          {/* Token Details */}
          <div
            className={`rounded-lg p-5 transition-all duration-500 delay-400 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <div className="space-y-3 text-base">
              {token.metadata.imageUrl && (
                <div className="flex justify-center mb-4">
                  <img
                    src={token.metadata.imageUrl}
                    alt={token.metadata.name}
                    className="w-20 h-20 rounded-full object-cover border-2 border-accent-lime/50 shadow-lg"
                  />
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-foreground-muted font-semibold">Name:</span>
                <span className="text-accent-lime font-bold">
                  {token.metadata.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground-muted font-semibold">Total Supply:</span>
                <span className="text-accent-lime-bright font-bold">
                  {formatSupply(token.metadata.totalSupply)}
                </span>
              </div>
              <div>
                <div className="text-foreground-muted font-semibold mb-2">Mint Address:</div>
                <div className="text-accent-lime font-mono text-xs bg-dark-green-secondary px-3 py-2 rounded break-all border border-accent-lime/30">
                  {token.mintAddress}
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Details */}
          <div
            className={`rounded-lg p-5 transition-all duration-500 delay-500 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
            <div className="space-y-3 text-base">
              <div>
                <div className="text-foreground-muted font-semibold mb-2">From Wallet:</div>
                <div className="text-accent-lime font-mono text-xs bg-dark-green-secondary px-3 py-2 rounded break-all border border-accent-lime/30">
                  {transactionDetails.fromWallet}
                </div>
              </div>
              <div>
                <div className="text-foreground-muted font-semibold mb-2">To Wallet (Service):</div>
                <div className="text-accent-lime font-mono text-xs bg-dark-green-secondary px-3 py-2 rounded break-all border border-accent-lime/30">
                  {transactionDetails.toWallet}
                </div>
              </div>
              <div className="border-t border-accent-lime/50 my-3"></div>
              {transactionDetails.feeOption === "paid" ? (
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted font-semibold">Service Fee:</span>
                  <span className="text-accent-lime-bright font-bold">
                    {formatGOR(transactionDetails.serviceFee)} GOR
                  </span>
                </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-foreground-muted font-semibold">Donation:</span>
                  <span className="text-accent-lime-bright font-bold">
                    {transactionDetails.donationAmount && formatTokenAmount(transactionDetails.donationAmount)} {transactionDetails.tokenSymbol}
                  </span>
                </div>
              )}
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
            className={`rounded-lg p-5 transition-all duration-500 delay-600 ${
              showAnimation
                ? "opacity-100 translate-x-0"
                : "opacity-0 -translate-x-4"
            }`}
          >
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
                  -{formatGOR(transactionDetails.totalCost)} GOR
                </span>
              </div>
            </div>
          </div>

          {/* View on Explorer */}
          <div
            className={`rounded-lg p-5 transition-all duration-500 delay-700 ${
              showAnimation
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <div>
              <div className="text-foreground-muted font-semibold mb-3">View on Explorer:</div>
              <a
                href={getExplorerUrl(token.mintAddress, token.network)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-lime hover:text-accent-lime-bright underline font-mono text-xs break-all transition-colors block bg-dark-green-secondary px-3 py-2 rounded border border-accent-lime/30 hover:border-accent-lime/50"
              >
                {token.mintAddress}
              </a>
            </div>
          </div>

          {/* Close Button */}
          <div
            className={`pt-4 transition-all duration-500 delay-1000 ${
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
