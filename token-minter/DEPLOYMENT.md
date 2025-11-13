# Token Minter - Deployment Guide

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Vercel account (for deployment)
- GitHub repository (optional but recommended)

## Local Development

### 1. Install Dependencies

```bash
cd token-minter
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### 3. Build for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

### Method 1: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
cd token-minter
vercel
```

4. Follow the prompts to configure your project.

### Method 2: Using GitHub Integration

1. Push your code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit: Token Minter application"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

2. Go to [Vercel Dashboard](https://vercel.com/dashboard)

3. Click "Add New Project"

4. Import your GitHub repository

5. Configure project settings:
   - **Framework Preset**: Next.js
   - **Root Directory**: `token-minter`
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

6. Click "Deploy"

## Environment Configuration

### Network Selection

By default, the app uses Solana Devnet. To switch to Mainnet:

1. Edit `components/WalletContextProvider.tsx`:
```typescript
// Change this line
const network = WalletAdapterNetwork.Devnet;

// To this
const network = WalletAdapterNetwork.Mainnet;
```

2. Rebuild and redeploy.

### Service Fee Wallet

To change the service fee recipient wallet:

1. Edit `lib/tokenService.ts`:
```typescript
const SERVICE_WALLET = new PublicKey(
  "YOUR_WALLET_ADDRESS_HERE"
);
```

2. Rebuild and redeploy.

### Fee Amount

To adjust the service fee:

1. Edit `lib/tokenService.ts`:
```typescript
// Change from 0.03 SOL to your desired amount
const SERVICE_FEE_LAMPORTS = 0.03 * LAMPORTS_PER_SOL;
```

2. Update the display in `components/TokenCreationForm.tsx`:
```tsx
<span className="text-purple-100 font-bold">0.03 SOL</span>
```

## Post-Deployment Checklist

- [ ] Verify wallet connection works with multiple wallet providers
- [ ] Test token creation on Devnet
- [ ] Confirm service fee is being collected correctly
- [ ] Check token gallery displays created tokens
- [ ] Test Solscan links open correctly
- [ ] Verify responsive design on mobile devices
- [ ] Enable custom domain (optional)
- [ ] Set up monitoring/analytics (optional)

## Troubleshooting

### Build Warnings

The following warnings can be safely ignored:
- `pino-pretty` module not found - This is an optional dependency
- Multiple lockfiles detected - Expected in monorepo structure

### Token Creation Fails

1. Check wallet has sufficient SOL (at least 0.1 SOL recommended)
2. Verify network connection (Devnet/Mainnet)
3. Check browser console for detailed error messages
4. Ensure wallet is connected and unlocked

### Gallery Not Loading

1. Check `data/tokens.json` file exists and is readable
2. Verify API endpoint `/api/tokens` is accessible
3. Check browser console for API errors

## Maintenance

### Updating Dependencies

```bash
npm update
npm audit fix
```

### Switching to Database

To migrate from file-based storage to a database:

1. Set up your database (PostgreSQL, MongoDB, etc.)
2. Update `app/api/tokens/route.ts` to use database instead of file system
3. Add database connection configuration
4. Test thoroughly before deploying

## Support

For issues or questions:
- Email: cyouindream@gmail.com
- Twitter: [@cyouindream](https://x.com/cyouindream)
- GitHub: Open an issue in the repository

## License

MIT License - See LICENSE file for details
