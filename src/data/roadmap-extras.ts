/**
 * Adım bazlı tahmini maliyetler ve gereken evraklar (nereden / nasıl alınır).
 * Tutarlar 2025/26 dönemi referans alınarak TAHMİNÎdir; resmî kaynakla doğrulanmalı.
 */

export type CostItem = { label: string; amount: string; note?: string };
export type DocItem = { name: string; how: string };

export const stepCosts: Record<string, CostItem[]> = {
  s1: [
    { label: "Denklik testi (sitede)", amount: "0 €" },
    { label: "İsteğe bağlı danışmanlık", amount: "0 – 300 €", note: "Zorunlu değil" },
  ],
  s2: [
    {
      label: "Almanca kurs (A1 → C1)",
      amount: "800 – 2.500 €",
      note: "Kurum ve tempoya göre; Türkiye'de tamamlarsan Almanya'dakinden belirgin ucuzdur",
    },
    { label: "Goethe / telc / TestDaF sınavı", amount: "200 – 320 €", note: "Seviye başına" },
    { label: "IELTS / TOEFL (İngilizce bölüm)", amount: "230 – 280 €" },
  ],
  s3: [{ label: "Araştırma ve liste kurma", amount: "0 €" }],
  s4: [
    { label: "Yeminli tercüme", amount: "10 – 25 € / sayfa", note: "Diploma + transkript ≈ 5-8 sayfa" },
    { label: "Noter onayı", amount: "15 – 30 € / belge" },
    { label: "Apostil (kaymakamlık)", amount: "0 – 10 €" },
    { label: "Pasaport (10 yıl)", amount: "≈ 90 – 120 €" },
  ],
  s5: [
    { label: "uni-assist ilk başvuru", amount: "75 €" },
    { label: "Her ek başvuru", amount: "30 €" },
    { label: "VPD (Vorprüfungsdokumentation)", amount: "75 €" },
    { label: "Kargo / posta", amount: "20 – 60 €" },
  ],
  s6: [{ label: "Kabul mektubu", amount: "0 €", note: "Üniversite ücret almaz" }],
  s7: [
    { label: "Bloke hesap yıllık tutar", amount: "≈ 11.904 €", note: "992 €/ay × 12 (güncel tutarı doğrula)" },
    { label: "Bloke hesap açılış ücreti", amount: "49 – 150 €" },
    { label: "Aylık hesap işletim ücreti", amount: "0 – 5 € / ay" },
  ],
  s8: [
    { label: "Seyahat sağlık sigortası (vize için)", amount: "30 – 80 €" },
    { label: "Öğrenci sağlık sigortası", amount: "≈ 120 – 145 € / ay", note: "TK, AOK, Barmer vb." },
  ],
  s9: [
    { label: "Ulusal vize harcı (Typ D)", amount: "75 €" },
    { label: "Aracı kurum hizmet bedeli", amount: "25 – 45 €" },
    { label: "Biyometrik fotoğraf", amount: "5 – 15 €" },
  ],
  s10: [
    { label: "Uçak bileti (tek yön)", amount: "120 – 350 €" },
    { label: "Ek bagaj", amount: "40 – 120 €" },
  ],
  s11: [
    { label: "Yurt kirası (Studierendenwerk)", amount: "250 – 450 € / ay" },
    { label: "WG / paylaşımlı oda", amount: "350 – 700 € / ay" },
    { label: "Depozito (Kaution)", amount: "2 – 3 kira bedeli" },
    { label: "Geçici konaklama (ilk 4 hafta)", amount: "400 – 1.200 €" },
  ],
  s12: [
    { label: "Havalimanı → şehir ulaşımı", amount: "10 – 40 €" },
    { label: "SIM / eSIM", amount: "10 – 25 € / ay" },
  ],
  s13: [{ label: "Anmeldung", amount: "0 €", note: "Bazı şehirlerde 0 – 15 €" }],
  s14: [{ label: "Öğrenci Girokonto", amount: "0 €", note: "Öğrenciye ücretsiz seçenekler var" }],
  s15: [
    { label: "Semesterbeitrag (dönem harcı)", amount: "150 – 400 € / dönem", note: "Semesterticket dahil" },
  ],
  s16: [
    { label: "Rundfunkbeitrag (yayın harcı)", amount: "18,36 € / ay", note: "Hane başına, WG'de paylaşılır" },
  ],
  s17: [
    { label: "Oturum izni (eAT) harcı", amount: "100 – 110 €" },
    { label: "Biyometrik fotoğraf", amount: "10 – 15 €" },
  ],
};

function parseAmountRange(amount: string): [number, number] | null {
  if (!amount.includes("€")) return null;
  const matches = amount.match(/[\d.,]+/g);
  if (!matches) return null;
  const nums = matches
    .map((m) => parseFloat(m.replace(/\./g, "").replace(",", ".")))
    .filter((n) => !Number.isNaN(n));
  if (nums.length === 0) return null;
  return [Math.min(...nums), Math.max(...nums)];
}

