"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import Image from "next/image";
import { TokenMetadata, CreatedToken, TransactionDetails } from "@/types/token";
import { createToken } from "@/lib/tokenService";
import TokenSuccessModal from "./TokenSuccessModal";

export default function TokenCreationForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  // Get configuration from environment variables
  const creationFee = process.env.NEXT_PUBLIC_CREATION_FEE || "0.03";
  const defaultDecimals = parseInt(process.env.NEXT_PUBLIC_DEFAULT_DECIMALS || "9");
  const defaultMaxSupply = parseInt(process.env.NEXT_PUBLIC_DEFAULT_MAX_SUPPLY || "1000000000");

  const [formData, setFormData] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
    decimals: defaultDecimals,
    totalSupply: defaultMaxSupply,
    imageUrl: "",
    revokeMint: false,
    revokeFreeze: false,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<CreatedToken | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [feeOption, setFeeOption] = useState<"paid" | "donation">("paid"); // New state for fee option

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setError("File size must be less than 5MB");
      return;
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      setError("File must be an image (JPEG, PNG, GIF, or WebP)");
      return;
    }

    setSelectedFile(file);
    setError(null);

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload file immediately
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setFormData((prev) => ({ ...prev, imageUrl: data.imageUrl }));
      } else {
        setError(data.error || "Failed to upload image");
        setSelectedFile(null);
        setImagePreview(null);
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
      setSelectedFile(null);
      setImagePreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!publicKey || !signTransaction) {
      setError("Please connect your wallet first");
      return;
    }

    console.log("[TokenCreationForm] Submitting token creation", {
      wallet: publicKey.toBase58(),
      feeOption,
      metadata: formData,
    });

    // Validate form
    if (!formData.name || !formData.symbol) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.symbol.length > 10) {
      setError("Symbol must be 10 characters or less");
      return;
    }

    setIsCreating(true);

    try {
      // Ensure imageUrl is included in metadata before sending
      const metadataToSend = {
        ...formData,
        imageUrl: formData.imageUrl || undefined, // Use uploaded image URL if available
      };

      const result = await createToken(
        connection,
        publicKey,
        signTransaction,
        metadataToSend,
        feeOption
      );

      if (result.success && result.token && result.transactionDetails) {
        console.log("[TokenCreationForm] Token creation succeeded", {
          token: result.token,
          transactionDetails: result.transactionDetails,
        });
        // Store token and transaction details
        setCreatedToken(result.token);
        setTransactionDetails(result.transactionDetails);
        setShowSuccessModal(true);

        // Reset form
        setFormData({
          name: "",
          symbol: "",
          description: "",
          decimals: defaultDecimals,
          totalSupply: defaultMaxSupply,
          imageUrl: "",
          revokeMint: false,
          revokeFreeze: false,
        });
        setSelectedFile(null);
        setImagePreview(null);
      } else {
        console.error("[TokenCreationForm] Token creation failed", result);
        setError(result.error || "Failed to create token");
      }
    } catch (err) {
      console.error("Token creation error:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    setCreatedToken(null);
    setTransactionDetails(null);
  };

  return (
    <div className="bg-dark-green-transparent backdrop-blur-sm border border-accent-lime/30 rounded-xl p-8 shadow-2xl shadow-accent-lime/10 animate-fade-in hover:border-accent-lime/50 transition-all">
      <div className="flex items-center gap-3 mb-6">
        <Image
          src="/GorbaganaIcon.png"
          alt="Gorbagana Logo"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full shadow-lg shadow-accent-lime/30"
        />
        <h2 className="text-3xl font-bold text-accent-lime animate-glow">
          Create Your Gorbagana Token
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name */}
        <div>
          <label className="block text-foreground-muted font-semibold mb-2">
            Token Name <span className="text-accent-lime-bright">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., My Amazing Token"
            className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime placeholder-foreground-muted/50 focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all hover:border-accent-lime/50"
            required
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-foreground-muted font-semibold mb-2">
            Token Symbol <span className="text-accent-lime-bright">*</span>
          </label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
            }
            placeholder="e.g., MAT"
            maxLength={10}
            className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime placeholder-foreground-muted/50 focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all hover:border-accent-lime/50"
            required
          />
          <p className="text-foreground-muted/70 text-sm mt-1">
            Maximum 10 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-foreground-muted font-semibold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your token..."
            rows={3}
            className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime placeholder-foreground-muted/50 focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all hover:border-accent-lime/50 resize-none"
          />
        </div>

        {/* Decimals and Total Supply */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-foreground-muted font-semibold mb-2">
              Decimals
            </label>
            <input
              type="number"
              value={formData.decimals}
              onChange={(e) =>
                setFormData({ ...formData, decimals: parseInt(e.target.value) })
              }
              min={0}
              max={9}
              className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all hover:border-accent-lime/50"
            />
            <p className="text-foreground-muted/70 text-sm mt-1">
              Recommended: 9 (like GOR)
            </p>
          </div>

          <div>
            <label className="block text-foreground-muted font-semibold mb-2">
              Total Supply
            </label>
            <input
              type="text"
              value={formData.totalSupply.toLocaleString()}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, '');
                const numValue = parseInt(value) || 0;
                setFormData({
                  ...formData,
                  totalSupply: numValue,
                });
              }}
              className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all hover:border-accent-lime/50"
            />
          </div>
        </div>

        {/* Token Icon Upload */}
        <div>
          <label className="block text-foreground-muted font-semibold mb-2">
            Token Icon (Optional)
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-dark-green-secondary border border-accent-lime/30 rounded-lg text-accent-lime file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-accent-lime file:text-dark-green hover:file:bg-accent-lime-bright focus:outline-none focus:border-accent-lime focus:ring-2 focus:ring-accent-lime/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:border-accent-lime/50"
            />
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-accent-lime/50 shadow-lg shadow-accent-lime/20">
                <Image
                  src={imagePreview}
                  alt="Token icon preview"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {isUploading && (
              <p className="text-accent-lime-bright text-sm animate-pulse">Uploading image...</p>
            )}
          </div>
          <p className="text-foreground-muted/70 text-sm mt-1">
            Max 5MB, JPEG, PNG, GIF, or WebP
          </p>
        </div>

        {/* Revoke Options */}
        <div className="space-y-4 bg-dark-green-secondary/50 border border-accent-lime/30 rounded-lg p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                id="revokeMint"
                checked={formData.revokeMint}
                onChange={(e) =>
                  setFormData({ ...formData, revokeMint: e.target.checked })
                }
                className="w-5 h-5 text-accent-lime bg-dark-green-secondary border-accent-lime/30 rounded focus:ring-accent-lime accent-accent-lime"
              />
              <label htmlFor="revokeMint" className="text-foreground-muted cursor-pointer">
                <span className="font-semibold">Revoke Mint</span>
                <p className="text-sm text-foreground-muted/70">No one will be able to create more tokens anymore</p>
              </label>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-foreground-muted/50 line-through">0.05 GOR</div>
              <div className="text-sm font-bold text-accent-lime-bright">FREE</div>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 flex-1">
              <input
                type="checkbox"
                id="revokeFreeze"
                checked={formData.revokeFreeze}
                onChange={(e) =>
                  setFormData({ ...formData, revokeFreeze: e.target.checked })
                }
                className="w-5 h-5 text-accent-lime bg-dark-green-secondary border-accent-lime/30 rounded focus:ring-accent-lime accent-accent-lime"
              />
              <label htmlFor="revokeFreeze" className="text-foreground-muted cursor-pointer">
                <span className="font-semibold">Revoke Freeze</span>
                <p className="text-sm text-foreground-muted/70">No one will be able to freeze holders&apos; token accounts anymore</p>
              </label>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-xs text-foreground-muted/50 line-through">0.05 GOR</div>
              <div className="text-sm font-bold text-accent-lime-bright">FREE</div>
            </div>
          </div>
        </div>

        {/* Fee Options */}
        <div className="space-y-4">
          <label className="block text-foreground-muted font-semibold mb-3">
            Choose Your Fee Option
          </label>

          {/* Option 1: Pay 0.1 GOR */}
          <div
            onClick={() => setFeeOption("paid")}
            className={`cursor-pointer bg-dark-green-secondary border-2 rounded-lg p-5 transition-all hover:border-accent-lime/70 ${
              feeOption === "paid"
                ? "border-accent-lime shadow-lg shadow-accent-lime/30"
                : "border-accent-lime/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="paidOption"
                  checked={feeOption === "paid"}
                  onChange={() => setFeeOption("paid")}
                  className="w-5 h-5 text-accent-lime bg-dark-green-secondary border-accent-lime/30 focus:ring-accent-lime accent-accent-lime"
                />
                <label htmlFor="paidOption" className="cursor-pointer">
                  <div className="font-bold text-accent-lime text-lg">Pay {creationFee} GOR</div>
                  <div className="text-sm text-foreground-muted/70">Simple flat fee - Keep 100% of your tokens</div>
                </label>
              </div>
              <div className="text-accent-lime-bright font-bold text-2xl">{creationFee} GOR</div>
            </div>
          </div>

          {/* Option 2: Free with 5% Donation */}
          <div
            onClick={() => setFeeOption("donation")}
            className={`cursor-pointer bg-dark-green-secondary border-2 rounded-lg p-5 transition-all hover:border-accent-lime/70 ${
              feeOption === "donation"
                ? "border-accent-lime shadow-lg shadow-accent-lime/30"
                : "border-accent-lime/30"
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <input
                  type="radio"
                  id="donationOption"
                  checked={feeOption === "donation"}
                  onChange={() => setFeeOption("donation")}
                  className="w-5 h-5 text-accent-lime bg-dark-green-secondary border-accent-lime/30 focus:ring-accent-lime accent-accent-lime"
                />
                <label htmlFor="donationOption" className="cursor-pointer">
                  <div className="font-bold text-accent-lime text-lg">
                    FREE
                    <span className="ml-2 text-xs bg-accent-lime text-dark-green px-2 py-1 rounded font-bold">
                      NO FEE
                    </span>
                  </div>
                  <div className="text-sm text-foreground-muted/70">Donate 5% of token supply to service wallet</div>
                </label>
              </div>
              <div className="text-accent-lime-bright font-bold text-2xl">5%</div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 text-red-300 shadow-lg shadow-red-500/10">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-accent-lime hover:bg-accent-lime-bright disabled:bg-foreground-muted/30 text-dark-green font-bold py-4 px-6 rounded-lg transition-all shadow-xl shadow-accent-lime/30 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100 hover:shadow-accent-lime/50 border-2 border-accent-lime/50 hover:border-accent-lime disabled:border-foreground-muted/20"
        >
          {isCreating
            ? "Creating Token..."
            : feeOption === "paid"
            ? `Create Token (${creationFee} GOR)`
            : `Create Token (FREE - 5% Donation)`}
        </button>
      </form>

      {/* Success Modal */}
      {showSuccessModal && createdToken && transactionDetails && (
        <TokenSuccessModal
          token={createdToken}
          transactionDetails={transactionDetails}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
