import { describe, expect, it } from "vitest";
import { Note } from "./entity";
import { DomainError } from "../shared/domain-error";

describe("Note", () => {
  it("保存されているデータから作り直せる", () => {
    const note = Note.reconstruct({ id: "e1", title: "タイトル", body: "本文" });

    expect(note.id).toBe("e1");
    expect(note.title.value).toBe("タイトル");
    expect(note.body).toBe("本文");
  });

  it("本文が空白だけなら null にする", () => {
    const note = Note.reconstruct({ id: "e1", title: "タイトル", body: "  " });

    expect(note.body).toBeNull();
  });

  it("本文が null なら null のまま", () => {
    const note = Note.reconstruct({ id: "e1", title: "タイトル", body: null });

    expect(note.body).toBeNull();
  });

  it("タイトルがルールに合わなければ DomainError になる", () => {
    expect(() => Note.reconstruct({ id: "e1", title: "", body: null })).toThrow(
      DomainError,
    );
  });

  describe("create（新しく作る）", () => {
    it("ID を割り当てて作る。タイトルと本文の前後の空白は取り除く", () => {
      const note = Note.create({ title: "  タイトル  ", body: "  本文  " });

      expect(note.id).not.toBe("");
      expect(note.title.value).toBe("タイトル");
      expect(note.body).toBe("本文");
    });

    it("作るたびに違う ID になる", () => {
      const first = Note.create({ title: "タイトル", body: null });
      const second = Note.create({ title: "タイトル", body: null });

      expect(first.id).not.toBe(second.id);
    });

    it("本文が空白だけなら null にする", () => {
      expect(Note.create({ title: "タイトル", body: "   " }).body).toBeNull();
    });

    it("本文は 200 文字ちょうどなら作れる", () => {
      expect(Note.create({ title: "タイトル", body: "あ".repeat(200) }).body).toHaveLength(200);
    });

    it("本文が 200 文字を超えると DomainError になる", () => {
      expect(() => Note.create({ title: "タイトル", body: "あ".repeat(201) })).toThrow(
        "本文は 200 文字以内にしてください",
      );
    });

    it("タイトルがルールに合わなければ DomainError になる", () => {
      expect(() => Note.create({ title: " ", body: null })).toThrow(DomainError);
    });
  });
});
