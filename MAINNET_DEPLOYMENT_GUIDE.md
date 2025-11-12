# $GOR 토큰 Mainnet 배포 가이드

## ⚠️ 중요 주의사항

**Mainnet은 실제 돈이 드는 프로덕션 환경입니다!**
- 모든 트랜잭션은 실제 SOL이 필요합니다
- 실수는 되돌릴 수 없습니다
- 반드시 Devnet에서 충분히 테스트 후 진행하세요
- 지갑의 시드 구문(Seed Phrase)을 안전하게 보관하세요

---

## 1단계: Mainnet으로 네트워크 전환

### 옵션 A: 기존 지갑 사용 (권장하지 않음)
```bash
export PATH="/home/codespace/.local/share/solana/install/active_release/bin:$PATH"

# Mainnet으로 전환
solana config set --url https://api.mainnet-beta.solana.com

# 설정 확인
solana config get
```

### 옵션 B: 새로운 프로덕션 지갑 생성 (권장)
```bash
# 새로운 키페어 생성 (더 안전한 위치에)
solana-keygen new --outfile ~/.config/solana/mainnet-wallet.json --no-bip39-passphrase

# 새 지갑을 기본 지갑으로 설정
solana config set --keypair ~/.config/solana/mainnet-wallet.json

# Mainnet으로 전환
solana config set --url https://api.mainnet-beta.solana.com

# 지갑 주소 확인
solana address
```

### 옵션 C: 하드웨어 지갑 사용 (가장 안전)
```bash
# Ledger 하드웨어 지갑 사용
solana-keygen pubkey usb://ledger

# Ledger를 기본 지갑으로 설정
solana config set --keypair usb://ledger
```

---

## 2단계: 실제 SOL 준비

### 필요한 SOL 예상 비용
- 토큰 생성 (Mint): ~0.001 SOL
- 토큰 계정 생성: ~0.002 SOL
- 토큰 발행 (Minting): ~0.00001 SOL per transaction
- 메타데이터 추가 (Metaplex): ~0.015 SOL
- **추천 준비량**: 최소 0.1 SOL (여유분 포함)

### SOL 구매 및 전송
1. **거래소에서 SOL 구매**
   - Binance, Coinbase, Upbit 등에서 구매
   - 최소 0.1 SOL 이상 권장

2. **지갑으로 전송**
   ```bash
   # 지갑 주소 확인
   solana address
   
   # 출력된 주소로 거래소에서 SOL 전송
   ```

3. **잔액 확인**
   ```bash
   solana balance
   ```

---

## 3단계: 프로덕션 토큰 생성

### 토큰 생성
```bash
# SPL 토큰 생성
spl-token create-token

# 출력 예시:
# Creating token AbCd...XyZ
# Address: AbCd...XyZ
# Decimals: 9
#
# ⚠️ 이 주소를 안전하게 보관하세요!
```

### 토큰 계정 생성
```bash
# <TOKEN_ADDRESS>를 위에서 생성된 주소로 교체
spl-token create-account <TOKEN_ADDRESS>
```

### 토큰 발행
```bash
# 예: 1,000,000,000개 발행
spl-token mint <TOKEN_ADDRESS> 1000000000
```

---

## 4단계: 토큰 메타데이터 추가 (중요!)

토큰이 지갑과 거래소에서 제대로 표시되려면 메타데이터가 필요합니다.

### Metaplex Sugar 설치
```bash
# Sugar CLI 도구 설치 (최신 버전)
bash <(curl -sSf https://sugar.metaplex.com/install.sh)

# 또는 직접 다운로드
# https://github.com/metaplex-foundation/mpl-token-metadata
```

### 메타데이터 준비

1. **로고 이미지 준비**
   - PNG 형식 권장
   - 크기: 500x500px 이상
   - 파일 크기: 1MB 이하

2. **이미지를 IPFS나 Arweave에 업로드**
   ```bash
   # NFT.Storage (무료) 사용 예시
   # https://nft.storage/
   ```

3. **메타데이터 JSON 생성**
   ```json
   {
     "name": "GOR",
     "symbol": "GOR",
     "description": "GOR Token - [토큰 설명 추가]",
     "image": "https://[your-image-url].png",
     "external_url": "https://[your-website].com",
     "properties": {
       "category": "fungible-token"
     }
   }
   ```

### Metaplex를 사용한 메타데이터 추가
```bash
# @metaplex-foundation/mpl-token-metadata 사용
# 참고: https://docs.metaplex.com/programs/token-metadata/

# Node.js와 @metaplex-foundation/js 필요
npm install -g @metaplex-foundation/js @solana/web3.js

# 또는 TypeScript 스크립트로 메타데이터 추가
# 예제 스크립트는 아래 참조
```

### 메타데이터 추가 스크립트 (TypeScript)
```typescript
import { createCreateMetadataAccountV3Instruction } from '@metaplex-foundation/mpl-token-metadata';
import { Connection, Keypair, PublicKey } from '@solana/web3.js';

// 스크립트 예제는 Metaplex 공식 문서 참조
// https://docs.metaplex.com/programs/token-metadata/instructions/create
```

---

## 5단계: 토큰 배포 및 관리

### 토큰 공급량 확인
```bash
spl-token supply <TOKEN_ADDRESS>
```

