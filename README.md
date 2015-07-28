# Pair Watch Security
---

## Setup

```
# node moduleのインストール
npm install

# mongoDBの起動
mongod --dbpath ./data/db

# DBに初期データを投入
npm run seed
```

## Run

```
npm start
```

## Test

```
npm test
```

### Client Simulator (for debug)

```
node scripts/client-emulator/client.js <UUID>
```
