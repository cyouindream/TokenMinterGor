"use client";

import { useState } from "react";
import { useWallet, useConnection } from "@solana/wallet-adapter-react";
import { TokenMetadata } from "@/types/token";
import { createToken } from "@/lib/tokenService";

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
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

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

      if (result.success && result.token) {
        setSuccess(
          `Token created successfully! Mint Address: ${result.token.mintAddress}`
        );
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

  return (
    <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700 rounded-xl p-8">
      <h2 className="text-2xl font-bold text-purple-100 mb-6">
        Create Your SPL Token
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Token Name */}
        <div>
          <label className="block text-purple-200 font-semibold mb-2">
            Token Name <span className="text-red-400">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., My Amazing Token"
            className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-500"
            required
          />
        </div>

        {/* Token Symbol */}
        <div>
          <label className="block text-purple-200 font-semibold mb-2">
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
            className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-500"
            required
          />
          <p className="text-purple-400 text-sm mt-1">
            Maximum 10 characters
          </p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-purple-200 font-semibold mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Describe your token..."
            rows={3}
            className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Decimals and Total Supply */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-200 font-semibold mb-2">
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
              className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
            />
            <p className="text-purple-400 text-sm mt-1">
              Recommended: 9 (like SOL)
            </p>
          </div>

          <div>
            <label className="block text-purple-200 font-semibold mb-2">
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
              className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-purple-200 font-semibold mb-2">
            Image URL (Optional)
          </label>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(e) =>
              setFormData({ ...formData, imageUrl: e.target.value })
            }
            placeholder="https://example.com/token-logo.png"
            className="w-full px-4 py-3 bg-purple-900/50 border border-purple-600 rounded-lg text-purple-100 placeholder-purple-400 focus:outline-none focus:border-purple-500"
          />
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
            className="w-5 h-5 text-purple-600 bg-purple-900/50 border-purple-600 rounded focus:ring-purple-500"
          />
          <label htmlFor="mintable" className="text-purple-200">
            Keep token mintable (can create more tokens later)
          </label>
        </div>

        {/* Fee Information */}
        <div className="bg-purple-900/50 border border-purple-600 rounded-lg p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-purple-200">Creation Fee:</span>
            <span className="text-purple-100 font-bold">0.03 SOL</span>
          </div>
          <div className="text-purple-400 text-sm">
            <span className="line-through">Regular: 0.08 SOL</span>
            <span className="ml-2 text-green-400 font-semibold">
              Launch Discount!
            </span>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-500/20 border border-red-500 rounded-lg p-4 text-red-200">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-500/20 border border-green-500 rounded-lg p-4 text-green-200">
            {success}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-4 px-6 rounded-lg transition-all shadow-lg disabled:cursor-not-allowed"
        >
          {isCreating ? "Creating Token..." : "Create Token (0.03 SOL)"}
        </button>
      </form>
    </div>
  );
}
