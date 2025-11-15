"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TokenMetadata, CreatedToken, TransactionDetails } from "@/types/token";
import { createToken } from "@/lib/tokenService";
import TokenSuccessModal from "./TokenSuccessModal";

export default function TokenCreationForm() {
  const { publicKey, signTransaction } = useWallet();
  const { connection } = useConnection();

  const [formData, setFormData] = useState<TokenMetadata>({
    name: "",
    symbol: "",
    description: "",
    decimals: 9,
    totalSupply: 1000000,
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
          totalSupply: 1000000,
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
    <div className="bg-gradient-to-br from-emerald-900/40 to-red-900/40 backdrop-blur-sm border border-amber-500/30 rounded-xl p-8 shadow-2xl">
      <h2 className="text-3xl font-bold bg-gradient-to-r from-red-400 via-amber-300 to-emerald-400 bg-clip-text text-transparent mb-6">
        Create Your SPL Token
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name */}
        <div>
          <label className="block text-emerald-100 font-semibold mb-2">
            Token Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., My Amazing Token"
            className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
            required
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-emerald-100 font-semibold mb-2">
            Token Symbol <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.symbol}
            onChange={(e) =>
              setFormData({ ...formData, symbol: e.target.value.toUpperCase() })
            }
            placeholder="e.g., MAT"
            maxLength={10}
            className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
            required
          />
          <p className="text-emerald-400 text-sm mt-1">
            Maximum 10 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-emerald-100 font-semibold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your token..."
            rows={3}
            className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 placeholder-emerald-500 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
          />
        </div>

        {/* Decimals and Total Supply */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-emerald-100 font-semibold mb-2">
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
              className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
            <p className="text-emerald-400 text-sm mt-1">
              Recommended: 9 (like SOL)
            </p>
          </div>

          <div>
            <label className="block text-emerald-100 font-semibold mb-2">
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
              className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all"
            />
          </div>
        </div>

        {/* Token Icon Upload */}
        <div>
          <label className="block text-emerald-100 font-semibold mb-2">
            Token Icon (Optional)
          </label>
          <div className="space-y-3">
            <input
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              onChange={handleFileChange}
              disabled={isUploading}
              className="w-full px-4 py-3 bg-emerald-950/50 border border-emerald-700 rounded-lg text-emerald-100 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-600 file:text-white hover:file:bg-red-700 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />
            {imagePreview && (
              <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-amber-500/50">
                <img
                  src={imagePreview}
                  alt="Token icon preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            {isUploading && (
              <p className="text-amber-400 text-sm">Uploading image...</p>
            )}
          </div>
          <p className="text-emerald-400 text-sm mt-1">
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
            className="w-5 h-5 text-red-600 bg-emerald-950/50 border-emerald-700 rounded focus:ring-amber-500 accent-red-600"
          />
          <label htmlFor="mintable" className="text-emerald-100">
            Keep token mintable (can create more tokens later)
          </label>
        </div>

        {/* Fee Information */}
        <div className="bg-gradient-to-r from-emerald-950/60 to-red-950/60 border border-amber-600/50 rounded-lg p-4 shadow-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-emerald-100 font-semibold">Creation Fee:</span>
            <span className="text-amber-300 font-bold text-lg">0.03 SOL</span>
          </div>
          <div className="text-emerald-300 text-sm">
            <span className="line-through opacity-70">Regular: 0.08 SOL</span>
            <span className="ml-2 text-amber-400 font-semibold bg-red-900/30 px-2 py-1 rounded">
              🎄 Holiday Discount!
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200 shadow-lg">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-red-600 via-red-700 to-emerald-700 hover:from-red-700 hover:via-red-800 hover:to-emerald-800 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-xl shadow-red-500/50 disabled:cursor-not-allowed transform hover:scale-[1.02] disabled:hover:scale-100"
        >
          {isCreating ? "🎁 Creating Token..." : "🎄 Create Token (0.03 SOL)"}
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
