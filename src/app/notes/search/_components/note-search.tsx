"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { NoteDto } from "@/server/application/dto/note/note.dto";
import type { ListNotesResponse } from "@/server/entry/api/internal/notes";
import { NoteList } from "../../_components/note-list";

// 入力が止まってから検索するまでの時間（docs/02_共通設計/04_データ取得・更新.md の「5.2」）
const DEBOUNCE_MS = 300;

async function fetchNotes(keyword: string): Promise<NoteDto[]> {
  const params = new URLSearchParams({ q: keyword });
  const response = await fetch(`/api/internal/notes?${params}`);
  if (!response.ok) {
    throw new Error("検索に失敗しました");
  }
  const body: ListNotesResponse = await response.json();
  return body.data;
}

export function NoteSearch({ initialNotes }: { initialNotes: NoteDto[] }) {
  const [input, setInput] = useState("");
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setKeyword(input.trim()), DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [input]);

  const { data, isFetching, isError } = useQuery({
    queryKey: ["notes", { keyword }],
    queryFn: () => fetchNotes(keyword),
    // 検索語が空のときは、Server Component で取得した結果を使う（ブラウザからは取得しない）
    initialData: keyword === "" ? initialNotes : undefined,
    // 取得中は前の結果を表示したままにする
    placeholderData: keepPreviousData,
  });

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium">検索語</span>
        <input
          type="search"
          name="q"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          maxLength={100}
          placeholder="例: 設計"
          className="h-10 rounded-md border border-border bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
        />
      </label>
      <p aria-live="polite" className="min-h-5 text-sm text-muted-foreground">
        {isError
          ? "検索に失敗しました。時間をおいてもう一度お試しください"
          : isFetching
            ? "検索中…"
            : null}
      </p>
      <NoteList notes={data ?? []} />
    </div>
  );
}
