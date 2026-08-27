import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, ArrowLeft, ArrowRight, FileText, PenLine } from "lucide-react";
import { blogPosts, isPublished } from "@/data/blog-posts";
import { phases } from "@/data/roadmap";
import { stepImages } from "@/data/step-images";
import { SITE_URL, SITE_NAME } from "@/config/site";
import { PlaneIcon } from "@/components/roadmap/PlaneIcon";
import { cn } from "@/lib/utils";
import heroFlight from "@/assets/hero-flight.jpg";

const PAGE_TITLE = "Rehber Yazılar | TR → DE Öğrenci Rotası";
const PAGE_DESCRIPTION =
  "Almanya'ya öğrenci yolculuğunun her adımını derinlemesine anlatan rehber yazılar: denklik, dil, başvuru, finansman, vize, konaklama ve Almanya içi bürokrasi.";

export const Route = createFileRoute("/blog/")({
  head: () => {
    const url = `${SITE_URL}/blog`;
    const image = `${SITE_URL}${heroFlight}`;
    const published = blogPosts.filter(isPublished);
    return {
      meta: [
        { title: PAGE_TITLE },
        { name: "description", content: PAGE_DESCRIPTION },
        { name: "robots", content: "index, follow" },
        { property: "og:type", content: "website" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: PAGE_TITLE },
        { property: "og:description", content: PAGE_DESCRIPTION },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: PAGE_TITLE },
        { name: "twitter:description", content: PAGE_DESCRIPTION },
        { name: "twitter:image", content: image },
        ...(published.length > 0
          ? [
              {
                "script:ld+json": {
                  "@context": "https://schema.org",
                  "@type": "CollectionPage",
                  name: PAGE_TITLE,
                  url,
                  inLanguage: "tr",
                  hasPart: published.map((p) => ({
                    "@type": "Article",
                    headline: p.title,
                    url: `${SITE_URL}/blog/${p.slug}`,
                  })),
                },
              },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogIndexPage,
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

function BlogIndexPage() {
  const publishedCount = blogPosts.filter(isPublished).length;

  const groups = phases.map((phase) => {
    const stepIds = new Set(phase.steps.map((s) => s.id));
    const posts = blogPosts
      .filter((p) => stepIds.has(p.stepId))
      .sort((a, b) => Number(isPublished(b)) - Number(isPublished(a)));
    return { phase, posts };
  });

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Hero ---------- */}
      <header className="border-b border-border bg-card">
        <div className="relative h-40 w-full overflow-hidden border-b border-border md:h-56">
          <img
            src={heroFlight}
            alt="Uçak kanadından bulutların üzerinde Almanya'ya doğru uçuş"
            width={1536}
            height={768}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-card/10" />
        </div>

        <div className="mx-auto max-w-5xl px-4 py-10 md:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 font-mono text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> Rotaya dön
          </Link>

          <p className="mt-6 flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground">
            <BookOpen className="size-3.5" /> REHBER YAZILAR
          </p>
          <h1 className="mt-3 max-w-2xl font-heading text-3xl leading-[1.15] font-bold text-foreground md:text-4xl">
            Rotanın adımlarını derinleştiren yazılar
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground md:text-base">
            Rotadaki her adım tek cümleyle özetlenir; burada o adımlardan seçilenler ayrıntılı
            rehberlere dönüşüyor.
          </p>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-px overflow-hidden rounded-lg border border-border bg-border">
            {[
              { k: "Rehber yazı", v: `${blogPosts.length}`, icon: FileText },
              { k: "Yayında", v: `${publishedCount}`, icon: BookOpen },
              { k: "Yazım aşamasında", v: `${blogPosts.length - publishedCount}`, icon: PenLine },
            ].map(({ k, v, icon: Icon }) => (
              <div key={k} className="bg-card px-4 py-3.5 text-left">
                <dt className="flex items-center gap-1.5 font-mono text-[0.62rem] tracking-wide text-muted-foreground">
                  <Icon className="size-3 text-primary" /> {k.toUpperCase()}
                </dt>
                <dd className="mt-1 font-heading text-lg font-bold tabular-nums text-foreground">
                  {v}
                </dd>
              </div>
            ))}
          </dl>

          {/* Etap quick-nav */}
          <ul className="mt-8 grid gap-2 sm:grid-cols-2 md:grid-cols-5">
            {groups.map(({ phase, posts }) => {
              const accent = phaseAccent[phase.id] ?? defaultAccent;
              return (
                <li key={phase.id} className="flex">
                  <a
                    href={`#blog-${phase.id}`}
                    className={cn(
                      "flex w-full cursor-pointer flex-col rounded-md border bg-background px-3 py-3 transition-colors hover:bg-secondary/40",
                      accent.border,
                      accent.text,
                    )}
                  >
                    <span className="font-mono text-[0.62rem] tracking-widest">
                      ETAP {String(phase.no).padStart(2, "0")}
                    </span>
                    <span className="mt-1 block font-heading text-sm leading-tight font-semibold text-foreground">
                      {phase.name}
                    </span>
                    <span className="mt-auto pt-2.5 font-mono text-[0.65rem] tabular-nums text-muted-foreground">
                      {posts.length} yazı
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </header>

      {/* ---------- Posts by phase ---------- */}
      <main className="mx-auto max-w-3xl px-4 py-14 md:py-16">
        {groups.map(({ phase, posts }) => {
          if (posts.length === 0) return null;
          const accent = phaseAccent[phase.id] ?? defaultAccent;
          return (
            <section
              key={phase.id}
              id={`blog-${phase.id}`}
              className="scroll-mt-20 pt-12 first:pt-0"
            >
              <div className="flex items-center gap-3 border-b border-border pb-4">
                <span
                  className={cn(
                    "grid size-9 shrink-0 place-items-center rounded-md border font-mono text-sm font-bold",
                    accent.border,
                    accent.bg,
                    accent.text,
                  )}
                >
                  {String(phase.no).padStart(2, "0")}
                </span>
                <div>
                  <p className={cn("font-mono text-[0.65rem] tracking-[0.2em]", accent.text)}>
                    ETAP {String(phase.no).padStart(2, "0")}
                  </p>
                  <h2 className="font-heading text-lg font-bold text-foreground md:text-xl">
                    {phase.name}
                  </h2>
                </div>
              </div>

              <ul className="mt-5 space-y-3">
                {posts.map((post) => {
                  const published = isPublished(post);
                  const step = phase.steps.find((s) => s.id === post.stepId);
                  const photo = stepImages[post.stepId];
                  return (
                    <li key={post.slug}>
                      <Link
                        to="/blog/$slug"
                        params={{ slug: post.slug }}
                        className={cn(
                          "boarding-card group relative flex gap-4 overflow-hidden rounded-lg p-3 transition-colors sm:p-4",
                          published ? "hover:bg-accent" : "opacity-70 hover:bg-accent/60",
                        )}
                      >
                        <span className={cn("absolute inset-y-0 left-0 w-1", accent.fill)} />
                        {photo && (
                          <img
                            src={photo.src}
                            alt={photo.alt}
                            loading="lazy"
                            width={192}
                            height={192}
                            className="size-24 shrink-0 rounded-md object-cover sm:size-28"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            {step && (
                              <span className="font-mono text-[0.66rem] tracking-wide text-muted-foreground">
                                ADIM {String(step.no).padStart(2, "0")} · {step.title}
                              </span>
                            )}
                            {!published && (
                              <span className="rounded-full border border-border px-2 py-0.5 font-mono text-[0.6rem] tracking-wide text-muted-foreground">
                                TASLAK
                              </span>
                            )}
                          </div>
                          <h3 className="mt-0.5 flex items-center gap-2 font-heading text-base font-semibold text-foreground md:text-lg">
                            {post.title}
                            <ArrowRight className="size-4 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
                          </h3>
                          <p className="mt-0.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                            {post.excerpt}
                          </p>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-border bg-secondary/50 px-5 py-5">
          <div>
            <p className="font-heading text-base font-semibold text-foreground">
              Sıradaki adımına dön
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              İlerlemen rotada saklı — kaldığın yerden devam et.
            </p>
          </div>
          <Link
            to="/"
            className="gate-badge inline-flex cursor-pointer items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            <PlaneIcon className="size-4 rotate-90" /> Rotaya dön
          </Link>
        </div>
      </main>
    </div>
  );
}
