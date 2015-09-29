# Pair Watch Security
---

## 準備

```
# リポジトリをクローン
git clone http://10.68.226.223:8000/git/yasudar/pair-watch-security-server.git 

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

## 実行

```
npm start
```

## テスト

```
npm test
```

## 開発用データ/試験用データ投入

```
npm run seed
npm run seed-test
```

## ドキュメント生成
documentsディレクトリ直下にクラスドキュメントを生成 (YUIDoc形式)

```
npm run document
```

## Client Simulator (debug & test用)

```
node scripts/client-emulator/client.js <UUID>
```
