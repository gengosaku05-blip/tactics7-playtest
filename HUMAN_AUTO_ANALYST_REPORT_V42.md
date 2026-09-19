# TACTICS 7 Ver.0.42 Human Playtest Auto Analyst

## 流れ

1. 友達が公開PLAYTESTを遊ぶ
2. Ver.0.41 LoggerがSupabaseへ元ログを保存
3. CORE LABが管理者READ APIからログを取得
4. Versionを選び「Human Auto Reportを分析」
5. 集計結果を元ログとは別のlocalStorage領域へ最大20件保存

元ログの変更・削除、AI・カード・Coreの自動変更は行いません。基本統計と候補抽出はブラウザ内で動き、LLMや有料APIを必要としません。

## CORE LABで確認できる内容

- 試合、Tester、人間/CPU、先後、クラス、デッキ
- Player Turn 8〜11、Player Turn 15到達
- match weighted / tester balanced
- AI Phase 1クラス勝率との比較
- 召喚、遠距離後列、進化、カード使用、COMMANDERダメージ
- decisionTime中央値/P75/P90と60秒超の分離
- drag/click、cancel/dragCancel、カード詳細閲覧
- 楽しさ、分かりやすさ、Play Again、コメント原文
- Balance / AI / UX / Fun Candidates

すべての率は勝数/試合数などの母数を伴います。5試合未満は「データ不足」、少数標本では強い調整判断を出しません。

## Human vs AI

Ver.0.37成果物のクラス勝率を利用します。HumanがAIを十分上回るクラスはAI運用候補、双方が高い場合はカード/クラス候補として表示します。CPU側Decision Snapshotが既存ログにないため、AIの遠距離後列率、類似局面行動、進化後成果は推測せず「比較データなし」とします。今後AI観測ログを追加すれば同じreport schemaへ接続できます。

## Candidateの扱い

- Balance: Human/AI双方の勝率、カード使用試合勝率
- AI: HumanとAIの差、遠距離配置の追加監査候補
- UX: 詳細閲覧、判断時間、cancel
- Fun: Play Againと楽しさ

P0/P1/P2はサンプル数と効果量からルールベースで付け、確定判断ではありません。相関と因果は分離します。

## Human Imitation Dataset

CORE LABの「Human Imitation Dataset」から、`stateFeatures / legalActions / chosenAction / outcome / result / testerId / version` をJSON出力できます。匿名ログだけを使い、CPU AIへ自動適用しません。

## 定期分析

Ver.0.42では管理者がクラウド同期後に分析する無料のオンデマンド方式です。Supabase Cron、LLM、毎試合Function呼び出しは追加していません。将来は同じ純粋分析関数をEdge Functionの日次処理へ移し、集計JSONだけを別テーブルへ保存できます。

## テスト

0試合、1試合、5試合、複数Tester、Tester偏り、AI/Human比較、Version混在、decisionTime外れ値、survey未回答、drag/click、card detail、cancel、imitation export、report renderの14項目を検証しました。

## 人間判断が必要なこと

候補の原因、面白さの理由、カード調整、AI評価値変更、Core変更は人間がリプレイと実プレイを確認し、次Versionの一変数A/Bとして決めます。
