# TACTICS 7 Ver.0.41 実装報告

## 実装した体験

公開URLの `?playtest=1` から、匿名ID → 記録説明と同意 → 通常ホーム → 対戦へ進みます。試合終了時はローカル保存を先に行い、Supabase Edge Functionへ自動送信します。送信状態は結果画面へ小さく表示されます。

## バックエンドと安全性

- Supabase PostgresへSummary/Decisionを別テーブルで保存
- 公開クライアントはEdge Function経由の検証済み書き込みだけ
- DBテーブルはRLS有効、公開roleの直接権限なし
- 管理者READは別Functionと一時admin tokenで保護
- service role keyとadmin tokenを公開JavaScriptへ配置しない
- Origin、payload上限、schema、source、matchIdを検証
- matchId主キーと試合別upload tokenで重複・第三者上書きを防止

## 障害時

`pending / synced / failed` をブラウザへ保持します。online復帰、次回起動、画面再表示で再送します。JSON Export/Importも維持しています。

## CORE LAB

既存のローカルログ集計とJSON Importに加え、折り畳み式の「管理者クラウド同期」を追加しました。取得したmatchは既存のHuman統計とAI比較へ渡されます。tokenは保存しません。

## 容量

代表試合は0.77KB + 87.20KB = 87.97KB。20/100/1000試合は約1.72/8.59/85.91MBです。

## 確認結果

- Ver.0.41 cloud test: 15項目すべてPASS
- Ver.0.41 consent/UI: 6項目すべてPASS（844×390）
- Ver.0.40 drag/logger回帰: 16項目すべてPASS（1600×900、1366×768、844×390）
- 静的配信対象に `/Users/gengo` や `file://` 依存なし

## 残る手動作業

Supabase project作成、schema適用、Function deploy、secret設定、公開anon設定、GitHub Pages有効化はアカウント所有者の操作が必要です。実サービスへの最終疎通はこれらの設定後に行います。