### 토큰 전송
```bash
# 다른 지갑으로 전송
spl-token transfer <TOKEN_ADDRESS> <AMOUNT> <RECIPIENT_ADDRESS>

# 예시: 100개의 토큰을 특정 주소로 전송
spl-token transfer <TOKEN_ADDRESS> 100 AbCd...XyZ
```

### 민트 권한 관리

#### 추가 발행 허용 (기본값)
```bash
# 현재 상태 - 추가 발행 가능
# 필요시 언제든 토큰을 더 발행할 수 있습니다
```

#### 민트 권한 비활성화 (고정 공급량)
```bash
# ⚠️ 주의: 이 작업은 되돌릴 수 없습니다!
# 실행 후에는 절대 토큰을 추가로 발행할 수 없습니다
spl-token authorize <TOKEN_ADDRESS> mint --disable

# 확인
spl-token display <TOKEN_ADDRESS>
```

#### 민트 권한 이전
```bash
# 다른 주소로 민트 권한 이전
spl-token authorize <TOKEN_ADDRESS> mint <NEW_AUTHORITY_ADDRESS>
```

---

## 6단계: 토큰 정보 공개

### Solana Explorer 등록
토큰이 생성되면 자동으로 Solana Explorer에 표시됩니다:
- https://explorer.solana.com/address/<TOKEN_ADDRESS>

### 주요 지갑에 토큰 정보 제출
1. **Phantom Wallet**
   - https://phantom.app/

2. **Solflare Wallet**
   - https://solflare.com/

3. **Jupiter Aggregator**
   - https://jup.ag/

### CoinGecko / CoinMarketCap 등록
토큰이 유동성을 확보한 후:
- CoinGecko: https://www.coingecko.com/en/coins/new
- CoinMarketCap: https://coinmarketcap.com/request/

---

## 7단계: 유동성 풀 생성 (선택사항)

토큰을 거래 가능하게 하려면 DEX에 유동성을 추가해야 합니다.

### Raydium
```bash
# Raydium에서 풀 생성
# https://raydium.io/
# UI를 통해 진행하는 것이 가장 쉽습니다
```

### Orca
```bash
# Orca에서 풀 생성
# https://www.orca.so/
```

필요한 것:
- SOL-GOR 페어 생성
- 초기 유동성 제공 (예: 1000 SOL + 해당하는 GOR)

---

## 보안 체크리스트

### 배포 전
- [ ] Devnet에서 충분히 테스트했습니까?
- [ ] 시드 구문을 안전하게 백업했습니까?
- [ ] 하드웨어 지갑 또는 안전한 키 관리 시스템을 사용하고 있습니까?
- [ ] 토큰 공급량과 decimal이 정확합니까?
- [ ] 메타데이터(이름, 심볼, 로고)가 준비되었습니까?

### 배포 후
- [ ] 토큰 주소를 여러 곳에 백업했습니까?
- [ ] Explorer에서 토큰이 정상적으로 표시됩니까?
- [ ] 민트 권한 상태가 의도한 대로 설정되었습니까?
- [ ] 테스트 전송이 정상적으로 작동합니까?

---

## 비용 요약

| 항목 | 예상 비용 (SOL) |
|------|----------------|
| 토큰 생성 | ~0.001 |
| 토큰 계정 생성 | ~0.002 |
| 메타데이터 추가 | ~0.015 |
| 초기 발행 | ~0.00001 |
| **합계** | **~0.02 SOL** |
| **권장 준비액** | **0.1 SOL** |

추가 비용:
- 유동성 풀 생성: ~0.5 SOL
- 마케팅 지갑용 SOL: 변동

---

## 명령어 요약

```bash
# 1. 네트워크 설정
solana config set --url https://api.mainnet-beta.solana.com

# 2. 잔액 확인
solana balance

# 3. 토큰 생성
spl-token create-token

# 4. 토큰 계정 생성
spl-token create-account <TOKEN_ADDRESS>

# 5. 토큰 발행
spl-token mint <TOKEN_ADDRESS> <AMOUNT>

# 6. 토큰 정보 확인
spl-token supply <TOKEN_ADDRESS>
spl-token accounts

# 7. (선택) 민트 권한 비활성화
spl-token authorize <TOKEN_ADDRESS> mint --disable
```

---

## 추가 리소스

### 공식 문서
- Solana 문서: https://docs.solana.com/
- SPL Token 문서: https://spl.solana.com/token
- Metaplex 문서: https://docs.metaplex.com/

### 도구
- Solana Explorer: https://explorer.solana.com/
- Solscan: https://solscan.io/
- Solana Beach: https://solanabeach.io/

### 커뮤니티
- Solana Discord: https://discord.gg/solana
- Solana Stack Exchange: https://solana.stackexchange.com/

---

## 문제 해결

### "Insufficient funds" 오류
```bash
# SOL 잔액 확인
solana balance

# 필요시 더 많은 SOL을 지갑으로 전송
```

### 트랜잭션 실패
```bash
# 최근 트랜잭션 확인
solana confirm -v <SIGNATURE>

# RPC 상태 확인
solana cluster-version
```

### 메타데이터 표시 안됨
- Metaplex Token Metadata가 올바르게 추가되었는지 확인
- 이미지 URL이 접근 가능한지 확인
- 지갑 앱을 업데이트하고 다시 시도

---

**⚠️ 최종 알림**: Mainnet 배포는 실제 자금을 사용합니다. 확신이 서지 않으면 전문가의 도움을 받거나 Devnet에서 더 많이 연습하세요!
