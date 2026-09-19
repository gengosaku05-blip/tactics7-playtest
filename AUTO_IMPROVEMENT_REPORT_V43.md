# TACTICS 7 Ver.0.43 Auto Improvement Lab

## 1. Auto Improvementの流れ

Human Auto Reportの候補を読み、問題タイプ・根拠・標本数・確度を表示します。安全ゲート通過後のみ一変数Candidateを作成し、runtime overrideでCURRENTと隔離してpaired AI A/Bを実施します。結果は仮説、変更、実測、副作用、Human再テスト要否とともに並列表示します。Productionへのmerge・deployは行いません。

## 2. Human sample gate

- 20試合未満: OBSERVE。修正候補を自動生成しない
- 20〜49試合: PROPOSE。提案のみ
- 50試合以上: Tester数5以上、最大Tester比率60%以下ならAUTO_AB候補
- Tester偏りが強い場合: Tester-specific possibilityとして自動A/B対象外

match weightedとtester balancedの差も表示します。現在は実ログ1試合のためOBSERVEです。

## 3. Candidate生成と一変数原則

Manifestは `candidateId / baseVersion / sourceCandidate / type / hypothesis / changedFiles / changedValues / expectedEffect / possibleSideEffects / humanEvidence / aiEvidence / status` を持ちます。各DRY RUN Manifestは1値だけ変更します。

問題タイプは `CARD_BALANCE / CLASS_BALANCE / AI_BEHAVIOR / UX_CLARITY / INPUT_USABILITY / FUN / CORE_RULE / UNKNOWN` を扱います。FUNは仮説まで、CORE_RULEはCore Research Requiredとして自動変更対象外です。

## 4. 隔離とProduction保護

通常URLではoverrideはゼロです。Candidate Human Test URLに明示的な `candidate` queryがある場合だけ、登録済みManifestの値をブラウザセッション内で上書きします。画面上部にCandidate表示を出し、Humanログへ`candidateId`を保存します。

## 5. AI A/B

同一seed、同一デッキ、同一AI、先後反転でCURRENT/CANDIDATEを比較します。測定は打ち切り、先攻勝率、平均Ply、Player Turn 8〜11、Player Turn 15、COMMANDER hit/damage、近接/遠距離、進化、防衛キャンプ、カード使用、デッキ勝率です。現在のCoreLab schemaにBCRがない場合は推測せず`not available`とします。

## 6. DRY RUN結果

既知AI結果の王国69.48%だけをパイプライン検証入力とし、Human n=1は修正根拠に使っていません。

### Candidate A: 破城騎士団 COST 8→9

- CURRENT/CANDIDATE: 各48試合
- 打ち切り: 4.17% → 6.25%（+2.08pt）
- 先攻勝率: 56.52% → 53.33%（-3.19pt）
- 平均: 18.88 → 19.58 Ply（+0.70）
- Player Turn 8〜11: 66.67% → 64.58%（-2.09pt）
- Player Turn 15到達: 4.17% → 10.42%（+6.25pt）
- COMMANDER damage: 366 → 352

小規模DRY RUNでは決着遅延の副作用が見られ、採用判断はできません。Candidate B（HP -1）、C（近接 -1）と並列で保持します。

## 7. 回帰テスト

- Human gate / Tester偏り / 3並列Manifest / paired A/B / override復元 / 副作用監査 / status / Human URL: 10/10 PASS
- Ver.0.42 Auto Analyst: 14/14 PASS
- Ver.0.40 drag/click/H2/Logger: 16/16 PASS
- Candidate override: COST 9、ログcandidateId、schema 0.43を確認

## 8. Human Candidate Test

CORE LABの「Human Testへ」で別Candidate URLを開きます。通常Production URLは変わりません。候補版のログは`candidateId`でCURRENTと分離し、勝率、楽しさ、分かりやすさ、Play Again、decisionTime、コメントを比較できます。

## 9. 採用・却下フロー

管理者は `採用候補にする / 却下 / Human Testへ / 再調整` を選べます。状態は管理ブラウザのlocalStorage内Manifestへ保存します。「採用候補にする」はshortlistであり、Production変更ではありません。

## 10. 自動化範囲と人間判断

自動化できるのは、標本ゲート、候補分類、単一値override、paired AI A/B、定量副作用検出、Manifest・Human Test URL作成です。楽しさの原因、UXの正解、クラスIdentity、Core変更、正式カード値、最終採用は人間判断です。

## 11. Human Imitation接続

Ver.0.42 Datasetを将来AI_BEHAVIOR Candidate生成器へ渡せます。`stateFeatures / legalActions / chosenAction / outcome`からルールベース評価差を抽出し、召喚位置・進化・攻撃対象などを1項目ずつAI overrideへ変換する拡張点です。ニューラルネット学習やAI自動更新は実装していません。
