import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Plane,
  PlaneTakeoff,
  PlaneLanding,
  RotateCcw,
  Share2,
  Check,
  ArrowRight,
  FileText,
  Wallet,
  PiggyBank,
  Compass,
} from "lucide-react";
import { phases, allTaskIds, allSteps } from "@/data/roadmap";
import {
  stepCosts,
  stepDocs,
  totalEstimatedCostLabel,
  costSavingTips,
} from "@/data/roadmap-extras";
import { stepPaths } from "@/data/roadmap-paths";
import { StepCard } from "@/components/roadmap/StepCard";
import { FlightPath } from "@/components/roadmap/FlightPath";
import { TurkeyFlag, GermanyFlag } from "@/components/roadmap/Flags";
import { OnboardingWizard } from "@/components/roadmap/OnboardingWizard";
import { useProgress } from "@/hooks/use-progress";
import { usePathAnswers } from "@/hooks/use-path-answers";
import { resolvePath } from "@/lib/path-resolver";
import { cn } from "@/lib/utils";
import { SITE_URL } from "@/config/site";
import heroFlight from "@/assets/hero-flight.jpg";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const PAGE_TITLE = "TR → DE Öğrenci Rotası | 17 Adım, Evrak ve Ücret Rehberi";
const PAGE_DESCRIPTION =
  "Türkiye'den Almanya'ya öğrenci yolculuğu: 5 etap, 17 adım, ara adım kontrol listeleri, gereken evrakların nasıl alınacağı ve tahmini ücretler tek sayfada.";
const OG_DESCRIPTION =
  "Denklik, dil, başvuru, vize, konaklama ve Almanya içi bürokrasi: sıralı adımlar, evrak temin yolları ve tahmini maliyetler.";
const ogImage = `${SITE_URL}${heroFlight}`;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: PAGE_TITLE },
      { name: "description", content: PAGE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: PAGE_TITLE },
      { property: "og:description", content: OG_DESCRIPTION },
      { property: "og:image", content: ogImage },
      { property: "og:image:width", content: "1536" },
      { property: "og:image:height", content: "768" },
      {
        property: "og:image:alt",
        content: "Uçak kanadından bulutların üzerinde Almanya'ya doğru uçuş",
      },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: PAGE_TITLE },
      { name: "twitter:description", content: OG_DESCRIPTION },
      { name: "twitter:image", content: ogImage },
      {
        "script:ld+json": {
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Almanya Yol Haritası",
          url: SITE_URL,
          description: PAGE_DESCRIPTION,
          inLanguage: "tr",
        },
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
  }),
  component: RoadmapPage,
});

type Accent = { text: string; border: string; bg: string; fill: string };

const phaseAccent: Record<string, Accent> = {
  faz1: {
    text: "text-sky-deep",
    border: "border-sky-deep/40",
    bg: "bg-sky-deep/10",
    fill: "bg-sky-deep",
  },
  faz2: { text: "text-gold", border: "border-gold/50", bg: "bg-gold/15", fill: "bg-gold" },
  faz3: { text: "text-money", border: "border-money/40", bg: "bg-money/10", fill: "bg-money" },
  faz4: {
    text: "text-flag-red",
    border: "border-flag-red/40",
    bg: "bg-flag-red/10",
    fill: "bg-flag-red",
  },
  faz5: {
    text: "text-primary",
    border: "border-primary/30",
    bg: "bg-primary/10",
    fill: "bg-primary",
  },
};

const defaultAccent: Accent = phaseAccent["faz5"]!;

