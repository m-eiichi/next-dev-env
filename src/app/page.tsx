import { ArchitectureSection } from "./_components/architecture-section";
import { GettingStartedSection } from "./_components/getting-started-section";
import { HeroSection } from "./_components/hero-section";
import { TechStackSection } from "./_components/tech-stack-section";

// 詳細設計: docs/03_画面設計/SCR-001_トップ.md
export default function Page() {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
      <HeroSection />
      <TechStackSection />
      <ArchitectureSection />
      <GettingStartedSection />
    </div>
  );
}
