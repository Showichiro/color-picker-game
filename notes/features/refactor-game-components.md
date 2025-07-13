# Refactor Game Components

## 目的
`Game.tsx`コンポーネントの責務が大きすぎるため、単一責任の原則に従って複数のコンポーネントに分割する。

## 現状の問題点
`Game.tsx`が以下の複数の責務を持っている：
1. レイアウト構造の管理
2. ゲーム統計（スコア、レベル、ライフ、ストリーク）の表示
3. エラーメッセージの表示
4. ゲーム状態（開始前、プレイ中、ゲームオーバー）の管理と表示
5. ゲーム説明文の表示

## リファクタリング計画

### 新規作成するコンポーネント

1. **GameHeader.tsx**
   - ゲーム統計（スコア、レベル、ライフ、ストリーク）の表示
   - Props: `{ score: number, level: number, lives: number, streak: number }`

2. **GameInstructions.tsx**
   - ゲームルールの説明文を表示
   - Props: なし（静的コンテンツ）

3. **ErrorAlert.tsx**
   - エラーメッセージの表示
   - Props: `{ error: string | null }`

4. **GameStateManager.tsx**
   - ゲーム状態の管理（開始前、プレイ中、ゲームオーバー）
   - Props: `{ game: Game, isGameOver: boolean, currentRound: Round | null, onStartNewRound: () => void, onResetGame: () => void, onGuess: (panelId: ColorPanelId) => void }`

### 実装手順
1. 各コンポーネントをTDDで実装
2. Game.tsxから該当部分を移行
3. 全てのテストが通ることを確認

## 注意事項
- 関数型プログラミングの原則に従う
- 純粋関数として実装
- 副作用は最小限に抑える