import Link from "next/link";

export function Header() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4 sm:px-6">
        <Link href="/" className="font-semibold tracking-tight">
          Next.js 開発テンプレート
        </Link>
      </div>
    </header>
  );
}
