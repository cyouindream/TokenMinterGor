"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TokenMetadata, CreatedToken, TransactionDetails } from "@/types/token";
import { createToken } from "@/lib/tokenService";
import TokenSuccessModal from "./TokenSuccessModal";

export default function TokenCreationForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  // Get creation fee from environment variable
  const creationFee = process.env.NEXT_PUBLIC_CREATION_FEE || "0.03";

  const [formData, setFormData] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
    decimals: 9,
    totalSupply: 1000000000000,
    imageUrl: "",
    mintable: false,
  });

  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [createdToken, setCreatedToken] = useState<CreatedToken | null>(null);
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

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
      const result = await createToken(
        connection,
        publicKey,
        signTransaction,
        formData
      );

      if (result.success && result.token && result.transactionDetails) {
        // Store token and transaction details
        setCreatedToken(result.token);
        setTransactionDetails(result.transactionDetails);
        setShowSuccessModal(true);

        // Reset form
        setFormData({
          name: "",
          symbol: "",
          description: "",
          decimals: 9,
          totalSupply: 1000000000000,
          imageUrl: "",
          mintable: false,
        });
        setSelectedFile(null);
        setImagePreview(null);
      } else {
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
      <h2 className="text-3xl font-bold text-accent-lime mb-6 animate-glow">
        Create Your SPL Token
      </h2>

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
              Recommended: 9 (like SOL)
            </p>
          </div>

          <div>
            <label className="block text-foreground-muted font-semibold mb-2">
              Total Supply
            </label>
            <input
              type="number"
              value={formData.totalSupply}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  totalSupply: parseInt(e.target.value),
                })
              }
              min={1}
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
                <img
                  src={imagePreview}
                  alt="Token icon preview"
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

        {/* Mintable Option */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="mintable"
            checked={formData.mintable}
            onChange={(e) =>
              setFormData({ ...formData, mintable: e.target.checked })
            }
            className="w-5 h-5 text-accent-lime bg-dark-green-secondary border-accent-lime/30 rounded focus:ring-accent-lime accent-accent-lime"
          />
          <label htmlFor="mintable" className="text-foreground-muted">
            Keep token mintable (can create more tokens later)
          </label>
        </div>

        {/* Fee Information */}
        <div className="bg-dark-green-secondary border border-accent-lime/50 rounded-lg p-4 shadow-lg shadow-accent-lime/10">
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground-muted font-semibold">Creation Fee:</span>
            <span className="text-accent-lime-bright font-bold text-lg">{creationFee} SOL</span>
          </div>
          <div className="text-foreground-muted/70 text-sm">
            <span className="line-through opacity-70">Regular: 0.08 SOL</span>
            <span className="ml-2 text-accent-lime font-semibold bg-accent-lime/10 px-2 py-1 rounded">
              Special Offer!
            </span>
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
          {isCreating ? "Creating Token..." : `Create Token (${creationFee} SOL)`}
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
