// Server Action の戻り値の形（docs/02_共通設計/04_データ取得・更新.md の「3」）
// 想定内のエラー（入力エラー、業務のルール違反、未認証）は ok: false で返し、想定外のものだけ throw する
export type ActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; message: string; fieldErrors?: Partial<Record<string, string[]>> };
