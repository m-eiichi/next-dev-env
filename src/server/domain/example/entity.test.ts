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
});
