# Blog Yazı Standardı

Bu dosyayı, `src/data/blog-posts.ts` içindeki bir yazının `content` alanını
doldurması için kullandığın AI'a **olduğu gibi** ver. Yazı bu kurallara göre
üretilmeli.

## 1. Kesinlikle kullanma: em dash / kesme çizgisi

Cümle içinde kelimeler arasına **"—" (em dash) veya boşluklu "-" koyma**.
Bu, metnin AI tarafından yazıldığını en çok ele veren işaret.

Yanlış:

> Sperrkonto — Almanya'da okumak isteyen çoğu öğrenci için — zorunlu bir adımdır.

Doğru:

> Sperrkonto, Almanya'da okumak isteyen çoğu öğrenci için zorunlu bir adımdır.

Ara cümleyi virgülle bağla, parantez kullan ya da ayrı bir cümle yap. Kısa
çizgiyi sadece kelime birleştirirken kullan (ör. "Türkiye-Almanya anlaşması"),
asla cümle ögelerini ayırmak için değil.

## 2. Diğer AI işaretlerinden kaçın

- "Sonuç olarak", "Özetle", "Unutmayın ki" gibi kalıp kapanış cümleleri yazma.
- Her paragrafa "Ayrıca", "Bunun yanı sıra", "Öte yandan" ile başlama.
- Soru cümlesiyle giriş yapma (ör. "Almanya'da okumak mı istiyorsun?").
- Üçlü sıralama klişesi kurma (ör. "hızlı, kolay ve güvenilir").
- Abartılı sıfat kullanma (ör. "muhteşem", "inanılmaz", "kesinlikle").
- Ünlem işareti kullanma.
- Yapay "dengeli" ifadeler kurma (ör. "bir yandan ... öte yandan ...").
- Yazıyı "Bu yazıda şunları öğreneceksin" gibi bir meta-girişle açma —
  doğrudan konuya gir.

## 3. Ton ve dil

- Siteyle aynı tonda yaz: doğrudan, ikinci tekil şahıs ("sen"), samimi ama
  bilgilendirici. Resmi/bürokratik bir dil kullanma.
- Kısa, net cümleler kur. Bir cümlede birden fazla fikri virgülle üst üste
  bindirme.
- Somut ol: tarih, ücret, süre, kurum adı ver. "Bazı üniversiteler" yerine
  hangi üniversiteler olduğunu yaz (biliyorsan).
- Değişebilecek bilgide (ücret, süre, mevzuat) "güncel tutarı ilgili kurumun
  sayfasından doğrula" gibi bir uyarı ekle — sitedeki diğer içerikle tutarlı.
- Türkçe karakterleri doğru kullan (ı/i, ş, ğ, ü, ö, ç).

## 4. Yapı

- Başlığı tekrar yazma — sayfa başlığı zaten `blog-posts.ts`'teki `title`
  alanından geliyor. Metin doğrudan gövdeyle başlasın.
- Markdown kullan: alt başlıklar için `##`, gerekirse `###`. `#` (h1) kullanma.
- Uzun paragraf yığma; 3-5 cümlede bir alt başlık veya madde listesine geç.
- Madde listeleri için `-` kullan, numaralı sıra (adım adım bir işlem) için `1.`.
- Kalın (`**metin**`) sadece gerçekten vurgulanması gereken tek tük yerde
  kullanılsın, cümlelerin çoğu kalın olmasın.
- 600-1000 kelime civarı yeterli — konuyu suni şekilde uzatma.

### 4.1. Her soru / alt konu ayrı bir başlık olmalı

Yazı içinde bir soru veya alt konuya geçtiğinde bunu paragrafın içine gömme —
kendi `##` (gerekirse `###`) başlığı olarak yaz. Bu hem Google'ın sayfayı
doğru H1/H2/H3 hiyerarşisiyle okumasını sağlar hem de okuyucunun aradığı
cevaba (arama sonucu snippet'i veya sayfa içi tarama ile) doğrudan
ulaşmasını sağlar.

Yanlış (soru paragrafın içinde eriyor):

> ...bu yüzden önce denkliğini netleştirmen gerekir. Anabin nedir ve ne işe
> yarar? Anabin, Alman Eğitim Bakanları Konferansı'nın hazırladığı resmi
> denklik portalıdır...

Doğru:

```
## Anabin nedir ve ne işe yarar?

Anabin, Alman Eğitim Bakanları Konferansı'nın hazırladığı resmi denklik
portalıdır...
```

Aynı şekilde adım adım anlatılan bir süreç (ör. "şu sayfaya git, şu sekmeye
tıkla, şunu seç") ayrı paragraflara bölünmüş cümleler olarak değil, numaralı
liste (`1.`, `2.`, `3.`) olarak yazılmalı — bkz.
`src/data/blog-posts.ts` içindeki `lise-diplomasi-almanya-denklik-h-plus-h-eksi`
kaydı, doğru yapının örneğidir.

## 5. SEO

- Yazının birincil anahtar kelimesi (bkz. `blog-posts.ts`'teki `keywords`
  alanı) ilk paragrafta doğal şekilde geçsin — zorla sıkıştırma.
- Alt başlıklarda arama niyetine karşılık gelen ifadeler kullan (ör.
  "Sperrkonto ücreti ne kadar?" gibi soru başlıkları iyi çalışır).
- Aynı anahtar kelimeyi art arda tekrarlama (keyword stuffing yapma).

## 6. Ne YAPMA

- Kaynağını doğrulamadığın rakam/tarih uydurma.
- Rakip/sağlayıcı karşılaştırmalarında (ör. Sperrkonto sağlayıcıları) taraflı
  reklam dili kullanma — objektif kalsın.
- İçeriği İngilizce terimlerle doldurup çevirisini vermeden bırakma (Almanca
  terimler hariç — onlar zaten sitenin genelinde orijinal haliyle geçiyor).

## Teslim formatı

`content: "..."` şeklinde TypeScript
string'e sarılmış halde ver, düz Markdown. Bunu `blog-posts.ts`'teki ilgili
kaydın ben yapıştıracağım.
