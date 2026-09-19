# TACTICS 7 Ver.0.41 Web Playtest setup

## 採用構成

- ゲーム公開: GitHub Pages（静的ファイル）
- ログ保存: Supabase Postgres
- 書き込み窓口: Supabase Edge Function `ingest-playtest`
- 管理者読み取り窓口: Supabase Edge Function `export-playtest`

公開ブラウザはDBへ直接接続しません。公開してよいSupabase anon keyはEdge Function呼び出しにだけ使い、service role keyはSupabase側だけで使用します。DBの2テーブルはRLSを有効にし、`anon` / `authenticated` の直接操作権限を取り消しています。

Supabaseを選んだ理由は、JSONBで詳細ログをそのまま保持できること、SQLで後から集計しやすいこと、Edge FunctionでINSERT専用の公開窓口と管理者READを分離できることです。Firebaseも小規模収集には使えますが、今回のカード・デッキ別集計とCORE LAB向け一括取得はPostgresの方が扱いやすいため採用しませんでした。

## 1. Supabaseを準備

1. Supabaseで新しいFree projectを作成します。
2. SQL Editorで [`supabase/schema.sql`](supabase/schema.sql) を実行します。
3. Supabase CLIでこのディレクトリを対象projectへlinkします。
4. 許可する公開URLと管理画面URL、十分長い管理者tokenをsecretへ登録します。

```sh
supabase link --project-ref YOUR_PROJECT_REF
supabase secrets set PLAYTEST_ALLOWED_ORIGINS=https://YOUR_NAME.github.io
supabase secrets set CORE_LAB_ALLOWED_ORIGINS=https://YOUR_NAME.github.io
supabase secrets set PLAYTEST_ADMIN_TOKEN=YOUR_LONG_RANDOM_ADMIN_TOKEN
supabase functions deploy ingest-playtest
supabase functions deploy export-playtest --no-verify-jwt
```

GitHub Pagesがproject siteの場合もOriginは `https://YOUR_NAME.github.io` です。独自ドメインを使う場合はそのOriginを設定します。複数はカンマ区切りです。ローカルの `http://localhost` は開発時だけ許可されます。

`export-playtest` はSupabase gatewayのJWT検証を無効にしてdeployしますが、Function内部で `x-admin-token` を検証し、許可Originも確認します。管理tokenはGitHubやブラウザ保存領域へ置きません。

## 2. 公開設定を入れる

Supabase Dashboardの Project Settings → API からProject URLと公開anon keyを確認し、[`playtest_config.js`](playtest_config.js) を編集します。

```js
window.TACTICS7_PLAYTEST_CONFIG = {
  ingestEndpoint: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/ingest-playtest',
  supabaseAnonKey: 'YOUR_PUBLIC_ANON_KEY',
  adminExportEndpoint: 'https://YOUR_PROJECT_REF.supabase.co/functions/v1/export-playtest'
};
```

anon keyは公開クライアント用です。`service_role` keyと管理者tokenは絶対にここへ記入しません。

## 3. GitHub Pagesで公開

現在の公開先:

```text
https://gengosaku05-blip.github.io/tactics7-playtest/
```

友達へ送るPLAYTEST URL:

```text
https://gengosaku05-blip.github.io/tactics7-playtest/?playtest=1
```

このフォルダをリポジトリの公開対象にした上で、次のどちらかを使います。

1. GitHub repository → Settings → Pages を開きます。
2. Branch deploymentを使う場合は、このフォルダが含まれるbranchと公開folderを選びます。
3. GitHub Actionsを使う場合は [`deploy/github-pages.yml.example`](deploy/github-pages.yml.example) をリポジトリ直下の `.github/workflows/tactics7-pages.yml` へコピーし、`path` を実際の配置に合わせます。
4. Actions完了後、公開URLへ `?playtest=1` を付けて開きます。

友達へ送るURL例:

