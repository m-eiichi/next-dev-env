import { DomainError } from "../shared/domain-error";
import { TodoTitle } from "./value-objects/todo-title";

// 状態（未完了・完了）を持つエンティティの見本（docs/03_画面設計/SCR-030_TODO一覧.md の「5.1」）
// 状態は外から直接書き換えさせず、ルールを守るメソッド（complete / reopen）でだけ変える
export class Todo {
  private constructor(
    readonly id: string,
    readonly title: TodoTitle,
    readonly createdAt: Date,
    private _completedAt: Date | null,
  ) {}

  // 新しく作るとき（未完了で作る）
  static create(params: { title: string }, now: Date): Todo {
    return new Todo(crypto.randomUUID(), TodoTitle.of(params.title), now, null);
  }

  // 保存されているデータから作り直すとき
  static reconstruct(params: {
    id: string;
    title: string;
    createdAt: Date;
    completedAt: Date | null;
  }): Todo {
    return new Todo(params.id, TodoTitle.of(params.title), params.createdAt, params.completedAt);
  }

  get completedAt(): Date | null {
    return this._completedAt;
  }

  get isCompleted(): boolean {
    return this._completedAt !== null;
  }

  // 完了にできるのは、未完了のものだけ
  complete(now: Date): void {
    if (this.isCompleted) {
      throw new DomainError("すでに完了しています");
    }
    this._completedAt = now;
  }

  // 元に戻せるのは、完了したものだけ
  reopen(): void {
    if (!this.isCompleted) {
      throw new DomainError("まだ完了していません");
    }
    this._completedAt = null;
  }
}
