# $GOR Token

![GOR Logo](./logo.svg)

Official repository for the $GOR token on Solana blockchain.

## Token Information

- **Name**: GOR
- **Symbol**: GOR
- **Network**: Solana Devnet
- **Token Standard**: Token-2022 (SPL Token with Extensions)
- **Mint Address**: `2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6`
- **Total Supply**: 1,000,000,000 GOR (Fixed)
- **Decimals**: 9

## Explorer Links

- **Token (Devnet)**: [View on Solana Explorer](https://explorer.solana.com/address/2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6?cluster=devnet)
- **Metadata**: [metadata.json](./metadata.json)
- **Logo**: [logo.svg](./logo.svg)

## Features

✅ **Token-2022 Standard** - Built with the latest Solana token program  
✅ **On-Chain Metadata** - Name, symbol, and URI stored directly on-chain  
✅ **Fixed Supply** - Mint authority disabled, no additional tokens can be created  
✅ **Decentralized Logo** - Logo hosted on GitHub and referenced in metadata  

## Documentation

- [GOR_TOKEN_INFO.md](./GOR_TOKEN_INFO.md) - Complete token information and CLI commands
- [MAINNET_DEPLOYMENT_GUIDE.md](./MAINNET_DEPLOYMENT_GUIDE.md) - Guide for deploying to Mainnet

## Token Creation Process

This token was created using the following steps:

1. **Token Creation** with Token-2022 program
   ```bash
   spl-token create-token --program-id TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb --enable-metadata
   ```

2. **Metadata Initialization**
   ```bash
   spl-token initialize-metadata <TOKEN_ADDRESS> GOR GOR <METADATA_URI>
   ```

3. **Token Account Creation**
   ```bash
   spl-token create-account <TOKEN_ADDRESS>
   ```

4. **Token Minting**
   ```bash
   spl-token mint <TOKEN_ADDRESS> 1000000000
   ```

5. **Mint Authority Disabled** (Fixed Supply)
   ```bash
   spl-token authorize <TOKEN_ADDRESS> mint --disable
   ```

## CLI Usage

### View Token Information
```bash
spl-token display 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6
```

### Check Token Supply
```bash
spl-token supply 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6
```

### Transfer Tokens
```bash
spl-token transfer 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 <AMOUNT> <RECIPIENT_ADDRESS>
```

## Security Notice

⚠️ **IMPORTANT**: This repository does NOT contain any private keys or seed phrases.

- Private keys are stored locally and should NEVER be committed to version control
- The `.gitignore` file is configured to exclude all sensitive files
- Always backup your wallet's seed phrase in a secure offline location

## Metadata

The token metadata is publicly accessible:

```json
{
  "name": "GOR",
  "symbol": "GOR",
  "description": "GOR Token - A Solana SPL Token",
  "image": "https://raw.githubusercontent.com/lukeyang0/gor/main/logo.svg",
  "external_url": "https://github.com/lukeyang0/gor",
  "properties": {
    "category": "fungible-token"
  }
}
```

## Development

This is a private repository containing token deployment configurations and documentation.

### Prerequisites

- Solana CLI tools installed
- Node.js and npm (for metadata management)

### Setup

```bash
# Install dependencies
npm install

# Configure Solana CLI
solana config set --url https://api.devnet.solana.com
```

## Network Information

- **Current Network**: Devnet
- **RPC URL**: https://api.devnet.solana.com
- **Token Program**: TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb

## License

This is a private repository. All rights reserved.

## Contact

For questions or support, please open an issue in this repository.

---

**Created**: November 12, 2025  
**Status**: Active (Devnet)  
**Token Standard**: SPL Token-2022
