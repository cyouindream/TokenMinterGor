import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  TOKEN_2022_PROGRAM_ID,
  createInitializeMintInstruction,
  getMintLen,
  ExtensionType,
  createInitializeMetadataPointerInstruction,
  TYPE_SIZE,
  LENGTH_SIZE,
  createInitializeMint2Instruction,
  getAssociatedTokenAddressSync,
  createAssociatedTokenAccountInstruction,
  createMintToInstruction,
  createSetAuthorityInstruction,
  AuthorityType,
} from "@solana/spl-token";
import {
  createInitializeInstruction,
  createUpdateFieldInstruction,
} from "@solana/spl-token-metadata";
import { TokenMetadata, CreatedToken, TokenCreationResponse, TransactionDetails } from "@/types/token";

const SERVICE_FEE_LAMPORTS = 0.03 * LAMPORTS_PER_SOL; // 0.03 SOL
const SERVICE_FEE_SOL = 0.03; // 0.03 SOL

// Service wallet address from environment variable
if (!process.env.NEXT_PUBLIC_SERVICE_WALLET) {
  throw new Error("NEXT_PUBLIC_SERVICE_WALLET is not configured");
}
const SERVICE_WALLET = new PublicKey(
  process.env.NEXT_PUBLIC_SERVICE_WALLET
);

export async function createToken(
  connection: Connection,
  payer: PublicKey,
  signTransaction: (transaction: Transaction) => Promise<Transaction>,
  metadata: TokenMetadata
): Promise<TokenCreationResponse> {
  try {
    // Get balance before transaction
    const balanceBefore = await connection.getBalance(payer);
    const balanceBeforeSOL = balanceBefore / LAMPORTS_PER_SOL;

    // Generate new mint keypair
    const mint = Keypair.generate();
    const decimals = metadata.decimals;

    // Calculate rent
    const metadataExtension = TYPE_SIZE + LENGTH_SIZE;
    // Estimate metadata length
    const metadataLen =
      metadata.name.length +
      metadata.symbol.length +
      (metadata.imageUrl?.length || 0) +
      100; // Buffer for additional metadata fields

    const mintLen = getMintLen([ExtensionType.MetadataPointer]);
    const lamports = await connection.getMinimumBalanceForRentExemption(
      mintLen + metadataExtension + metadataLen
    );

    // Create transaction
    const transaction = new Transaction();

    // 1. Transfer service fee
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: payer,
        toPubkey: SERVICE_WALLET,
        lamports: SERVICE_FEE_LAMPORTS,
      })
    );

    // 2. Create mint account
    transaction.add(
      SystemProgram.createAccount({
        fromPubkey: payer,
        newAccountPubkey: mint.publicKey,
        space: mintLen,
        lamports,
        programId: TOKEN_2022_PROGRAM_ID,
      })
    );

    // 3. Initialize metadata pointer
    transaction.add(
      createInitializeMetadataPointerInstruction(
        mint.publicKey,
        payer,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 4. Initialize mint
    transaction.add(
      createInitializeMint2Instruction(
        mint.publicKey,
        decimals,
        payer,
        metadata.mintable ? payer : null,
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 5. Initialize metadata
    transaction.add(
      createInitializeInstruction({
        programId: TOKEN_2022_PROGRAM_ID,
        mint: mint.publicKey,
        metadata: mint.publicKey,
        name: metadata.name,
        symbol: metadata.symbol,
        uri: metadata.imageUrl || "",
        mintAuthority: payer,
        updateAuthority: payer,
      })
    );

    // 6. Create associated token account
    const associatedToken = getAssociatedTokenAddressSync(
      mint.publicKey,
      payer,
      false,
      TOKEN_2022_PROGRAM_ID
    );

    transaction.add(
      createAssociatedTokenAccountInstruction(
        payer,
        associatedToken,
        payer,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 7. Mint tokens to creator
    transaction.add(
      createMintToInstruction(
        mint.publicKey,
        associatedToken,
        payer,
        metadata.totalSupply * Math.pow(10, decimals),
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );

    // 8. Disable mint authority if not mintable
    if (!metadata.mintable) {
      transaction.add(
        createSetAuthorityInstruction(
          mint.publicKey,
          payer,
          AuthorityType.MintTokens,
          null,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
    }

    // Set recent blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;

    // Sign with mint keypair
    transaction.partialSign(mint);

    // Sign with user wallet
    const signedTransaction = await signTransaction(transaction);

    // Send transaction
    const signature = await connection.sendRawTransaction(
      signedTransaction.serialize()
    );

    // Confirm transaction
    await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    // Get balance after transaction
    const balanceAfter = await connection.getBalance(payer);
    const balanceAfterSOL = balanceAfter / LAMPORTS_PER_SOL;

    // Calculate transaction costs
    const totalCost = balanceBeforeSOL - balanceAfterSOL;
    const networkFee = totalCost - SERVICE_FEE_SOL;

    // Create transaction details
    const transactionDetails: TransactionDetails = {
      fromWallet: payer.toBase58(),
      toWallet: SERVICE_WALLET.toBase58(),
      serviceFee: SERVICE_FEE_SOL,
      networkFee: networkFee,
      totalCost: totalCost,
      balanceBefore: balanceBeforeSOL,
      balanceAfter: balanceAfterSOL,
      signature: signature,
    };

    // Create token record
    const createdToken: CreatedToken = {
      id: mint.publicKey.toBase58(),
      mintAddress: mint.publicKey.toBase58(),
      metadata,
      creator: payer.toBase58(),
      network: "devnet",
      createdAt: Date.now(),
      txSignature: signature,
    };

    // Save token to storage
    await saveToken(createdToken);

    return {
      success: true,
      token: createdToken,
      signature,
      transactionDetails,
    };
  } catch (error) {
    console.error("Token creation error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

async function saveToken(token: CreatedToken): Promise<void> {
  try {
    await fetch("/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });
  } catch (error) {
    console.error("Error saving token:", error);
    // Don't fail token creation if saving fails
  }
}
