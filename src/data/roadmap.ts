export type Task = { id: string; label: string; hint?: string };

export type Step = {
  id: string;
  no: number;
  title: string;
  subtitle: string;
  duration: string;
  tasks: Task[];
  warning?: string;
};

export type Phase = {
  id: string;
  no: number;
  name: string;
  motto: string;
  steps: Step[];
};

export const phases: Phase[] = [
  {
    id: "faz1",
    no: 1,
    name: "Ön Hazırlık ve Uygunluk",
    motto: "Check-in öncesi: uygunluğunu netleştir",
    steps: [
      {
        id: "s1",
        no: 1,
        title: "Denklik Tespiti",
        subtitle:
          "Lise diploman ve YKS sonucun doğrudan lisans kabulüne mi, yoksa hazırlık kolejine (Studienkolleg) mi uygun?",
        duration: "1–3 hafta",
        tasks: [
          {
            id: "s1t1",
            label: "Denklik yolunu (doğrudan lisans / Studienkolleg) sitedeki yol testiyle belirle",
          },
          {
            id: "s1t2",
            label: "YKS yerleştirme sonucunu ve puan türünü not al",
            hint: "Çoğu üniversite, seçtiğin bölümle aynı alanda YKS yerleşimi bekler.",
          },
          {
            id: "s1t3",
            label: "Doğrudan lisans / Studienkolleg / 1 yıl üniversite okuma şartını netleştir",
          },
          { id: "s1t4", label: "Gerekliyse Studienkolleg kur tipini belirle (T, M, W, G, S)" },
          {
            id: "s1t5",
            label:
              "Not ortalamanı sitedeki not çeviriciyle Alman sistemine çevir (Bavyera formülü)",
          },
        ],
        warning:
          "Denklik durumu yanlış okunursa tüm başvuru takvimin kayar. Bu adımı asla tahminle geçme.",
      },
      {
        id: "s2",
        no: 2,
        title: "Dil Yeterliliğinin Sağlanması",
        subtitle:
          "Eğitim diline göre gerekli sertifikayı al: Goethe / TestDaF / DSH ya da IELTS / TOEFL.",
        duration: "3–12 ay",
        tasks: [
          { id: "s2t1", label: "Bölümün eğitim dilini belirle (Almanca / İngilizce / karma)" },
          {
            id: "s2t2",
            label: "Almanca için hedef seviyeyi seç: B1–B2 (Studienkolleg) veya C1 (lisans)",
          },
          { id: "s2t3", label: "Sınav tarihini erken rezerve et (kontenjanlar hızlı doluyor)" },
          { id: "s2t4", label: "İngilizce bölüm için IELTS 6.0–6.5 / TOEFL 80+ hedefle" },
          { id: "s2t5", label: "Sertifikanın geçerlilik süresini kontrol et (genelde 2 yıl)" },
        ],
      },
      {
        id: "s3",
        no: 3,
        title: "Bölüm ve Üniversite Tespiti",
        subtitle: "Başvuru şartları, NC (not ortalaması barajı) ve son başvuru tarihlerini incele.",
        duration: "2–4 hafta",
        tasks: [
          {
            id: "s3t1",
            label: "10–15 üniversiteden oluşan bir liste kur (garanti / hedef / iddialı)",
          },
          { id: "s3t2", label: "Her bölüm için NC değerini ve geçen yılın barajını yaz" },
          { id: "s3t3", label: "Başvuru dönemini seç: Kış (15 Temmuz) / Yaz (15 Ocak)" },
          { id: "s3t4", label: "Başvurunun uni-assist mi, doğrudan portal mı olduğunu işaretle" },
          { id: "s3t5", label: "Şehir yaşam maliyeti ve yurt durumunu karşılaştır" },
        ],
      },
    ],
  },
  {
    id: "faz2",
    no: 2,
    name: "Evrak ve Başvuru",
    motto: "Bagaj hazırlığı: evraklar ve başvurular",
    steps: [
      {
        id: "s4",
        no: 4,
        title: "Evrakların Hazırlanması",
        subtitle:
          "Transkript, diploma, yerleştirme belgesi, Europass CV ve motivasyon mektubu; yeminli tercüme + noter/apostil onayları.",
        duration: "3–6 hafta",
        tasks: [
          { id: "s4t1", label: "Lise diploması ve 9–12. sınıf transkriptini okuldan al" },
          { id: "s4t2", label: "ÖSYM yerleştirme belgesini (YKS sonuç + yerleşme) indir" },
          { id: "s4t3", label: "Yeminli tercüman ile Almanca/İngilizce tercümeleri yaptır" },
          { id: "s4t4", label: "Noter onayı + kaymakamlıktan apostil aldır" },
          { id: "s4t5", label: "Europass formatında CV hazırla" },
          { id: "s4t6", label: "Bölüme özel motivasyon mektubu (Motivationsschreiben) yaz" },
          { id: "s4t7", label: "Pasaport çıkart / geçerlilik süresini kontrol et (en az 1,5 yıl)" },
          { id: "s4t8", label: "Tüm evrakların taranmış PDF arşivini oluştur" },
        ],
        warning: "Tercüme + apostil zinciri eksik olan evrak, başvuruda hiç yok sayılır.",
      },
      {
        id: "s5",
        no: 5,
        title: "Üniversite Başvurusu",
        subtitle:
          "Üniversitenin sistemine göre uni-assist, VPD veya doğrudan üniversite portalı üzerinden başvurunu ilet.",
        duration: "4–8 hafta",
        tasks: [
          { id: "s5t1", label: "uni-assist hesabı aç ve evrakları yükle" },
          { id: "s5t2", label: "Gerekiyorsa VPD (Vorprüfungsdokumentation) talep et" },
          { id: "s5t3", label: "Başvuru ücretlerini öde (ilk başvuru + ek başvurular)" },
          { id: "s5t4", label: "Fiziksel evrak isteyen üniversitelere posta gönder" },
          { id: "s5t5", label: "Her başvurunun durumunu tablo halinde takip et" },
        ],
      },
      {
        id: "s6",
        no: 6,
        title: "Kabul Mektubu (Zulassung)",
        subtitle: "Üniversiteden resmî şartlı/şartsız kabul belgesini al.",
        duration: "4–10 hafta",
        tasks: [
          { id: "s6t1", label: "Zulassungsbescheid PDF'ini indir ve yedekle" },
          { id: "s6t2", label: "Şartlı kabul ise (bedingte Zulassung) şartları listele" },
          { id: "s6t3", label: "Kabulü onaylama / yer teyidi son tarihini takvimine ekle" },
          { id: "s6t4", label: "Reddedilen başvurular için yedek planı devreye al" },
        ],
      },
    ],
  },
  {
    id: "faz3",
    no: 3,
    name: "Finans, Sigorta ve Vize",
    motto: "Bilet ve pasaport: finans, sigorta, vize",
    steps: [
      {
        id: "s7",
        no: 7,
        title: "Finansmanın Hazırlanması",
        subtitle:
          "Yıllık yasal tutar için Bloke Hesap (Sperrkonto) aç veya resmî garantör belgesi temin et.",
        duration: "2–5 hafta",
        tasks: [
          { id: "s7t1", label: "Güncel yıllık yasal tutarı konsolosluk sayfasından doğrula" },
          { id: "s7t2", label: "Bloke hesap sağlayıcısı seç ve hesabı aç" },
          { id: "s7t3", label: "Parayı transfer et ve bloke onay yazısını al" },
          {
            id: "s7t4",
            label: "Alternatif: garantör (Verpflichtungserklärung) veya burs belgesi hazırla",
          },
        ],
      },
      {
        id: "s8",
        no: 8,
        title: "Sağlık Sigortası",
        subtitle:
          "Vize için seyahat sigortası, kayıt için yasal öğrenci sağlık sigortası (Krankenversicherung).",
        duration: "1 hafta",
        tasks: [
          { id: "s8t1", label: "Vize dosyası için seyahat sağlık sigortası yaptır" },
          { id: "s8t2", label: "Yasal sigorta (TK, AOK, Barmer vb.) başvurusunu başlat" },
          { id: "s8t3", label: "Üniversiteye gidecek sigorta bildirimini (M10) talep et" },
        ],
      },
      {
        id: "s9",
        no: 9,
        title: "Vize Başvurusu",
        subtitle:
          "Konsolosluk aracı kurumu üzerinden Ulusal Vize (Typ D) randevusu al ve evrakları teslim et.",
        duration: "6–12 hafta",
        tasks: [
          { id: "s9t1", label: "Randevu aç — kabul gelmeden önce takip etmeye başla" },
          { id: "s9t2", label: "Vize başvuru formunu doldur ve imzala" },
          { id: "s9t3", label: "Biyometrik fotoğraf çektir" },
          { id: "s9t4", label: "Evrak setini 2–3 takım halinde çoğalt" },
          { id: "s9t5", label: "Randevuya git, parmak izi ver, harcı öde" },
        ],
        warning: "Vize randevusu en dar boğaz. Kabul mektubunu beklerken randevu takibine başla.",
      },
      {
        id: "s10",
        no: 10,
        title: "Vize Onayı",
        subtitle: "Pasaportunu vizeli şekilde teslim al ve seyahati planla.",
        duration: "1–2 hafta",
        tasks: [
          { id: "s10t1", label: "Vizedeki tarih, süre ve çalışma iznini kontrol et" },
          { id: "s10t2", label: "Uçuş biletini al (kayıt tarihinden en az 2 hafta önce)" },
          { id: "s10t3", label: "İlk 2 haftanın bütçesini ve nakit planını yap" },
        ],
      },
    ],
  },
  {
    id: "faz4",
    no: 4,
    name: "Konaklama ve Varış",
    motto: "Kalkış ve iniş: ev ve seyahat",
    steps: [
      {
        id: "s11",
        no: 11,
        title: "Konaklama Bulma",
        subtitle:
          "Öğrenci yurdu (Studierendenwerk), paylaşımlı ev (WG) veya geçici konaklama ayarla.",
        duration: "1–6 ay",
        tasks: [
          { id: "s11t1", label: "Studierendenwerk yurt başvurusunu hemen yap (sıra uzun)" },
          { id: "s11t2", label: "WG-Gesucht / Immobilienscout profili oluştur" },
          { id: "s11t3", label: "İlk 4–6 hafta için geçici konaklama rezerve et" },
          { id: "s11t4", label: "Depozito (Kaution) için 2–3 kira bedeli ayır" },
          { id: "s11t5", label: "Dolandırıcılık kontrolü: görmeden para gönderme" },
        ],
        warning: "Ev bulmadan uçmak riskli — mutlaka geçici bir adresi garantiye al.",
      },
      {
        id: "s12",
        no: 12,
        title: "Almanya'ya Seyahat",
        subtitle: "Uçuş ve konaklama yerine yerleşme.",
        duration: "1 gün",
        tasks: [
          { id: "s12t1", label: "Tüm orijinal evrakları el bagajında taşı" },
          { id: "s12t2", label: "Havalimanı–şehir ulaşımını önceden planla" },
          { id: "s12t3", label: "Alman SIM kart / eSIM al" },
          { id: "s12t4", label: "Anahtar teslimi ve ev devir tutanağını tamamla" },
        ],
      },
    ],
  },
  {
    id: "faz5",
    no: 5,
    name: "Almanya İçi Bürokrasi",
    motto: "Pasaport kontrolü: Almanya'daki kayıtlar",
    steps: [
      {
        id: "s13",
        no: 13,
        title: "İkamet Kaydı (Anmeldung)",
        subtitle:
          "Ev sahibinden alınan Wohnungsgeberbestätigung ile yerel belediyeye adres kaydını yap.",
        duration: "İlk 14 gün",
        tasks: [
          { id: "s13t1", label: "Ev sahibinden Wohnungsgeberbestätigung al" },
          { id: "s13t2", label: "Bürgeramt / Einwohnermeldeamt randevusu al" },
          { id: "s13t3", label: "Anmeldebestätigung belgesini teslim al ve sakla" },
        ],
        warning: "Anmeldung olmadan banka, sigorta ve oturum işlemlerinin hiçbiri ilerlemez.",
      },
      {
        id: "s14",
        no: 14,
        title: "Banka Hesabı",
        subtitle: "Bloke hesaptaki aylık paranın aktarılması için yerel cari hesap (Girokonto) aç.",
        duration: "1–2 hafta",
        tasks: [
          { id: "s14t1", label: "Ücretsiz öğrenci Girokonto seç" },
          { id: "s14t2", label: "Kimlik doğrulamasını tamamla (Video/Post-Ident)" },
          { id: "s14t3", label: "IBAN'ı bloke hesap sağlayıcısına bildir" },
          { id: "s14t4", label: "İlk aylık ödemenin geldiğini doğrula" },
        ],
      },
      {
        id: "s15",
        no: 15,
        title: "Üniversite Kaydı (Immatrikulation)",
        subtitle:
          "Dönem harcını (Semesterbeitrag) öde, sigorta bildirimini ilet, resmî öğrenci kaydını tamamla.",
        duration: "1–2 hafta",
        tasks: [
          { id: "s15t1", label: "Semesterbeitrag ödemesini yap" },
          {
            id: "s15t2",
            label: "Sigorta şirketinden üniversiteye elektronik bildirim gönderilsin",
          },
          { id: "s15t3", label: "Kayıt evraklarını (pasaport, vize, kabul) teslim et" },
          { id: "s15t4", label: "Öğrenci kartı + Semesterticket ve üniversite e-postasını al" },
          { id: "s15t5", label: "Immatrikulationsbescheinigung belgesini indir" },
        ],
      },
      {
        id: "s16",
        no: 16,
        title: "Vergi ve TV Vergisi İşlemleri",
        subtitle:
          "Eve posta ile gelen Vergi Numarası (Steuer-ID) ve yayın harcı (Rundfunkbeitrag / GEZ) bildirimlerini tamamla.",
        duration: "2–6 hafta",
        tasks: [
          { id: "s16t1", label: "Steuer-ID mektubunu bekle ve numarayı kaydet" },
          { id: "s16t2", label: "Rundfunkbeitrag kaydını yap veya WG'de mevcut kayda bağlan" },
          { id: "s16t3", label: "Posta kutunda isminin yazılı olduğundan emin ol" },
        ],
      },
      {
        id: "s17",
        no: 17,
        title: "Oturum İzni (Aufenthaltstitel)",
        subtitle:
          "Giriş vizesinin süresi bitmeden Yabancılar Dairesi'nden (Ausländerbehörde) eğitim amaçlı oturum kartını al.",
        duration: "4–10 hafta",
        tasks: [
          { id: "s17t1", label: "Vize bitiminden en az 6 hafta önce randevu al" },
          {
            id: "s17t2",
            label: "Dosyayı hazırla: Anmeldung, sigorta, finans kanıtı, öğrenci belgesi",
          },
          { id: "s17t3", label: "Biyometrik fotoğraf + harç ödemesi" },
          { id: "s17t4", label: "Elektronik oturum kartını (eAT) teslim al" },
          { id: "s17t5", label: "Çalışma izni notunu kontrol et (yılda 140 tam gün)" },
        ],
        warning: "Randevu gecikirse Fiktionsbescheinigung talep et — yasal boşlukta kalma.",
      },
    ],
  },
];

export const allTaskIds = phases.flatMap((p) => p.steps.flatMap((s) => s.tasks.map((t) => t.id)));
export const allSteps = phases.flatMap((p) => p.steps);
