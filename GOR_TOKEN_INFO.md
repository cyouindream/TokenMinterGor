# $GOR Token Information (Updated - Token-2022)

## 토큰 생성 완료 ✅

Solana Devnet에 Token-2022로 $GOR SPL 토큰이 성공적으로 생성되었습니다.

---

## 토큰 세부 정보

### 기본 정보
- **토큰 이름**: GOR
- **토큰 심볼**: GOR
- **네트워크**: Solana Devnet
- **토큰 프로그램**: Token-2022 (TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb)

### 토큰 주소
- **Mint Address**: `2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6`
- **토큰 계정 주소**: `3LcJDsibZLmd5P1VSkfZn3wuS2uXUR11DJMhJigAGDqV`

### 토큰 공급
- **Decimals**: 9
- **총 공급량**: 1,000,000,000 GOR (고정)
- **Mint Authority**: 비활성화됨 (추가 발행 불가능)
- **Freeze Authority**: 설정 안 됨

### 메타데이터
- **Name**: GOR
- **Symbol**: GOR
- **URI**: https://raw.githubusercontent.com/lukeyang0/gor/main/metadata.json
- **Logo**: https://raw.githubusercontent.com/lukeyang0/gor/main/logo.svg
- **Update Authority**: CRXVZZ4vG1MT2RpFBcKgqLe13tm893vCEDbMRrLxqiKN

### 지갑 정보
- **지갑 주소**: `CRXVZZ4vG1MT2RpFBcKgqLe13tm893vCEDbMRrLxqiKN`
- **키페어 경로**: `/home/codespace/.config/solana/id.json` ⚠️ **백업 필수!**

---

## 🔒 보안 주의사항

### ⚠️ 절대 GitHub에 올리면 안 되는 것
- ❌ `/home/codespace/.config/solana/id.json` (Private Key)
- ❌ Seed Phrase (12단어 복구 구문)
- ❌ 모든 `.keypair` 파일

### ✅ GitHub에 올려도 되는 것
- ✅ 토큰 Mint 주소 (공개 주소)
- ✅ 지갑 공개 주소
- ✅ 메타데이터 JSON
- ✅ 로고 이미지
- ✅ 문서 파일들

---

## 트랜잭션 서명

### 토큰 생성 (Token-2022)
```
Signature: At1qeTF5fqYDxDAqQF2Js734jVzPVGmKskcKdM8XhuSd3ygK9YjBsMGh3eegkTWrsokWhwJUopW2SQnNc1rEomy
```

### 메타데이터 초기화
```
Signature: 5pdqKWpXGXtxBj58sVTX6z3LrFNA2TU3ZzqoMCR9RuUuDscP68Qs7MESV262W1oEvVKuwQCudzszm2CsWNC6reFA
```

### 토큰 계정 생성
```
Signature: 24nFazo97wjHW1FfiVf8AMZQzYEipFkdycGuiWMvZhe77NwDarkvKDView9Yxae7KuyKoH8AJyQGBtb7gyfeVpsj
```

### 토큰 발행 (1,000,000,000 GOR)
```
Signature: 4fYgvLvYV8ghiqYiUJeyUf2GrR5gU3ocGW5xUTHtxsEbWnhgRZg9NXT4GeiRoSHKP6kjH1YDeGZ53FafmCYr6WJh
```

### 민트 권한 비활성화
```
Signature: 2Lr2zWwtp9ErMHhTnPmvx1njyr8Ut7qFPJW6mY7SyDsWS8h3VynffMF3KmyCd2kJ9brfnzn1KVaib8xanX9y4wsW
```

---

## Solana Explorer 링크

### Devnet Explorer
- **토큰 주소**: https://explorer.solana.com/address/2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6?cluster=devnet
- **지갑 주소**: https://explorer.solana.com/address/CRXVZZ4vG1MT2RpFBcKgqLe13tm893vCEDbMRrLxqiKN?cluster=devnet

### 메타데이터 및 로고
- **메타데이터 JSON**: https://raw.githubusercontent.com/lukeyang0/gor/main/metadata.json
- **로고 SVG**: https://raw.githubusercontent.com/lukeyang0/gor/main/logo.svg

---

## 사용 가능한 CLI 명령어

### 토큰 정보 확인
```bash
export PATH="/home/codespace/.local/share/solana/install/active_release/bin:$PATH"

# 토큰 상세 정보 확인
spl-token display 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6

# 토큰 공급량 확인
spl-token supply 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6

# 토큰 계정 확인
spl-token accounts

# 토큰 잔액 확인
spl-token balance 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6

# 지갑 SOL 잔액 확인
solana balance
```

### 토큰 전송
```bash
# 다른 주소로 토큰 전송
spl-token transfer 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 <수량> <받는주소>

# 예시: 100 GOR 전송
spl-token transfer 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 100 <받는주소>
```

### 메타데이터 업데이트 (Update Authority 필요)
```bash
# 메타데이터 URI 업데이트
spl-token update-metadata 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 uri <새로운_URI>

# 이름 업데이트
spl-token update-metadata 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 name <새로운_이름>

# 심볼 업데이트
spl-token update-metadata 2wynko7U6vwEftDVrTXXT99bQqo2smKDMypCTPoAGPr6 symbol <새로운_심볼>
```

---

## 환경 설정

### Solana CLI 설정
```bash
# RPC URL
RPC URL: https://api.devnet.solana.com

# 설정 파일 위치
Config File: /home/codespace/.config/solana/cli/config.yml

# 키페어 위치
Keypair Path: /home/codespace/.config/solana/id.json
```

