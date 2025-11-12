# $GOR Token Information

## 토큰 생성 완료 ✅

Solana Devnet에 $GOR SPL 토큰이 성공적으로 생성되었습니다.

---

## 토큰 세부 정보

### 기본 정보
- **토큰 이름**: $GOR
- **네트워크**: Solana Devnet
- **토큰 프로그램**: Token Program (TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA)

### 토큰 주소
- **Mint Address**: `8A2FHoJE4dZiz8hgvkKDYBwXMhZdFAMUohRvNoYYB8ru`
- **토큰 계정 주소**: `5sPizGZMHiQdnAzuNBs3s3HYL5G5mZeViSnQ7MTcmM2q`

### 토큰 공급
- **Decimals**: 9
- **총 공급량**: 1,000,000,000 $GOR
- **현재 잔액**: 1,000,000,000 $GOR

### 지갑 정보
- **지갑 주소**: `CRXVZZ4vG1MT2RpFBcKgqLe13tm893vCEDbMRrLxqiKN`
- **키페어 경로**: `/home/codespace/.config/solana/id.json`

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
