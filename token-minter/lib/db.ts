import { sql } from '@vercel/postgres';
import { CreatedToken } from '@/types/token';

/**
 * Initialize database table if it doesn't exist
 * This function is called automatically on first database access
 */
export async function initDatabase() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS tokens (
        id TEXT PRIMARY KEY,
        mint_address TEXT NOT NULL,
        name TEXT NOT NULL,
        symbol TEXT NOT NULL,
        description TEXT,
        decimals INTEGER NOT NULL,
        total_supply NUMERIC NOT NULL,
        image_url TEXT,
        revoke_mint BOOLEAN NOT NULL,
        revoke_freeze BOOLEAN NOT NULL,
        creator TEXT NOT NULL,
        network TEXT NOT NULL,
        tx_signature TEXT NOT NULL,
        created_at BIGINT NOT NULL
      )
    `;

    // Create index on created_at for faster sorting
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tokens_created_at ON tokens(created_at DESC)
    `;

    // Create index on creator for faster filtering by creator
    await sql`
      CREATE INDEX IF NOT EXISTS idx_tokens_creator ON tokens(creator)
    `;

    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}

/**
 * Get all tokens from database
 */
export async function getAllTokens(): Promise<CreatedToken[]> {
  try {
    // Ensure table exists
    await initDatabase();

    const { rows } = await sql`
      SELECT * FROM tokens
      ORDER BY created_at DESC
    `;

    return rows.map(row => ({
      id: row.id,
      mintAddress: row.mint_address,
      metadata: {
        name: row.name,
        symbol: row.symbol,
        description: row.description,
        decimals: row.decimals,
        totalSupply: Number(row.total_supply),
        imageUrl: row.image_url,
        revokeMint: row.revoke_mint,
        revokeFreeze: row.revoke_freeze,
      },
      creator: row.creator,
      network: row.network as "devnet" | "mainnet-beta" | "gor",
      createdAt: Number(row.created_at),
      txSignature: row.tx_signature,
    }));
  } catch (error) {
    console.error('Failed to get tokens:', error);
    throw error;
  }
}

/**
 * Save a new token or update existing token
 */
export async function saveToken(token: CreatedToken): Promise<void> {
  try {
    // Ensure table exists
    await initDatabase();

    await sql`
      INSERT INTO tokens (
        id, mint_address, name, symbol, description, decimals,
        total_supply, image_url, revoke_mint, revoke_freeze,
        creator, network, tx_signature, created_at
      ) VALUES (
        ${token.id},
        ${token.mintAddress},
        ${token.metadata.name},
        ${token.metadata.symbol},
        ${token.metadata.description || null},
        ${token.metadata.decimals},
        ${token.metadata.totalSupply},
        ${token.metadata.imageUrl || null},
        ${token.metadata.revokeMint},
        ${token.metadata.revokeFreeze},
        ${token.creator},
        ${token.network},
        ${token.txSignature},
        ${token.createdAt}
      )
      ON CONFLICT (id) DO UPDATE SET
        mint_address = EXCLUDED.mint_address,
        name = EXCLUDED.name,
        symbol = EXCLUDED.symbol,
        description = EXCLUDED.description,
        decimals = EXCLUDED.decimals,
        total_supply = EXCLUDED.total_supply,
        image_url = EXCLUDED.image_url,
        revoke_mint = EXCLUDED.revoke_mint,
        revoke_freeze = EXCLUDED.revoke_freeze,
        creator = EXCLUDED.creator,
        network = EXCLUDED.network,
        tx_signature = EXCLUDED.tx_signature,
        created_at = EXCLUDED.created_at
    `;

    console.log('Token saved successfully:', token.id);
  } catch (error) {
    console.error('Failed to save token:', error);
    throw error;
  }
}

/**
 * Get tokens by creator address
 */
export async function getTokensByCreator(creator: string): Promise<CreatedToken[]> {
  try {
    // Ensure table exists
    await initDatabase();

    const { rows } = await sql`
      SELECT * FROM tokens
      WHERE creator = ${creator}
      ORDER BY created_at DESC
    `;

    return rows.map(row => ({
      id: row.id,
      mintAddress: row.mint_address,
      metadata: {
        name: row.name,
        symbol: row.symbol,
        description: row.description,
        decimals: row.decimals,
        totalSupply: Number(row.total_supply),
        imageUrl: row.image_url,
        revokeMint: row.revoke_mint,
        revokeFreeze: row.revoke_freeze,
      },
      creator: row.creator,
      network: row.network as "devnet" | "mainnet-beta" | "gor",
      createdAt: Number(row.created_at),
      txSignature: row.tx_signature,
    }));
  } catch (error) {
    console.error('Failed to get tokens by creator:', error);
    throw error;
  }
}

/**
 * Delete a token by ID
 */
export async function deleteToken(id: string): Promise<void> {
  try {
    // Ensure table exists
    await initDatabase();

    await sql`
      DELETE FROM tokens
      WHERE id = ${id}
    `;

    console.log('Token deleted successfully:', id);
  } catch (error) {
    console.error('Failed to delete token:', error);
    throw error;
  }
}
