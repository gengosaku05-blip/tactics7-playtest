# TACTICS 7 Ver.0.45 iPhone Landscape Safe Area

## 原因

`viewport-fit=cover` は既に指定されていましたが、横画面HUDが `left: 3px` / `right: 3px` と `100vw` を基準に絶対配置され、`safe-area-inset-left/right` を差し引いていませんでした。ブラウザの844×390エミュレーションではSafe Areaが0になるため検出できませんでした。

## 対応

- `viewport-fit=cover`を維持し、拡大による横幅変動を避けるviewport設定へ統一。
- `env(safe-area-inset-left/right/top/bottom)`を共通CSS変数へ集約。
- 背景は端まで描画し、盤面、COMMANDER、手札、上部ボタン、右操作パネル、モーダルだけを安全領域内へ配置。
- 盤面サイズはSafe Areaを除いた幅と、`visualViewport`を反映した高さの小さい方から算出。
- `resize`、`orientationchange`、`visualViewport.resize`で表示領域を再計算。
- 開発時は`?dev=1&safeArea=1`でSafe Area境界を表示可能。
- `?test=1&safeLeft=47&safeRight=0`形式で人工Safe Areaを再現可能。

ゲームルール、カード、デッキ、AI、F1/H2/G2R、ログ形式は変更していません。
