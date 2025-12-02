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

const LOG_PREFIX = "[tokenService]";

// Service fee from environment variable
if (!process.env.NEXT_PUBLIC_CREATION_FEE) {
  throw new Error("NEXT_PUBLIC_CREATION_FEE is not configured");
}
const SERVICE_FEE_SOL = parseFloat(process.env.NEXT_PUBLIC_CREATION_FEE);
const SERVICE_FEE_LAMPORTS = SERVICE_FEE_SOL * LAMPORTS_PER_SOL;

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
  metadata: TokenMetadata,
  feeOption: "paid" | "donation" = "paid"
): Promise<TokenCreationResponse> {
  try {
    console.log(`${LOG_PREFIX} Starting token creation`, {
      payer: payer.toBase58(),
      feeOption,
      metadata,
    });

    // Get balance before transaction
    const balanceBefore = await connection.getBalance(payer);
    const balanceBeforeSOL = balanceBefore / LAMPORTS_PER_SOL;
    console.log(`${LOG_PREFIX} Balance before`, {
      balanceBefore,
      balanceBeforeSOL,
    });

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
    console.log(`${LOG_PREFIX} Calculated rent and sizes`, {
      mintLen,
      metadataLen,
      metadataExtension,
      lamports,
    });

    // Create transaction
    const transaction = new Transaction();
    console.log(`${LOG_PREFIX} Building transaction`, {
      instructions: transaction.instructions.length,
      mint: mint.publicKey.toBase58(),
    });

    // 1. Transfer service fee (only if paid option is selected)
    if (feeOption === "paid") {
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: payer,
          toPubkey: SERVICE_WALLET,
          lamports: SERVICE_FEE_LAMPORTS,
        })
      );
      console.log(`${LOG_PREFIX} Added service fee transfer`, {
        lamports: SERVICE_FEE_LAMPORTS,
        serviceWallet: SERVICE_WALLET.toBase58(),
      });
    }

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
    console.log(`${LOG_PREFIX} Added mint account creation`);

    // 3. Initialize metadata pointer
    transaction.add(
      createInitializeMetadataPointerInstruction(
        mint.publicKey,
        payer,
        mint.publicKey,
        TOKEN_2022_PROGRAM_ID
      )
    );
    console.log(`${LOG_PREFIX} Added metadata pointer initialization`);

    // 4. Initialize mint
    transaction.add(
      createInitializeMint2Instruction(
        mint.publicKey,
        decimals,
        payer, // Mint authority (always set initially to mint the supply)
        payer, // Freeze authority (will be revoked later if revokeFreeze is true)
        TOKEN_2022_PROGRAM_ID
      )
    );
    console.log(`${LOG_PREFIX} Added mint initialization`, { decimals });

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
    console.log(`${LOG_PREFIX} Added metadata initialization`, {
      name: metadata.name,
      symbol: metadata.symbol,
      hasImageUrl: Boolean(metadata.imageUrl),
    });

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
    console.log(`${LOG_PREFIX} Added associated token account`, {
      associatedToken: associatedToken.toBase58(),
    });

    // 7. Mint tokens to creator
    const totalSupplyRaw = metadata.totalSupply * Math.pow(10, decimals);
    const creatorAmount = feeOption === "donation"
      ? Math.floor(totalSupplyRaw * 0.95) // 95% to creator if donation option
      : totalSupplyRaw; // 100% to creator if paid option
    console.log(`${LOG_PREFIX} Calculated mint amounts`, {
      totalSupplyRaw,
      creatorAmount,
      feeOption,
    });

    transaction.add(
      createMintToInstruction(
        mint.publicKey,
        associatedToken,
        payer,
        creatorAmount,
        [],
        TOKEN_2022_PROGRAM_ID
      )
    );
    console.log(`${LOG_PREFIX} Added mint-to instruction for creator`);

    // 7.5. If donation option, mint 5% to service wallet
    if (feeOption === "donation") {
      const donationAmount = Math.floor(totalSupplyRaw * 0.05); // 5% donation

      // Create associated token account for service wallet
      const serviceAssociatedToken = getAssociatedTokenAddressSync(
        mint.publicKey,
        SERVICE_WALLET,
        false,
        TOKEN_2022_PROGRAM_ID
      );

      transaction.add(
        createAssociatedTokenAccountInstruction(
          payer,
          serviceAssociatedToken,
          SERVICE_WALLET,
          mint.publicKey,
          TOKEN_2022_PROGRAM_ID
        )
      );

      transaction.add(
        createMintToInstruction(
          mint.publicKey,
          serviceAssociatedToken,
          payer,
          donationAmount,
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log(`${LOG_PREFIX} Added donation mint`, {
        donationAmount,
        serviceTokenAccount: serviceAssociatedToken.toBase58(),
      });
    }

    // 8. Revoke mint authority if requested
    if (metadata.revokeMint) {
      transaction.add(
        createSetAuthorityInstruction(
          mint.publicKey,
          payer,
          AuthorityType.MintTokens,
          null, // Revoke mint authority - no one can mint more tokens
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log(`${LOG_PREFIX} Added revoke mint authority`);
    }

    // 9. Revoke freeze authority if requested
    if (metadata.revokeFreeze) {
      transaction.add(
        createSetAuthorityInstruction(
          mint.publicKey,
          payer,
          AuthorityType.FreezeAccount,
          null, // Revoke freeze authority - no one can freeze token accounts
          [],
          TOKEN_2022_PROGRAM_ID
        )
      );
      console.log(`${LOG_PREFIX} Added revoke freeze authority`);
    }

    // Set recent blockhash
    const { blockhash, lastValidBlockHeight } =
      await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payer;
    console.log(`${LOG_PREFIX} Set blockhash and fee payer`, {
      blockhash,
      lastValidBlockHeight,
      feePayer: payer.toBase58(),
      instructionCount: transaction.instructions.length,
    });

    // Sign with mint keypair
    transaction.partialSign(mint);
    console.log(`${LOG_PREFIX} Partially signed with mint keypair`);

    // Sign with user wallet
    const signedTransaction = await signTransaction(transaction);
    const rawTransaction = signedTransaction.serialize();
    console.log(`${LOG_PREFIX} User wallet signed transaction`, {
      serializedLength: rawTransaction.length,
    });

    // Send transaction
    const signature = await connection.sendRawTransaction(rawTransaction);
    console.log(`${LOG_PREFIX} Transaction submitted`, {
      signature,
      blockhash,
      lastValidBlockHeight,
    });

    // Confirm transaction
    const confirmation = await connection.confirmTransaction({
      signature,
      blockhash,
      lastValidBlockHeight,
    });
    console.log(`${LOG_PREFIX} Confirmation response`, {
      err: confirmation.value.err,
      confirmationStatus: confirmation.value.confirmationStatus,
      slot: confirmation.context.slot,
    });

    if (confirmation.value.err) {
      console.error(`${LOG_PREFIX} Transaction failed`, confirmation.value.err);
      const [status] = (await connection.getSignatureStatuses([signature])).value;
      console.error(`${LOG_PREFIX} Signature status`, status);
      return {
        success: false,
        error: `Transaction failed: ${JSON.stringify(confirmation.value.err)}`,
      };
    }

    // Get balance after transaction
    const balanceAfter = await connection.getBalance(payer);
    const balanceAfterSOL = balanceAfter / LAMPORTS_PER_SOL;
    console.log(`${LOG_PREFIX} Balance after`, {
      balanceAfter,
      balanceAfterSOL,
    });

    // Calculate transaction costs
    const totalCost = balanceBeforeSOL - balanceAfterSOL;
    const actualServiceFee = feeOption === "paid" ? SERVICE_FEE_SOL : 0;
    const networkFee = totalCost - actualServiceFee;

    // Calculate donation amount if donation option was selected
    const donationAmount = feeOption === "donation"
      ? Math.floor(totalSupplyRaw * 0.05) / Math.pow(10, decimals)
      : undefined;

    // Create transaction details
    const transactionDetails: TransactionDetails = {
      fromWallet: payer.toBase58(),
      toWallet: SERVICE_WALLET.toBase58(),
      serviceFee: actualServiceFee,
      networkFee: networkFee,
      totalCost: totalCost,
      balanceBefore: balanceBeforeSOL,
      balanceAfter: balanceAfterSOL,
      signature: signature,
      feeOption: feeOption,
      donationAmount: donationAmount,
      tokenSymbol: feeOption === "donation" ? metadata.symbol : undefined,
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
    console.log(`${LOG_PREFIX} Token created`, {
      mintAddress: createdToken.mintAddress,
      txSignature: createdToken.txSignature,
      network: createdToken.network,
    });

    // Save token to storage
    await saveToken(createdToken);
    console.log(`${LOG_PREFIX} Token persisted to DB`, {
      tokenId: createdToken.id,
    });

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
    console.log(`${LOG_PREFIX} Saving token via API`, {
      id: token.id,
      mintAddress: token.mintAddress,
      creator: token.creator,
    });

    const response = await fetch("/api/tokens", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(token),
    });

    let responseBody: unknown = null;
    try {
      responseBody = await response.json();
    } catch (parseError) {
      console.error(`${LOG_PREFIX} Failed to parse token save response`, parseError);
    }

    if (!response.ok || !responseBody || (responseBody as { success?: boolean }).success === false) {
      console.error(`${LOG_PREFIX} Token save failed`, {
        status: response.status,
        body: responseBody,
      });
      throw new Error(
        `Failed to save token (status ${response.status})`
      );
    }

    console.log(`${LOG_PREFIX} Token save response`, responseBody);
  } catch (error) {
    console.error(`${LOG_PREFIX} Error saving token`, error);
    throw error;
  }
}
