# Token Minter

A Next.js web application for creating Solana SPL Token-2022 tokens with ease.

## Features

- 🔐 **Multi-Wallet Support** - Phantom, Solflare, Torus, Ledger
- 🪙 **Token-2022 Standard** - Latest Solana token standard
- 💰 **Built-in Metadata** - On-chain metadata without Metaplex
- 🎨 **Custom Tokens** - Full control over name, symbol, supply, decimals
- 🔒 **Mintable Options** - Choose to keep or disable mint authority
- 🌐 **Future Ready** - UI prepared for $GOR chain integration
- 📊 **Token Gallery** - Browse all created tokens with Solscan links

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Web3.js, SPL Token
- **Wallet**: Solana Wallet Adapter
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A Solana wallet (Phantom, Solflare, etc.)
- Some devnet SOL for testing

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Usage

1. **Connect Wallet** - Click "Select Wallet" to connect your Solana wallet
2. **Fill Token Details**:
   - Token Name (e.g., "My Amazing Token")
   - Symbol (max 10 characters, e.g., "MAT")
   - Description (optional)
   - Decimals (recommended: 9)
   - Total Supply
   - Image URL (optional)
   - Mintable option (keep authority or disable)
3. **Create Token** - Pay 0.03 SOL fee and sign the transaction
4. **View Gallery** - See all created tokens with links to Solscan

## Pricing

- **Launch Discount**: 0.03 SOL
- **Regular Price**: 0.08 SOL (coming soon)
- **Settings Update**: 0.01 SOL (future feature)

## File Structure

```
token-minter/
├── app/
│   ├── api/
│   │   └── tokens/
│   │       └── route.ts        # Token API endpoints
│   ├── globals.css             # Global styles
│   ├── layout.tsx              # Root layout
│   └── page.tsx                # Home page
├── components/
│   ├── TokenCreationForm.tsx   # Token creation form
│   ├── TokenGallery.tsx        # Token gallery display
│   └── WalletContextProvider.tsx # Wallet adapter context
├── lib/
│   └── tokenService.ts         # Token creation logic
├── types/
│   └── token.ts                # TypeScript types
├── data/
│   └── tokens.json             # Token storage (file-based)
└── public/                     # Static assets
```

## Environment Variables

No environment variables required for basic operation. The app uses Solana Devnet by default.

To use mainnet, update the network in `components/WalletContextProvider.tsx`:

```typescript
const network = WalletAdapterNetwork.Mainnet;
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import repository in Vercel
3. Deploy (automatic build configuration)

### Manual Deployment

```bash
npm run build
npm start
```

## Future Features

- [ ] $GOR Chain support
- [ ] Token settings update (0.01 SOL)
- [ ] Database integration (replacing file storage)
- [ ] Advanced token extensions
- [ ] Bulk token creation
- [ ] Token analytics

## Security

- ⚠️ **Never share your private keys**
- 🔐 All transactions require wallet signature
- 💾 Token data is stored locally (file-based, migrating to DB)
- 🔒 Service fee wallet is fixed in code

## Developer

- **Email**: cyouindream@gmail.com
- **Twitter**: [@cyouindream](https://x.com/cyouindream)

## License

MIT License - see LICENSE file for details

## Support

For issues or questions, please open an issue on GitHub.

---

**Built with ❤️ on Solana**