const eur = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 0 });

export const totalEstimatedCost = Object.values(stepCosts)
  .flat()
  .reduce(
    (acc, c) => {
      const range = parseAmountRange(c.amount);
      if (!range) return acc;
      return { min: acc.min + range[0], max: acc.max + range[1] };
    },
    { min: 0, max: 0 },
  );

export const totalEstimatedCostLabel = `${eur.format(totalEstimatedCost.min)} – ${eur.format(totalEstimatedCost.max)} €`;

export type SavingTip = { title: string; text: string };

export const costSavingTips: SavingTip[] = [
  {
    title: "Almancayı Türkiye'de öğren",
    text: "Goethe-Institut / DAI şubeleri veya online kurslarla B1–C1 seviyesini Türkiye'de tamamlamak, Almanya'daki kurs ücretlerinden (800–2.500 €) büyük ölçüde tasarruf sağlar; sınavı da Türkiye merkezinde gir.",
  },
  {
    title: "Devlet üniversitesi seç",
    text: "Almanya'daki devlet üniversitelerinde okul harcı yok — sadece dönemlik Semesterbeitrag (150–400 €) ödenir; özel üniversitelere göre çok daha ucuz.",
  },
  {
    title: "Yurtta kal",
    text: "Studierendenwerk yurdu, WG'ye göre aylık 100–250 € daha ucuzdur; başvuruyu erken yap, sıra uzun sürebilir.",
  },
  {
    title: "Bursa başvur",
    text: "DAAD veya vakıf bursu alırsan bloke hesaba (≈11.900 €/yıl) gerek kalmayabilir; başvuruları erken planla.",
  },
  {
    title: "Rundfunkbeitrag'ı paylaş",
    text: "WG'de yaşıyorsan aylık yayın harcını (18,36 €) hane arkadaşlarınla paylaş, tek başına ödeme.",
  },
];