---

## Private Key 백업 방법

### ⚠️ 중요: 반드시 백업하세요!

**1. Seed Phrase (12단어) 백업**
- 지갑 생성 시 표시된 12단어를 안전한 곳에 기록
- 종이에 적어서 안전한 장소에 보관
- 절대 디지털 형태로 저장하지 마세요 (해킹 위험)

**2. 키페어 파일 백업**
```bash
# 키페어 파일 복사 (안전한 USB나 암호화된 저장소에)
cp /home/codespace/.config/solana/id.json ~/backup/solana-wallet-backup.json
```

**3. 지갑 복구 방법**
```bash
# Seed Phrase로 복구
solana-keygen recover

# 키페어 파일로 복구
solana config set --keypair /path/to/backup/id.json
```

---

## Token-2022 vs 기존 Token Program 비교

### Token-2022의 장점
✅ 메타데이터를 토큰 계정에 직접 포함 (별도 Metaplex 불필요)
✅ 간단한 CLI 명령어로 메타데이터 관리 가능
✅ `spl-token initialize-metadata` 명령어 사용 가능
✅ 확장 기능 지원 (Transfer fees, Interest-bearing 등)

### 기존 Token Program
- Metaplex Token Metadata 프로그램 별도 사용 필요
- JavaScript/TypeScript 코드로 메타데이터 추가
- 더 복잡한 설정 과정

---

## 다음 단계

### 현재 Devnet 상태
- ✅ 토큰 생성 완료
- ✅ 메타데이터 추가 완료
- ✅ 로고 설정 완료
- ✅ 민트 권한 비활성화 완료

### Mainnet 배포를 원하시면
1. `MAINNET_DEPLOYMENT_GUIDE.md` 참조
2. 실제 SOL 준비 (~0.1 SOL)
3. 하드웨어 지갑 사용 권장
4. 동일한 과정 반복 (단, RPC URL만 mainnet으로)

---

**생성 날짜**: 2025년 11월 12일  
**네트워크**: Solana Devnet  
**토큰 프로그램**: Token-2022  
**상태**: ✅ 활성화됨 (고정 공급량)

---

## 트랜잭션 서명

### 토큰 생성
```
Signature: 3rFGBMa9ZqfAVp8LS4hi5FG9raAv8rWAvbJrNK8isDFjxirCMnFUYqe4ofJT9XGwWukxAiJLGA31v2JfQRUHRm47
```

### 토큰 계정 생성
```
Signature: 385qigQLLSSd8toYHZHoJ87HAmVnVGua3GJEXnQ4BTfMzzz4DSmZw16j4QtcxU6wocmjEAPmAeVRzyNsaDEzzEcv
```

### 토큰 발행 (Mint)
```
Signature: 53dNqjNZsbhbz7GuPJ8xJ35s1oAesXVbkpPAdRRTop52W7wepuGWNwQYvZDUcuUTYferQ3edsb1kqnBhysKbm5D1
```

---

## Solana Explorer 링크

### Devnet Explorer
- **토큰 주소**: https://explorer.solana.com/address/8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru?cluster=devnet
- **지갑 주소**: https://explorer.solana.com/address/CRXVZZ4vG1MT2RpFBcKgqLe13tm893vCEDbMRrLxqiKN?cluster=devnet

---

## 사용 가능한 CLI 명령어

### 토큰 정보 확인
```bash
export PATH="/home/codespace/.local/share/solana/install/active_release/bin:$PATH"

# 토큰 공급량 확인
spl-token supply 8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru

# 토큰 계정 확인
spl-token accounts

# 토큰 잔액 확인
spl-token balance 8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru

# 지갑 SOL 잔액 확인
solana balance
```

### 추가 토큰 발행
```bash
# 추가로 토큰 발행 (예: 1000개)
spl-token mint 8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru 1000
```

### 토큰 전송
```bash
# 다른 주소로 토큰 전송
spl-token transfer 8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru <수량> <받는주소>
```

### 민트 권한 비활성화 (선택사항)
```bash
# 더 이상 토큰을 발행하지 못하도록 민트 권한 제거
spl-token authorize 8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru mint --disable
```

---

## 환경 설정

### Solana CLI 설정
```bash
# RPC URL
RPC URL: https://api.devnet.solana.com

# 설정 파일 위치
Config File: /home/codespace/.config/solana/cli/config.yml
```

### 시드 구문 (Seed Phrase) ⚠️
**보안 경고**: 아래 시드 구문은 안전하게 보관하세요. 이를 통해 지갑을 복구할 수 있습니다.

```
seven miracle shop island industry spike puppy frequent address garbage nation dynamic
```

---

## 다음 단계

1. **메타데이터 추가** (선택사항)
   - Metaplex Token Metadata를 사용하여 토큰에 이름, 심볼, 로고 등을 추가할 수 있습니다.

2. **Mainnet 배포** (프로덕션용)
   - Devnet에서 테스트가 완료되면 Mainnet으로 배포할 수 있습니다.
   ```bash
   solana config set --url https://api.mainnet-beta.solana.com
   ```

3. **토큰 관리**
   - 민트 권한 관리
   - 프리즈 권한 관리
   - 토큰 배포 전략 수립

---

**생성 날짜**: 2025년 11월 12일  
**네트워크**: Solana Devnet  
**상태**: ✅ 활성화됨