function RoadmapPage() {
  const { done, hydrated, toggle, setMany, reset } = useProgress();
  const { answers: pathAnswers, hydrated: pathHydrated } = usePathAnswers();
  const [shared, setShared] = useState(false);
  const [costOpen, setCostOpen] = useState(false);
  const [wizardOpen, setWizardOpen] = useState(false);

  const quizStepIds = useMemo(() => allSteps.map((s) => s.id).filter((id) => stepPaths[id]), []);
  const quizAnsweredCount = quizStepIds.filter(
    (id) => resolvePath(stepPaths[id]!, pathAnswers[id] ?? []).result,
  ).length;

  useEffect(() => {
    if (!pathHydrated) return;
    const seen = localStorage.getItem("almanya-onboarding-seen-v1");
    if (!seen && quizAnsweredCount === 0) {
      setWizardOpen(true);
      localStorage.setItem("almanya-onboarding-seen-v1", "1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathHydrated]);

  const costSteps = phases
    .flatMap((p) => p.steps)
    .filter((s) => (stepCosts[s.id] ?? []).length > 0);

  const totals = useMemo(() => {
    const total = allTaskIds.length;
    const completed = allTaskIds.filter((id) => done[id]).length;
    return { total, completed, pct: total ? Math.round((completed / total) * 100) : 0 };
  }, [done]);

  const phaseStats = phases.map((p) => {
    const ids = p.steps.flatMap((s) => s.tasks.map((t) => t.id));
    const c = ids.filter((id) => done[id]).length;
    return { pct: ids.length ? Math.round((c / ids.length) * 100) : 0 };
  });

  const docCount = Object.values(stepDocs).reduce((n, d) => n + d.length, 0);

  const shown = hydrated ? totals.pct : 0;
  const currentStep =
    phases.flatMap((p) => p.steps).find((s) => s.tasks.some((t) => !done[t.id])) ?? null;

  async function share() {
    const url = typeof window !== "undefined" ? window.location.href : "";
    const data = {
      title: "TR → DE Öğrenci Rotası",
      text: "Türkiye'den Almanya'ya öğrenci yolculuğu: 17 adım, evraklar ve tahmini ücretler.",
      url,
    };
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share(data);
        return;
      }
      await navigator.clipboard.writeText(url);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    } catch {
      /* kullanıcı vazgeçti */
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Status bar ---------- */}
      <div className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3">
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold tracking-wide text-foreground">
            <TurkeyFlag className="h-4 w-6 rounded-sm" title="Türkiye" /> TR
          </span>
          <div className="relative h-1.5 flex-1 rounded-full bg-secondary">
            <div
              className="gate-badge h-full rounded-full transition-[width] duration-700"
              style={{ width: `${shown}%` }}
            />
            <Plane
              className="absolute top-1/2 size-4 -translate-y-1/2 rotate-90 text-primary transition-[left] duration-700"
              style={{ left: `calc(${shown}% - 8px)` }}
              aria-hidden
            />
          </div>
          <span className="flex shrink-0 items-center gap-1.5 font-mono text-xs font-semibold tracking-wide text-foreground">
            DE <GermanyFlag className="h-4 w-6 rounded-sm" title="Almanya" />
          </span>
          <span className="font-mono text-sm font-bold tabular-nums text-primary">{shown}%</span>
          <button
            type="button"
            onClick={share}
            title="Bu rotayı paylaş"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 font-mono text-[0.7rem] text-foreground transition-colors hover:bg-accent"
          >
            {shared ? <Check className="size-3.5 text-success" /> : <Share2 className="size-3.5" />}
            <span className="hidden sm:inline">{shared ? "KOPYALANDI" : "PAYLAŞ"}</span>
          </button>
          <button
            type="button"
            onClick={reset}
            title="İlerlemeyi sıfırla"
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-accent"
          >
            <RotateCcw className="size-3.5" />
            <span className="sr-only">Sıfırla</span>
          </button>
        </div>
      </div>

      {/* ---------- Header ---------- */}
      <header className="border-b border-border bg-card">
        <div className="relative h-56 w-full overflow-hidden border-b border-border md:h-80">
          <img
            src={heroFlight}
            alt="Uçak kanadından bulutların üzerinde Almanya'ya doğru uçuş"
            width={1536}
            height={768}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-card/10" />
          <div className="absolute inset-x-0 bottom-0">
            <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 pb-5">
              <TurkeyFlag className="h-7 w-11 rounded shadow-sm" title="Türkiye" />
              <span className="h-px flex-1 bg-flag-red/40" />
              <Plane className="size-5 rotate-90 text-primary" aria-hidden />
              <span className="h-px flex-1 bg-flag-red/40" />
              <GermanyFlag className="h-7 w-11 rounded shadow-sm" title="Almanya" />
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-5xl px-4 py-14 md:py-20">
          <p className="font-mono text-xs tracking-[0.2em] text-muted-foreground">
            ÖĞRENCİ GÖÇ PLANI · 5 ETAP · 17 ADIM
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4">
            <span className="inline-flex items-center gap-2.5">
              <TurkeyFlag className="h-8 w-12 rounded shadow-sm" title="Türkiye" />
              <span className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                TR
              </span>
            </span>
            <ArrowRight className="size-6 text-flag-red" aria-hidden />
            <span className="inline-flex items-center gap-2.5">
              <span className="font-heading text-2xl font-bold text-foreground md:text-3xl">
                DE
              </span>
              <GermanyFlag className="h-8 w-12 rounded shadow-sm" title="Almanya" />
            </span>
          </div>

          <h1 className="mt-6 max-w-3xl font-heading text-3xl leading-[1.15] font-bold text-foreground md:text-5xl">
            Türkiye'den Almanya'ya öğrenci rotası
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground md:text-lg">
            Denklikten oturum kartına kadar tüm süreç sıralı adımlara bölündü. Her adımda ara
            kontrol listeleri, gereken evraklar ve nereden alınacağı, ayrıca tahmini ücretler yer
            alır. İlerlemen bu cihazda otomatik saklanır.
          </p>

          <button
            type="button"
            onClick={() => setWizardOpen(true)}
            className="mt-6 flex w-full max-w-2xl cursor-pointer items-center gap-4 rounded-lg border border-primary/30 bg-primary/5 px-4 py-3.5 text-left transition-colors hover:bg-primary/10"
          >
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <Compass className="size-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-heading text-sm font-semibold text-foreground">
                {quizAnsweredCount > 0
                  ? `Hızlı testler: ${quizAnsweredCount}/${quizStepIds.length} tamamlandı`
                  : `${quizStepIds.length} soruluk hızlı testi başta yap`}
              </span>
              <span className="mt-0.5 block text-sm text-muted-foreground">
                Denklik, dil ve finansman durumunu baştan yanıtla; rota buna göre kişiselleşsin.
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-primary" aria-hidden />
          </button>

          <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-4">
            {[
              { k: "Etap / adım", v: "5 / 17", icon: PlaneTakeoff },
              { k: "Ara adım", v: `${totals.total}`, icon: Check },
              { k: "Belirtilen evrak", v: `${docCount}`, icon: FileText },
              {
                k: "Toplam tahmini ücret",
                v: totalEstimatedCostLabel,
                icon: Wallet,
                accent: "money" as const,
                onClick: () => setCostOpen(true),
              },
            ].map(({ k, v, icon: Icon, onClick, accent }) => {
              const Wrap = onClick ? "button" : "div";
              return (
                <Wrap
                  key={k}
                  type={onClick ? "button" : undefined}
                  onClick={onClick}
                  className={cn(
                    "bg-card px-4 py-4 text-left",
                    onClick && "cursor-pointer transition-colors hover:bg-accent",
                  )}
                >
                  <dt className="flex items-center gap-1.5 font-mono text-[0.68rem] tracking-wide text-muted-foreground">
                    <Icon
                      className={cn("size-3.5", accent === "money" ? "text-money" : "text-primary")}
                    />{" "}
                    {k.toUpperCase()}
                  </dt>
                  <dd
                    className={cn(
                      "mt-1.5 font-heading text-lg font-bold tabular-nums md:text-xl",
                      accent === "money" ? "text-money" : "text-foreground",
                    )}
                  >
                    {v}
                  </dd>
                </Wrap>
              );
            })}
          </dl>

          {currentStep && hydrated && (
            <p className="mt-8 inline-flex items-center gap-2 rounded-md border border-border bg-secondary/60 px-3.5 py-2 text-sm text-foreground">
              <Plane className="size-4 text-primary" aria-hidden />
              Sıradaki adım:{" "}
              <span className="font-semibold">
                {String(currentStep.no).padStart(2, "0")} · {currentStep.title}
              </span>
            </p>
          )}

          {/* Etap navigation */}
          <ul className="mt-10 grid gap-2 sm:grid-cols-2 md:grid-cols-5">
            {phases.map((p, i) => {
              const accent = phaseAccent[p.id] ?? defaultAccent;
              return (
                <li key={p.id} className="flex">
                  <a
                    href={`#${p.id}`}
                    className={cn(
                      "flex w-full cursor-pointer flex-col rounded-md border bg-background px-3 py-3 transition-colors hover:bg-secondary/40",
                      accent.border,
                      accent.text,
                    )}
                  >
                    <span className="font-mono text-[0.65rem] tracking-widest">
                      ETAP {String(p.no).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-sm leading-tight font-semibold text-foreground">
                      {p.name}
                    </span>
                    <span className="mt-auto flex items-center gap-2 pt-2.5">
                      <span className="block h-1 flex-1 overflow-hidden rounded-full bg-secondary">
                        <span
                          className={cn(
                            "block h-full transition-[width] duration-700",
                            accent.fill,
                          )}
                          style={{ width: hydrated ? `${phaseStats[i]?.pct ?? 0}%` : "0%" }}
                        />
                      </span>
                      <span className="font-mono text-[0.65rem] tabular-nums text-muted-foreground">
                        {hydrated ? (phaseStats[i]?.pct ?? 0) : 0}%
                      </span>
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {/* ---------- Route ---------- */}
      <main className="mx-auto max-w-5xl px-4 pb-24">
        {phases.map((phase, pi) => {
          const accent = phaseAccent[phase.id] ?? defaultAccent;
          return (
            <section key={phase.id} id={phase.id} className="scroll-mt-20 pt-16">
              <div className="flex items-center gap-4 border-b border-border pb-5">
                <span
                  className={cn(
                    "grid size-11 shrink-0 place-items-center rounded-md border font-mono text-sm font-bold",
                    accent.border,
                    accent.bg,
                    accent.text,
                  )}
                >
                  {String(phase.no).padStart(2, "0")}
                </span>
                <div>
                  <p className={cn("font-mono text-[0.68rem] tracking-[0.2em]", accent.text)}>
                    ETAP {String(phase.no).padStart(2, "0")}
                  </p>
                  <h2 className="font-heading text-xl font-bold text-foreground md:text-2xl">
                    {phase.name}
                  </h2>
                </div>
                <span className="ml-auto font-mono text-sm tabular-nums text-muted-foreground">
                  {hydrated ? (phaseStats[pi]?.pct ?? 0) : 0}%
                </span>
              </div>

              <div className="relative mt-10">
                {/* dotted flight route + moving plane */}
                <div className="pointer-events-none absolute inset-y-0 left-0 w-12 md:left-1/2 md:w-28 md:-translate-x-1/2">
                  <FlightPath className="h-full w-full" />
                  <Plane
                    className={cn(
                      "absolute left-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rotate-[135deg] drop-shadow-sm transition-[top] duration-700",
                      accent.text,
                    )}
                    style={{ top: `${hydrated ? (phaseStats[pi]?.pct ?? 0) : 0}%` }}
                    aria-hidden
                  />
                </div>

                <ol className="space-y-6">
                  {phase.steps.map((step, si) => {
                    const right = si % 2 === 1;
                    return (
                      <li
                        key={step.id}
                        className={cn(
                          "relative pl-14 md:w-[calc(50%-3.5rem)] md:pl-0",
                          right && "md:ml-auto",
                        )}
                      >
                        <span
                          className={cn(
                            "absolute top-7 z-10 grid size-6 place-items-center rounded-full border border-border bg-card font-mono text-[0.6rem] font-bold text-muted-foreground",
                            "left-[12px] md:left-auto",
                            right ? "md:-left-[1rem]" : "md:-right-[1rem]",
                          )}
                          aria-hidden
                        >
                          {step.no}
                        </span>
                        <StepCard step={step} done={done} onToggle={toggle} onSetMany={setMany} />
                      </li>
                    );
                  })}
                </ol>
              </div>

              {pi === phases.length - 1 && (
                <div className="boarding-card mt-16 rounded-lg p-8 text-center md:p-10">
                  <GermanyFlag
                    className="mx-auto h-12 w-18 rounded shadow-sm"
                    title="Almanya bayrağı — varış"
                  />
                  <p className="mt-4 inline-flex items-center gap-2 font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground">
                    <PlaneLanding className="size-4 text-primary" /> VARIŞ · ALMANYA
                  </p>
                  <h2 className="mt-3 font-heading text-xl font-bold text-foreground md:text-2xl">
                    Rota tamamlandığında
                  </h2>
                  <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">
                    17 adımın tamamı işaretlendiğinde elinde oturum kartın, öğrenci kimliğin ve bir
                    Alman üniversitesinde kayıtlı kontenjanın olur.
                  </p>
                  <p
                    className={cn(
                      "mt-6 inline-block rounded-md px-5 py-2 font-mono text-sm font-bold",
                      totals.pct === 100
                        ? "landed-badge stamp-in"
                        : "border border-border bg-secondary text-foreground",
                    )}
                  >
                    {totals.pct === 100 ? "ROTA TAMAMLANDI" : `${shown}% TAMAMLANDI`}
                  </p>
                </div>
              )}
            </section>
          );
        })}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-secondary/50 px-5 py-5">
          <div>
            <p className="font-heading text-base font-semibold text-foreground">Bu rotayı paylaş</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Aynı yolu izleyen bir arkadaşına linki gönder.
            </p>
          </div>
          <button
            type="button"
            onClick={share}
            className="gate-badge inline-flex cursor-pointer items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            {shared ? <Check className="size-4" /> : <Share2 className="size-4" />}
            {shared ? "Link kopyalandı" : "Linki paylaş"}
          </button>
        </div>
      </main>

      <footer className="border-t border-border bg-card py-8">
        <p className="mx-auto max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground">
          Tutarlar, süreler ve şartlar tahminîdir; resmî bilgi için üniversite, konsolosluk ve
          Ausländerbehörde duyurularını esas al.
        </p>
        <p className="mx-auto mt-3 max-w-2xl px-4 text-center text-sm leading-relaxed text-muted-foreground">
          Bir hata mı gördün, güncellenmesi gereken bir bilgi mi var? Bize yaz:{" "}
          <a
            href="mailto:business.burakaktas@gmail.com"
            className="cursor-pointer font-semibold text-primary underline-offset-4 hover:underline"
          >
            business.burakaktas@gmail.com
          </a>
        </p>
      </footer>

      <Dialog open={wizardOpen} onOpenChange={setWizardOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Compass className="size-4.5 text-primary" /> Hızlı test: rotanı kişiselleştir
            </DialogTitle>
            <DialogDescription>
              Birkaç soruyu yanıtla; sonuçlar ilgili adımlarda otomatik görünür.
            </DialogDescription>
          </DialogHeader>
          <OnboardingWizard onFinished={() => setWizardOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={costOpen} onOpenChange={setCostOpen}>
        <DialogContent className="max-h-[85vh] max-w-lg overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 font-heading">
              <Wallet className="size-4.5 text-money" /> Ücret kalemleri
            </DialogTitle>
            <DialogDescription>
              Toplam tahmini:{" "}
              <span className="font-semibold text-money">{totalEstimatedCostLabel}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="rounded-md border border-money/30 bg-money/10 p-4">
            <p className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
              <PiggyBank className="size-4 text-money" /> Ücreti azaltmanın yolları
            </p>
            <ul className="mt-3 space-y-2.5">
              {costSavingTips.map((tip) => (
                <li key={tip.title} className="text-sm leading-relaxed">
                  <span className="font-semibold text-foreground">{tip.title}:</span>{" "}
                  <span className="text-muted-foreground">{tip.text}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            {costSteps.map((step) => (
              <div key={step.id}>
                <p className="font-mono text-[0.7rem] tracking-wide text-muted-foreground">
                  ADIM {String(step.no).padStart(2, "0")} · {step.title}
                </p>
                <div className="mt-2 overflow-hidden rounded-md border border-border">
                  <table className="w-full text-sm">
                    <tbody>
                      {stepCosts[step.id]!.map((c) => (
                        <tr key={c.label} className="border-b border-border last:border-0">
                          <td className="px-3 py-2.5 align-top">
                            <span className="block text-foreground">{c.label}</span>
                            {c.note && (
                              <span className="mt-0.5 block text-[0.78rem] text-muted-foreground">
                                {c.note}
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-2.5 text-right align-top font-mono text-[0.8rem] tabular-nums text-money">
                            {c.amount}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
