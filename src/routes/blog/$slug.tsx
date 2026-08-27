import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { parse } from "marked";
import { ArrowLeft, BookOpen, CalendarDays, MessageCircleHeart, PenLine } from "lucide-react";
import { blogPostBySlug, isPublished } from "@/data/blog-posts";
import { phases } from "@/data/roadmap";
import { stepImages } from "@/data/step-images";
import { SITE_URL, SITE_NAME } from "@/config/site";
import heroFlight from "@/assets/hero-flight.jpg";

const dateFormatter = new Intl.DateTimeFormat("tr-TR", { dateStyle: "long" });

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = blogPostBySlug[params.slug];
    if (!post) throw notFound();
    return post;
  },
  head: ({ loaderData: post }) => {
    if (!post) return {};
    const title = `${post.title} | TR → DE Öğrenci Rotası`;
    const url = `${SITE_URL}/blog/${post.slug}`;
    const image = `${SITE_URL}${stepImages[post.stepId]?.src ?? heroFlight}`;
    const published = isPublished(post);
    return {
      meta: [
        { title },
        { name: "description", content: post.excerpt },
        { name: "keywords", content: post.keywords.join(", ") },
        { name: "robots", content: published ? "index, follow" : "noindex, follow" },
        { property: "og:type", content: "article" },
        { property: "og:site_name", content: SITE_NAME },
        { property: "og:title", content: title },
        { property: "og:description", content: post.excerpt },
        { property: "og:url", content: url },
        { property: "og:image", content: image },
        ...(post.publishedAt
          ? [{ property: "article:published_time", content: post.publishedAt }]
          : []),
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: post.excerpt },
        { name: "twitter:image", content: image },
        ...(published
          ? [
              {
                "script:ld+json": {
                  "@context": "https://schema.org",
                  "@type": "Article",
                  headline: post.title,
                  description: post.excerpt,
                  keywords: post.keywords.join(", "),
                  datePublished: post.publishedAt,
                  inLanguage: "tr",
                  url,
                  image,
                  author: { "@type": "Organization", name: SITE_NAME },
                  publisher: { "@type": "Organization", name: SITE_NAME },
                },
              },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
    };
  },
  component: BlogPostPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="font-heading text-2xl font-bold text-foreground">Yazı bulunamadı</h1>
      <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">
        Tüm yazılara dön
      </Link>
    </div>
  ),
});

function BlogPostPage() {
  const post = Route.useLoaderData();
  const phase = phases.find((p) => p.steps.some((s) => s.id === post.stepId));
  const step = phase?.steps.find((s) => s.id === post.stepId);
  const photo = stepImages[post.stepId];
  const published = isPublished(post);

  return (
    <div className="min-h-screen bg-background">
      {/* ---------- Hero ---------- */}
      <header className="relative h-52 w-full overflow-hidden border-b border-border md:h-72">
        {photo && (
          <img
            src={photo.src}
            alt={photo.alt}
            width={768}
            height={512}
            className="size-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/55 to-card/10" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-2xl px-4 pb-5">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 rounded-md bg-background/85 px-2.5 py-1.5 font-mono text-xs text-foreground backdrop-blur transition-colors hover:bg-background"
            >
              <ArrowLeft className="size-3.5" /> Tüm yazılar
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-2xl px-4 py-10 md:py-16">
        <p className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] text-muted-foreground">
          <BookOpen className="size-3.5" /> REHBER YAZISI
        </p>
        {step && phase && (
          <p className="mt-2 font-mono text-[0.68rem] tracking-[0.2em] text-muted-foreground">
            ETAP {String(phase.no).padStart(2, "0")} · ADIM {String(step.no).padStart(2, "0")} ·{" "}
            {step.title.toUpperCase()}
          </p>
        )}
        <h1 className="mt-3 font-heading text-2xl font-bold text-foreground md:text-3xl">
          {post.title}
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground md:text-base">
          {post.excerpt}
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          {published && post.publishedAt && (
            <span className="inline-flex items-center gap-1.5 font-mono text-[0.72rem] text-muted-foreground">
              <CalendarDays className="size-3" /> {dateFormatter.format(new Date(post.publishedAt))}
            </span>
          )}
          {step && (
            <a
              href={`/#${step.id}`}
              className="font-mono text-[0.72rem] text-primary hover:underline"
            >
              İlgili adıma git →
            </a>
          )}
        </div>

        <div className="mt-10 border-t border-border pt-8">
          {published ? (
            <article
              className="prose-post"
              // Bu içerik yalnızca repo sahibi tarafından src/data/blog-posts.ts içine
              // elle eklenir (kullanıcı gönderimi değildir), bu yüzden HTML'e çevirip
              // doğrudan basmak güvenli kabul edildi.
              dangerouslySetInnerHTML={{ __html: parse(post.content ?? "", { async: false }) }}
            />
          ) : (
            <div className="boarding-card flex items-start gap-3 rounded-lg p-5">
              <PenLine className="mt-0.5 size-4 shrink-0 text-primary" />
              <div>
                <p className="font-heading text-sm font-semibold text-foreground">
                  Bu yazı henüz yazılmadı
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  İçeriği eklemek için{" "}
                  <code className="rounded bg-secondary px-1.5 py-0.5 font-mono text-[0.8rem]">
                    src/data/blog-posts.ts
                  </code>{" "}
                  dosyasında <code className="font-mono text-[0.8rem]">slug: "{post.slug}"</code>{" "}
                  kaydının <code className="font-mono text-[0.8rem]">content</code> alanına Markdown
                  yapıştır ve <code className="font-mono text-[0.8rem]">publishedAt</code> tarihini
                  doldur.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* ---------- Danışman CTA ---------- */}
        <div className="mt-12 flex flex-col gap-4 rounded-lg border border-primary/30 bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md bg-primary/10 text-primary">
              <MessageCircleHeart className="size-4.5" />
            </span>
            <p className="text-sm leading-relaxed text-foreground">
              Baştan sona yapılacakları ücretsiz bir şekilde Almanya'da Okuyorum danışmanıyla web
              sitemiz üzerinden takip et.
            </p>
          </div>
          <Link
            to="/"
            className="gate-badge inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold"
          >
            Rotayı takip et
          </Link>
        </div>
      </div>
    </div>
  );
}
