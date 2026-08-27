# Almanya Yol Haritası

Türkiye'den Almanya'ya üniversite eğitimi için taşınmak isteyen öğrenciler için
interaktif bir yol haritası: 5 etap, 17 adım, her adımda ara kontrol listeleri,
gereken evraklar ve nereden alınacağı, ayrıca tahmini ücretler.

İlerleme tarayıcıda (localStorage) saklanır, tek sayfalık bir uygulamadır.

## Tech stack

- [TanStack Start](https://tanstack.com/start) (React + file-based routing, SSR)
- TypeScript
- Tailwind CSS v4
- Radix UI primitivleri + [shadcn/ui](https://ui.shadcn.com) tabanlı bileşenler
- Cloudflare Workers (deploy hedefi, Nitro üzerinden)

## Geliştirme

Node.js gerekli. Paket yöneticisi olarak [Bun](https://bun.sh) önerilir, npm de çalışır.

```sh
bun install
bun run dev
# veya
npm install
npm run dev
```

Uygulama varsayılan olarak http://localhost:3000 üzerinde açılır.

## Kullanılabilir komutlar

| Komut           | Açıklama                                  |
| --------------- | ------------------------------------------ |
| `dev`           | Geliştirme sunucusunu başlatır              |
| `build`         | Production build alır (Cloudflare hedefi)   |
| `build:dev`     | Development modunda build alır              |
| `preview`       | Production build'i yerelde önizler          |
| `lint`          | ESLint ile kod kontrolü yapar                |
| `format`        | Prettier ile kodu biçimlendirir              |

## Proje yapısı

```
src/
  routes/          TanStack Router route'ları (ör. index.tsx = ana sayfa)
  components/      UI bileşenleri (roadmap-özel + shadcn/ui tabanlılar)
  data/            Rota/adım/ücret/evrak verisi
  hooks/           İlerleme ve yol seçimi state hook'ları
  lib/             Yardımcı fonksiyonlar
  config/          Site geneli sabitler (SEO vb.)
```

## Deploy

Proje Cloudflare Workers'a `wrangler.json` üzerinden deploy edilecek şekilde
yapılandırılmıştır:

```sh
npm run build
npx wrangler deploy
```

## SEO

`src/config/site.ts` içindeki `SITE_URL` sabiti, canonical/OG etiketleri ve
`public/sitemap.xml` ile `public/robots.txt`'teki adresle birlikte, site
gerçek domain'ine taşındığında güncellenmelidir.
