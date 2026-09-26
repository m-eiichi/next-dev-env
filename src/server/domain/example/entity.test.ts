import { describe, expect, it } from "vitest";
import { Example } from "./entity";
import { DomainError } from "../shared/domain-error";

describe("Example", () => {
  it("保存されているデータから作り直せる", () => {
    const example = Example.reconstruct({ id: "e1", title: "タイトル", description: "説明" });

    expect(example.id).toBe("e1");
    expect(example.title.value).toBe("タイトル");
    expect(example.description).toBe("説明");
  });

  it("説明が空白だけなら null にする", () => {
    const example = Example.reconstruct({ id: "e1", title: "タイトル", description: "  " });

    expect(example.description).toBeNull();
  });

  it("説明が null なら null のまま", () => {
    const example = Example.reconstruct({ id: "e1", title: "タイトル", description: null });

    expect(example.description).toBeNull();
  });

  it("タイトルがルールに合わなければ DomainError になる", () => {
    expect(() => Example.reconstruct({ id: "e1", title: "", description: null })).toThrow(
      DomainError,
    );
  });

  describe("create（新しく作る）", () => {
    it("ID を割り当てて作る。タイトルと説明の前後の空白は取り除く", () => {
      const example = Example.create({ title: "  タイトル  ", description: "  説明  " });

      expect(example.id).not.toBe("");
      expect(example.title.value).toBe("タイトル");
      expect(example.description).toBe("説明");
    });

    it("作るたびに違う ID になる", () => {
      const first = Example.create({ title: "タイトル", description: null });
      const second = Example.create({ title: "タイトル", description: null });

      expect(first.id).not.toBe(second.id);
    });

    it("説明が空白だけなら null にする", () => {
      expect(Example.create({ title: "タイトル", description: "   " }).description).toBeNull();
    });

    it("説明は 200 文字ちょうどなら作れる", () => {
      expect(Example.create({ title: "タイトル", description: "あ".repeat(200) }).description).toHaveLength(200);
    });

    it("説明が 200 文字を超えると DomainError になる", () => {
      expect(() => Example.create({ title: "タイトル", description: "あ".repeat(201) })).toThrow(
        "説明は 200 文字以内にしてください",
      );
    });

    it("タイトルがルールに合わなければ DomainError になる", () => {
      expect(() => Example.create({ title: " ", description: null })).toThrow(DomainError);
    });
  });
});
