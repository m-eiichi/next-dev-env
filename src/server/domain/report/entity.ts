import { ReportName } from "./value-objects/report-name";
import { ReportLayout, type ReportElementProps } from "./value-objects/report-layout";

// ドキュメントのレイアウト（docs/03_画面設計/SCR-041_ドキュメントエディタ.md の「5.1」）
// 部品の並びは外から直接書き換えさせず、ルールを守るメソッド（replaceLayout）でだけ変える
export class Report {
  private constructor(
    readonly id: string,
    readonly name: ReportName,
    private _layout: ReportLayout,
    readonly createdAt: Date,
    private _updatedAt: Date,
  ) {}

  // 新しく作るとき（部品なしの白紙で作る）
  static create(params: { name: string }, now: Date): Report {
    return new Report(crypto.randomUUID(), ReportName.of(params.name), ReportLayout.empty(), now, now);
  }

  // 保存されているデータから作り直すとき
  static reconstruct(params: {
    id: string;
    name: string;
    elements: ReportElementProps[];
    createdAt: Date;
    updatedAt: Date;
  }): Report {
    return new Report(
      params.id,
      ReportName.of(params.name),
      ReportLayout.of(params.elements),
      params.createdAt,
      params.updatedAt,
    );
  }

  get elements(): ReportElementProps[] {
    return this._layout.elements;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // 部品の並びを丸ごと置き換える。ルールに合わなければ DomainError になり、元のまま残る
  replaceLayout(elements: ReportElementProps[], now: Date): void {
    this._layout = ReportLayout.of(elements);
    this._updatedAt = now;
  }
}
