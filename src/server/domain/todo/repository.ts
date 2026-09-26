import type { Todo } from "./entity";

// 更新（command）に要るものだけを置く。一覧・絞り込みは Query Service
// （src/server/application/query/todo/todo-query-service.ts。docs/01_全体設計/06_アーキテクチャ.md の「4.3」）
export interface TodoRepository {
  // 変更・削除の前に、今の状態を取り出すため
  findById(id: string): Promise<Todo | null>;
  // 新しければ追加し、あれば上書きする
  save(todo: Todo): Promise<void>;
  delete(id: string): Promise<void>;
}
