/**
 * Adım bazlı karar ağaçları ("yol testi"): kullanıcı birkaç tıkla kendi
 * durumuna uyan yolu (denklik, dil, kabul şartı, finansman) sitede görür.
 * Sonuçlar TAHMİNÎdir; resmî kaynakla doğrulanmalı.
 */

/** Hangi görev (task) satırına yol testi tetikleyicisi eklenecek. */
export const pathTaskId: Record<string, string> = {
  s1: "s1t1",
  s2: "s2t2",
  s6: "s6t2",
  s7: "s7t4",
  s11: "s11t1",
  s15: "s15t1",
};

/** Not çevirici aracının bağlı olduğu görev satırı. */
export const gradeConverterTaskId = "s1t5";

export type PathResult = {
  title: string;
  text: string;
  /** Task ids elsewhere in the roadmap that this outcome makes unnecessary. */
  notApplicable?: string[];
  /**
   * Semantic key the cost calculator switches on — kept separate from
   * `title` so rewording a result's copy never silently breaks the
   * personalized "Toplam Tahmini Ücret" math in roadmap-extras.ts.
   */
  costTag?: string;
};
export type PathOption = { label: string; next?: PathQuestion; result?: PathResult };
export type PathQuestion = { question: string; options: PathOption[] };

export const stepPaths: Record<string, PathQuestion> = {
  s1: {
    question: "Lise diploman hangi tür okuldan?",
    options: [
      {
        label: "Genel / Fen / Anadolu Lisesi",
        next: {
          question: "YKS yerleştirme sonucun, başvuracağın bölümle aynı alanda mı?",
          options: [
            {
              label: "Evet, aynı alanda yerleştim",
              result: {
                title: "Muhtemelen doğrudan lisans başvurusu (H+)",
                text: "Denkliğin muhtemelen doğrudan kabul için yeterli. Studienkolleg gerekmeden başvuru evraklarına geçebilirsin; yine de üniversitenin kendi şartını kontrol et.",
                notApplicable: ["s1t4"],
              },
            },
            {
              label: "Yerleştim ama alan farklı",
              result: {
                title: "Muhtemelen Studienkolleg gerekiyor",
                text: "Alan uyuşmazlığı çoğu üniversitede Studienkolleg (hazırlık koleji) şartı doğurur. Dil seviyeni B1–B2'ye taşıyıp Feststellungsprüfung'a hazırlanmayı planla.",
              },
            },
            {
              label: "Yerleşmedim",
              result: {
                title: "Ek şart / 1 yıl üniversite gerekebilir",
                text: "YKS yerleştirmesi olmadan doğrudan başvuru genelde mümkün değil. Ya bir yıl Türkiye'de örgün üniversite okuman ya da Studienkolleg yolu değerlendirilir.",
              },
            },
          ],
        },
      },
      {
        label: "Meslek Lisesi",
        result: {
          title: "Muhtemelen Studienkolleg gerekiyor",
          text: "Meslek lisesi diplomaları çoğunlukla doğrudan denk sayılmaz. Studienkolleg + Feststellungsprüfung yolunu planla; bazı bölümlerde ayrıca staj/meslek deneyimi şartı da olabilir.",
        },
      },
      {
        label: "Açık Öğretim Lisesi",
        result: {
          title: "Ek şart / 1 yıl üniversite gerekebilir",
          text: "Açık öğretim diploması için üniversiteler ek şart isteyebilir. Bir yıl örgün üniversite okuma veya Studienkolleg şartı sık görülür — hedef bölümün sayfasını mutlaka kontrol et.",
        },
      },
    ],
  },

  s2: {
    question: "Bölümün eğitim dili ne?",
    options: [
      {
        label: "Almanca",
        next: {
          question: "Almanca seviyen şu an ne?",
          options: [
            {
              label: "C1 ve üzeri (sertifikalı)",
              result: {
                title: "Dil şartını karşılıyorsun",
                text: "Doğrudan lisans başvurusu için dil şartın hazır. TestDaF / DSH / Goethe C1 sınavına girip sertifikanı başvuru dosyana ekle.",
                notApplicable: ["s2t4"],
                costTag: "lang-certified",
              },
            },
            {
              label: "B1–B2",
              result: {
                title: "Studienkolleg seviyesindesin",
                text: "Mevcut seviyen Studienkolleg için uygun olabilir. Lisans için C1'e çıkacak yoğun bir kurs planı (ortalama 3–6 ay) hesaba kat.",
                costTag: "lang-course",
              },
            },
            {
              label: "A2 ve altı",
              result: {
                title: "Önce B1'e çıkman gerekiyor",
                text: "A2 altı seviyeyle ne doğrudan lisans ne de Studienkolleg başvurusu mümkün. Ortalama 6–12 ay yoğun kurs süresiyle planla.",
                costTag: "lang-course",
              },
            },
          ],
        },
      },
      {
        label: "İngilizce",
        result: {
          title: "IELTS / TOEFL hedefle",
          text: "İngilizce bölümler için genelde IELTS 6.0–6.5 veya TOEFL 80+ istenir. Sınav tarihini erken rezerve et, sertifika geçerlilik süresi genelde 2 yıldır.",
          notApplicable: ["s2t2"],
          costTag: "lang-english",
        },
      },
      {
        label: "Karma (Almanca + İngilizce)",
        result: {
          title: "Her iki dil şartını da netleştir",
          text: "Karma programlarda genelde bir dil için sertifika, diğeri için asgari seviye istenir. Bölümün sayfasındaki tam dil şartını maddeler halinde çıkar.",
          costTag: "lang-mixed",
        },
      },
    ],
  },

  s6: {
    question: "Kabul mektubun şartlı mı (bedingte Zulassung)?",
    options: [
      {
        label: "Şartsız kabul",
        result: {
          title: "Doğrudan devam edebilirsin",
          text: "Tebrikler — şartsız kabulle finansman ve vize adımlarına (Adım 7) geçebilirsin.",
          notApplicable: ["s6t2"],
        },
      },
      {
        label: "Şartlı kabul",
        next: {
          question: "Kabul mektubundaki şart ne?",
          options: [
            {
              label: "Sadece dil sertifikası eksik",
              result: {
                title: "Dil sertifikanı tamamla",
                text: "Belirtilen seviyeye ulaşıp sertifikanı üniversiteye ilet. Son teslim tarihini kaçırırsan kabul geçersiz sayılabilir — takvimine hemen ekle.",
              },
            },
            {
              label: "Studienkolleg / Feststellungsprüfung şartı",
              result: {
                title: "Studienkolleg sürecini tamamla",
                text: "Studienkolleg'e kayıt olup Feststellungsprüfung'u geçtiğinde kabul kesinleşir. Sınav takvimini üniversiteyle paylaş.",
              },
            },
            {
              label: "Evrak eksikliği",
              result: {
                title: "Eksik evrakı tamamla",
                text: "Belirtilen evrakı hazırlayıp üniversite portalına yükle; teyit e-postasını bekleyip yedekle.",
              },
            },
          ],
        },
      },
    ],
  },

  s7: {
    question: "Almanya'da resmî garantör olabilecek biri (oturumu ve yeterli geliri olan) var mı?",
    options: [
      {
        label: "Evet",
        result: {
          title: "Verpflichtungserklärung yolu",
          text: "Garantörün kendi Ausländerbehörde'sinden taahhüt belgesi (Verpflichtungserklärung) alması gerekir. Gelir ve oturum şartlarını önceden kontrol edin — Sperrkonto açmana gerek kalmayabilir.",
          notApplicable: ["s7t2", "s7t3"],
          costTag: "finance-no-blocked-account",
        },
      },
      {
        label: "Hayır",
        next: {
          question: "Burs alıyor musun (DAAD veya başka bir kurum)?",
          options: [
            {
              label: "Evet",
              result: {
                title: "Burs belgesi finans kanıtı olur",
                text: "Burs yazın süre ve aylık tutarı açıkça belirtiyorsa, çoğu durumda Sperrkonto'ya gerek kalmaz. Yazının konsolosluk şartlarını karşıladığını doğrula.",
                notApplicable: ["s7t2", "s7t3"],
                costTag: "finance-no-blocked-account",
              },
            },
            {
              label: "Hayır",
              result: {
                title: "Sperrkonto açman gerekiyor",
                text: "Güncel yıllık yasal tutarı konsolosluk sayfasından doğrulayıp bir sağlayıcı (Expatrio, Fintiba, Coracle vb.) üzerinden bloke hesap aç.",
                notApplicable: ["s7t4"],
                costTag: "finance-blocked-account",
              },
            },
          ],
        },
      },
    ],
  },
};