export const stepDocs: Record<string, DocItem[]> = {
  s1: [
    { name: "Lise diploması", how: "Mezun olduğun liseden aslı; kayıp ise il/ilçe MEM'den ikinci nüsha." },
    { name: "YKS sonuç + yerleştirme belgesi", how: "ÖSYM AİS (ais.osym.gov.tr) → barkodlu PDF olarak indir." },
    {
      name: "Denklik yol testi sonucu",
      how: "Adım kartındaki 'Yol testi' sekmesinden birkaç soruyu yanıtla; sonucu ekran görüntüsü alıp sakla. Gerekirse anabin.kmk.org yedek kaynak olarak kullanılabilir.",
    },
  ],
  s2: [
    { name: "Dil sertifikası", how: "Goethe-Institut / telc merkezi / TestDaF merkezinde sınava gir; sertifika 2-6 hafta içinde teslim edilir." },
    { name: "Kurs katılım belgesi", how: "Dil okulundan seviye bitiminde talep et (bazı üniversiteler ek kanıt olarak kabul eder)." },
  ],
  s3: [
    { name: "Bölüm şart listesi (Zulassungsvoraussetzungen)", how: "Üniversitenin bölüm sayfasından PDF olarak indir, tarih notu düş." },
  ],
  s4: [
    { name: "Transkript (9-12. sınıf)", how: "Liseden ıslak imzalı ve mühürlü olarak al." },
    { name: "Yeminli tercümeler", how: "Noter onaylı yeminli tercümana ver; Almanca (veya İngilizce) çeviri + tercüman kaşesi." },
    { name: "Apostil", how: "Noter onayından sonra kaymakamlık (idari belgeler) veya adliye (adli belgeler) apostil şerhi verir." },
    { name: "Pasaport", how: "Randevu: randevu.nvi.gov.tr → nüfus müdürlüğü; en az 1,5 yıl geçerli olmalı." },
    { name: "Europass CV + motivasyon mektubu", how: "europa.eu/europass üzerinden oluştur; motivasyon mektubunu her bölüme özel yaz." },
    { name: "Biyometrik fotoğraf", how: "35×45 mm, beyaz fon, son 6 ay içinde çekilmiş." },
  ],
  s5: [
    { name: "uni-assist başvuru dosyası", how: "my.uni-assist.de hesabı aç, taranmış evrakları yükle, ücreti kartla öde." },
    { name: "VPD", how: "uni-assist üzerinden ayrı başvuru; sonuç PDF olarak hesabına düşer." },
    { name: "Ödeme makbuzları", how: "uni-assist ve üniversite portalındaki ödeme onaylarını PDF arşivine ekle." },
  ],
  s6: [
    { name: "Zulassungsbescheid (kabul mektubu)", how: "Üniversite portalından indir; vize dosyası için çıktısı gerekir." },
    { name: "Şart listesi (bedingte Zulassung)", how: "Kabul mektubundaki koşulları madde madde çıkar ve takvime ekle." },
  ],
  s7: [
    { name: "Sperrkonto (bloke hesap) onay yazısı", how: "Coracle / Expatrio / Fintiba / Deutsche Bank üzerinden hesap aç, parayı SWIFT ile transfer et, onay yazısı e-posta ile gelir." },
    { name: "Alternatif: Verpflichtungserklärung", how: "Almanya'daki garantör, kendi Ausländerbehörde'sinden taahhüt belgesi alır." },
    { name: "Burs belgesi", how: "DAAD / vakıf / kurum yazısı: süre ve aylık tutar açıkça yazılı olmalı." },
  ],
  s8: [
    { name: "Seyahat sağlık sigortası poliçesi", how: "Türkiye'deki sigorta şirketinden Schengen/ulusal vize uyumlu poliçe; teminat en az 30.000 €." },
    { name: "Öğrenci sağlık sigortası onayı", how: "TK / AOK / Barmer online başvurusu; kabul mektubu ve pasaport yüklenir." },
    { name: "M10 sigorta bildirimi", how: "Sigorta şirketinden üniversiteye elektronik olarak gönderilmesini talep et." },
  ],
  s9: [
    { name: "Vize başvuru formu (VIDEX)", how: "videx-national.diplo.de üzerinden doldur, çıktı al ve imzala." },
    { name: "Randevu onayı", how: "Konsolosluk aracı kurumu (iDATA vb.) üzerinden randevu al, onay e-postasını yazdır." },
    { name: "Evrak seti (2-3 takım)", how: "Kabul, finans kanıtı, sigorta, diploma, transkript, dil belgesi, pasaport fotokopileri." },
  ],
  s10: [
    { name: "Vizeli pasaport", how: "Aracı kurumdan teslim al; süre, giriş sayısı ve çalışma notunu kontrol et." },
    { name: "Uçuş bileti", how: "Kayıt tarihinden en az 2 hafta önce varacak şekilde al." },
  ],
  s11: [
    { name: "Kira sözleşmesi (Mietvertrag)", how: "Yurt veya ev sahibi tarafından imzalanır; PDF kopyasını sakla." },
    { name: "Wohnungsgeberbestätigung", how: "Ev sahibinden/yurt yönetiminden taşındıktan sonra talep et — Anmeldung için zorunlu." },
    { name: "Depozito transfer kanıtı", how: "Banka havale dekontunu sakla; çıkışta geri alım için gerekir." },
  ],
  s12: [
    { name: "Orijinal evrak dosyası", how: "Tüm asıllar el bagajında; kopyalar buluta yüklü olsun." },
    { name: "Ev devir tutanağı (Übergabeprotokoll)", how: "Anahtar teslimi sırasında ev sahibiyle birlikte doldurup imzala." },
  ],
  s13: [
    { name: "Anmeldeformular", how: "Şehrin Bürgeramt sitesinden indir, doldur." },
    { name: "Wohnungsgeberbestätigung", how: "Ev sahibinin imzaladığı belge; onsuz kayıt yapılmaz." },
    { name: "Anmeldebestätigung", how: "Randevu sonunda elden verilir — banka, sigorta ve oturum için asıl belge." },
  ],
  s14: [
    { name: "Girokonto başvurusu", how: "N26 / Commerzbank / Sparkasse; Anmeldebestätigung + pasaport + öğrenci belgesi." },
    { name: "Kimlik doğrulama", how: "Video-Ident (online) veya Post-Ident (postanede) ile tamamlanır." },
  ],
  s15: [
    { name: "Immatrikulation başvuru formu", how: "Üniversite portalından indir, imzala, kayıt ofisine teslim et." },
    { name: "Semesterbeitrag dekontu", how: "Üniversitenin IBAN'ına havale; açıklamaya matrikül/başvuru numarasını yaz." },
    { name: "Immatrikulationsbescheinigung", how: "Kayıt sonrası portaldan indir — oturum izni ve indirimler için gerekli." },
  ],
  s16: [
    { name: "Steuer-ID mektubu", how: "Anmeldung'dan 2-6 hafta sonra posta ile adresine gelir; gelmezse Finanzamt'tan talep et." },
    { name: "Rundfunkbeitrag kaydı", how: "rundfunkbeitrag.de üzerinden kayıt ol veya WG'deki mevcut kayda ekle." },
  ],
  s17: [
    { name: "Aufenthaltstitel başvuru formu", how: "Ausländerbehörde sitesinden indir veya randevuda verilir." },
    { name: "Finans kanıtı (güncel)", how: "Bloke hesap bakiye yazısı veya garantör belgesi — son 1 ay içinde alınmış." },
    { name: "Öğrenci belgesi + sigorta yazısı", how: "Üniversite portalından ve sigorta şirketinden güncel tarihli al." },
    { name: "Fiktionsbescheinigung", how: "Randevu vize bitiminden sonraya kaldıysa Ausländerbehörde'den talep et." },
  ],
};
