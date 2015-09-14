# Pair Watch Security
---

## Setup

```
# リポジトリをクローン
git clone git@github.com:ysm001/pair-watch-auth-server.git

# プロジェクトディレクトリへ移動
cd pair-watch-auth-server

# node moduleのインストール
npm install

# db用のディレクトリを作成
mkdir -p ./data/db

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
