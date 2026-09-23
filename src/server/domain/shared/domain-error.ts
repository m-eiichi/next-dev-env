// 業務のルール違反を表すエラーの基底クラス
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = new.target.name;
  }
}
