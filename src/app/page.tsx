import { listArchitectureLayers } from "@/server/entry/queries/architecture-layer/list-architecture-layers";
import { listGettingStartedSteps } from "@/server/entry/queries/getting-started/list-getting-started-steps";
import { listTechStack } from "@/server/entry/queries/tech-stack/list-tech-stack";
import { ArchitectureSection } from "./_components/architecture-section";
import { GettingStartedSection } from "./_components/getting-started-section";
import { HeroSection } from "./_components/hero-section";
import { TechStackSection } from "./_components/tech-stack-section";

// 詳細設計: docs/03_画面設計/SCR-001_トップ.md
export default async function Page() {
  // 互いに依存しない取得なので、まとめて待つ
  const [techStack, architectureLayers, gettingStartedSteps] = await Promise.all([
    listTechStack(),
    listArchitectureLayers(),
    listGettingStartedSteps(),
  ]);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-12 px-4 py-12 sm:px-6 sm:py-16">
      <HeroSection />
      <TechStackSection techStack={techStack} />
      <ArchitectureSection layers={architectureLayers} />
      <GettingStartedSection steps={gettingStartedSteps} />
    </div>
  );
}
