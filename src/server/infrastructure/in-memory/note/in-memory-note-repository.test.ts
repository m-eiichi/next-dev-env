import { describe, expect, it } from "vitest";
import { Note } from "@/server/domain/note/entity";
import { NoteTitle } from "@/server/domain/note/value-objects/note-title";
import { InMemoryNoteQueryService } from "./in-memory-note-query-service";
import { InMemoryNoteRepository } from "./in-memory-note-repository";

// 更新（リポジトリ）と読み取り（Query Service）が、同じ仮のデータを共有していることを確かめる
describe("InMemoryNoteRepository", () => {
  it("保存したメモが、読み取り側の一覧の先頭に出る", async () => {
    const repository = new InMemoryNoteRepository();
    const note = Note.create({ title: "保存のテスト", body: null });

    await repository.save(note);
    const [first] = await new InMemoryNoteQueryService().list();

    expect(first).toEqual({ id: note.id, title: "保存のテスト", body: null });
  });

  it("同じタイトルがあるかを、前後の空白を除いて確かめる", async () => {
    const repository = new InMemoryNoteRepository();
    await repository.save(Note.create({ title: "重複のテスト", body: null }));

    expect(await repository.existsByTitle(NoteTitle.of("  重複のテスト  "))).toBe(true);
    expect(await repository.existsByTitle(NoteTitle.of("まだないタイトル"))).toBe(false);
  });
});