```text
https://YOUR_NAME.github.io/YOUR_REPOSITORY/new_game/?playtest=1
```

`new_game` 自体をPages rootとしてdeployした場合:

```text
https://YOUR_NAME.github.io/YOUR_REPOSITORY/?playtest=1
```

## 4. プレイヤー側の動作

1. 匿名Tester IDを入力します。
2. 匿名操作ログ・試合結果・任意アンケートの記録説明へ同意します。
3. 通常のTACTICS 7として対戦します。
4. 試合終了時、まずブラウザへ保存してからクラウド送信します。
5. 通信できない場合は `pending`、HTTP失敗時は `failed` として保持し、次回起動、オンライン復帰、画面復帰時に再送します。

同じ `matchId` はDBの主キーなので重複しません。各試合にはランダムなupload tokenも発行され、同じ端末からのアンケート更新は許可しつつ、tokenを知らない別クライアントによる既存matchIdの上書きを拒否します。

同意しない場合、Human Playtest Loggerとリモート送信を開始せず、通常ホームへ戻ります。氏名・メール・住所・IP・User-Agent等をアプリのログ項目として保存しません。ホスティング事業者の標準アクセスログは各サービスの運用範囲です。

## 5. CORE LABから読む

1. `core_lab.html` を管理者だけが操作する環境で開きます。
2. 「管理者クラウド同期」を展開します。
3. Admin endpointを確認し、`PLAYTEST_ADMIN_TOKEN` を一時入力します。
4. 「クラウドから同期」を押します。

tokenはlocalStorageへ保存されません。公開Pages上のCORE LABファイル自体を知られても、tokenなしではREADできません。より厳密に管理画面を非公開にする場合は、`core_lab.html` をローカルまたはアクセス制限付きの別ホストで開き、`CORE_LAB_ALLOWED_ORIGINS` もそのOriginだけにします。

既存のHuman Playtest JSON Export/Importはバックアップ・デバッグ・移行用として残っています。

## 6. ログ構造

- Match Summary: matchId、Tester ID、version群、seed、クラス/デッキ、先後、勝敗、Ply/Round/Player Turn、COMMANDER HP、アンケート
- Decision Log: state、legalActions、chosenAction、outcome、decisionTimeMs、inputMethod、詳細閲覧、キャンセル、seed付きreplay action列

`source: "human_playtest"` と、`gameVersion` / `cardSetVersion` / `logSchemaVersion` / `coreVersion` を保存します。AI自動対戦とは混在させず、ログ取得によってAI評価値を変更しません。

## 7. 容量の実測と無料枠の目安

代表的な12 Plyの自動操作試合で、Summary 0.77KB、Decision Log 87.20KB、合計87.97KBでした。

| 試合数 | 概算容量 |
|---:|---:|
| 20 | 1.72MB |
| 100 | 8.59MB |
| 1,000 | 85.91MB |

実際の人間試合は意思決定数と盤面状態により増減します。現行のSupabase Free planはDatabase 500MB、Edge Function 500,000 calls、egress 5GBを含みます。約88KB/試合の単純計算ではDB本文だけで約5,800試合ですが、JSONB・index・Postgres管理領域を考え、運用上は数千試合未満を安全側の目安にします。Free projectは低活動時にpauseされる場合があるため、友達へ送る前に起動状態を確認してください。

## 8. 公開前チェック

- `test_v41_cloud.html`: 保存、同期、アンケート更新、重複防止、offline、retry、複数Tester、version、2層ログ
- `test_v41_ui.html`: Tester ID、同意、844×390、通常ホーム、研究用語非表示
- `test_v40_drag.html`: 1600×900 / 1366×768 / 844×390のdrag/click/touch/H2/logger回帰

実Supabaseへの本番疎通も完了しています。公開ページで1試合を完走し、ローカル保存、クラウド同期、管理者取得APIで同一matchIdと48件のDecision Logを照合しました。
