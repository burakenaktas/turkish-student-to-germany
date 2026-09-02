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
  /** Bu seçimin getirdiği somut kazanımlar ("kâr"). */
  pros?: string[];
  /** Bu seçimin getirdiği somut bedel/risk ("zarar"). */
  cons?: string[];
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
              label: "Evet, benzer alanda yerleştim",
              result: {
                title: "Muhtemelen doğrudan lisans başvurusu (H+)",
                text: "Denkliğin muhtemelen doğrudan kabul için yeterli. Studienkolleg gerekmeden başvuru evraklarına geçebilirsin; yine de üniversitenin kendi şartını kontrol et.",
                notApplicable: ["s1t4"],
                pros: [
                  "Studienkolleg'e gerek kalmadan direkt başvuru sürecine geçersin",
                  "Toplam süreç 6–12 ay kısalabilir",
                ],
                cons: [
                  "Üniversite ek şart (NC, dil) çıkarırsa süreç yine uzayabilir",
                  "Üniversite denkliği farklı değerlendirirse başvuru reddedilip zaman kaybedebilirsin",
                ],
              },
            },
            {
              label: "Yerleştim ama alan farklı",
              result: {
                title: "Muhtemelen Studienkolleg gerekiyor",
                text: "Alan uyuşmazlığı çoğu üniversitede Studienkolleg (hazırlık koleji) şartı doğurur. Dil seviyeni B1–B2'ye taşıyıp Feststellungsprüfung'a hazırlanmayı planla.",
                pros: [
                  "Studienkolleg süresince dilini de ilerletme fırsatın olur",
                  "Farklı alanda bile Almanya'da okuma yolun açık kalır",
                ],
                cons: [
                  "Süreç ortalama 1 yıl kadar uzar",
                  "Feststellungsprüfung'u geçemezsen tekrar girmen gerekebilir",
                ],
              },
            },
            {
              label: "Yerleşmedim",
              result: {
                title: "Ek şart / 1 yıl üniversite gerekebilir",
                text: "YKS yerleştirmesi olmadan doğrudan başvuru genelde mümkün değil. Ya bir yıl Türkiye'de örgün üniversite okuman ya da Studienkolleg yolu değerlendirilir.",
                pros: [
                  "Türkiye'de geçirilen ek yıl sana bir Plan B ve olgunlaşma süresi kazandırır",
                ],
                cons: [
                  "En az 1 yıl ek süre ve o yılın masrafı (harç, yaşam) eklenir",
                  "Bazı bölümler bu yolu hiç kabul etmeyebilir — hedef bölüm sayfasını mutlaka kontrol et",
                ],
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
          pros: ["Mesleki deneyimin bazı bölümlerde (özellikle teknik) artı puan sayılabilir"],
          cons: [
            "Studienkolleg + sınav nedeniyle süreç uzar",
            "Bazı bölümlerde ek staj/meslek deneyimi şartı istenebilir",
          ],
        },
      },
      {
        label: "Açık Öğretim Lisesi",
        result: {
          title: "Ek şart / 1 yıl üniversite gerekebilir",
          text: "Açık öğretim diploması için üniversiteler ek şart isteyebilir. Bir yıl örgün üniversite okuma veya Studienkolleg şartı sık görülür — hedef bölümün sayfasını mutlaka kontrol et.",
          pros: ["Bu süreçte çalışırken dilini/finansmanını güçlendirme fırsatın olur"],
          cons: [
            "Ek yıl veya Studienkolleg şartı toplam süreci belirgin uzatır",
            "Bazı üniversiteler açık öğretim diplomasını hiç kabul etmeyebilir",
          ],
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
                pros: [
                  "Ekstra kurs ücretine gerek yok, doğrudan sınava girip başvurabilirsin",
                  "Başvuru takvimi hızlanır",
                ],
                cons: [
                  "Sertifika sınav ücreti (200–320 €) ve randevu bekleme süresi hâlâ var",
                  "Elindeki sertifika üniversitenin kabul ettiği sınav türünden değilse tekrar sınava girmen gerekebilir",
                ],
              },
            },
            {
              label: "B1–B2",
              result: {
                title: "Studienkolleg seviyesindesin",
                text: "Mevcut seviyen Studienkolleg için uygun olabilir. Lisans için C1'e çıkacak yoğun bir kurs planı (ortalama 3–6 ay) hesaba kat.",
                costTag: "lang-course",
                pros: [
                  "Studienkolleg süresi dil kursuna da sayılır — iki hedefi aynı anda ilerletirsin",
                ],
                cons: [
                  "C1'e çıkana kadar 3–6 ay ek süre + kurs ücreti (800–2.500 €)",
                  "Kurs/sınav takvimi başvuru takvimini geciktirebilir",
                ],
              },
            },
            {
              label: "A2 ve altı",
              result: {
                title: "Önce B1'e çıkman gerekiyor",
                text: "A2 altı seviyeyle ne doğrudan lisans ne de Studienkolleg başvurusu mümkün. Ortalama 6–12 ay yoğun kurs süresiyle planla.",
                costTag: "lang-course",
                pros: [
                  "Erken başlarsan süreci normal başvuru akışına düzgünce entegre edebilirsin",
                ],
                cons: [
                  "6–12 ay ek süre ve en yüksek kurs maliyeti (800–2.500 €)",
                  "Bu süre boyunca başvuru döneminin (15 Temmuz / 15 Ocak) bir turunu kaçırma riski var",
                ],
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
          pros: [
            "Almanca öğrenmeden, çok daha kısa sürede (birkaç ay) dil şartını tamamlarsın",
            "Sınav ücreti Almanca sertifikalardan daha düşük (230–280 €)",
          ],
          cons: [
            "Almanca bilmeden günlük hayat (banka, Anmeldung, doktor) ilk aylarda zorlaşabilir",
            "İngilizce bölüm kontenjanları genelde daha az ve daha rekabetçi",
          ],
        },
      },
      {
        label: "Karma (Almanca + İngilizce)",
        result: {
          title: "Her iki dil şartını da netleştir",
          text: "Karma programlarda genelde bir dil için sertifika, diğeri için asgari seviye istenir. Bölümün sayfasındaki tam dil şartını maddeler halinde çıkar.",
          costTag: "lang-mixed",
          pros: ["İki dilde de yetkinleşmen mezuniyet sonrası iş bulma şansını artırır"],
          cons: [
            "İki ayrı sertifika süreci = iki kat zaman ve masraf riski",
            "Şartlardan biri net değilse başvuru eksik evrakla reddedilebilir",
          ],
        },
      },
    ],
  },

  s6: {
    question: "Kabul mektubun şartlı mı (bedingte Zulassung)?",
    options: [
      {
        label: "Direkt kabul",
        result: {
          title: "Doğrudan devam edebilirsin",
          text: "Tebrikler — direkt kabulle finansman ve vize adımlarına (Adım 7) geçebilirsin.",
          notApplicable: ["s6t2"],
          pros: ["Ek şart yok — direkt finansman/vize adımına geçersin, zaman kaybı olmaz"],
          cons: [
            "Yer teyidi (Rückmeldung) son tarihini kaçırırsan kabul iptal olabilir — takvimi hemen not al",
          ],
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
                pros: ["Kabulün elinde — tek bir net eksiğe odaklanman yeterli"],
                cons: [
                  "Son teslim tarihini kaçırırsan kabul tamamen geçersiz sayılabilir",
                  "Sertifika sınavına uygun randevu bulamazsan zaman baskısı oluşur",
                ],
              },
            },
            {
              label: "Studienkolleg / Feststellungsprüfung şartı",
              result: {
                title: "Studienkolleg sürecini tamamla",
                text: "Studienkolleg'e kayıt olup Feststellungsprüfung'u geçtiğinde kabul kesinleşir. Sınav takvimini üniversiteyle paylaş.",
                pros: ["Kabulün zaten şarta bağlı olarak elinde — hedefin net"],
                cons: [
                  "Feststellungsprüfung'u geçemezsen kabul tamamen düşebilir",
                  "Süreç ek 6–12 ay sürebilir",
                ],
              },
            },
            {
              label: "Evrak eksikliği",
              result: {
                title: "Eksik evrakı tamamla",
                text: "Belirtilen evrakı hazırlayıp üniversite portalına yükle; teyit e-postasını bekleyip yedekle.",
                pros: [
                  "Genelde en hızlı çözülebilecek şart türü — sadece evrak tamamlama meselesi",
                ],
                cons: [
                  "Evrak teminindeki gecikmeler (tercüme, apostil sırası) beklenenden uzun sürebilir",
                ],
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
          pros: [
            "Sperrkonto'ya ≈11.900 €/yıl bloke etmene gerek kalmaz, parana anında erişimin olur",
          ],
          cons: [
            "Garantörün gelir/oturum şartını karşılamazsa başvuru reddedilir",
            "Garantörün bulunduğu eyalete göre süreç haftalarca sürebilir",
          ],
        },
      },
      {
        label: "Hayır",
        result: {
          title: "Sperrkonto açman gerekiyor",
          text: "Güncel yıllık yasal tutarı konsolosluk sayfasından doğrulayıp bir sağlayıcı (Expatrio, Fintiba, Coracle vb.) üzerinden bloke hesap aç. Burs alıyorsan ve yazın süre/tutarı açıkça belirtiyorsa bu tutara gerek kalmayabilir — burs yazını konsolosluğa danış.",
          notApplicable: ["s7t4"],
          costTag: "finance-blocked-account",
          pros: [
            "Garantör veya burs bulamasan da yol her zaman açık kalır — parayı kendi imkanınla gösterirsin",
          ],
          cons: [
            "≈11.900 €/yıl paranın bir yıl boyunca bloke kalması nakit akışını kısıtlar",
            "Hesap açılış + işletim ücreti (49–155 €) ek maliyettir",
          ],
        },
      },
    ],
  },

  s11: {
    question: "Konaklama tercihin ne?",
    options: [
      {
        label: "Öğrenci yurdu (Studierendenwerk)",
        result: {
          title: "Yurtta kalma planı",
          text: "Studierendenwerk yurduna erken başvur — özellikle büyük şehirlerde sıra uzun sürebilir. WG aramana gerek yok.",
          notApplicable: ["s11t2"],
          costTag: "housing-dorm",
          pros: [
            "WG'ye göre aylık 100–250 € daha ucuz",
            "Yurt yönetimi genelde Wohnungsgeberbestätigung'u hızlı verir",
          ],
          cons: [
            "Büyük şehirlerde sıra aylarca sürebilir — erken başvurmazsan yer bulamayabilirsin",
            "Oda/şehir tercihi WG'ye göre daha kısıtlı",
          ],
        },
      },
      {
        label: "WG / paylaşımlı ev",
        result: {
          title: "WG planı",
          text: "WG-Gesucht / Immobilienscout üzerinden erken profil oluştur; kira genelde yurttan yüksek ama seçenek daha bol.",
          notApplicable: ["s11t1"],
          costTag: "housing-shared",
          pros: ["Seçenek çok daha bol; ev arkadaşını ve konumu kendin seçebilirsin"],
          cons: [
            "Kira genelde yurttan yüksektir (350–700 € / ay)",
            "Dolandırıcılık riski daha yüksek — görmeden depozito gönderme",
          ],
        },
      },
    ],
  },

  s15: {
    question: "Hangi tür üniversitede okuyacaksın?",
    options: [
      {
        label: "Devlet üniversitesi",
        result: {
          title: "Devlet üniversitesi yolu",
          text: "Okul harcı yok — sadece dönemlik Semesterbeitrag ödenir; bu, toplam maliyetini büyük ölçüde düşürür.",
          costTag: "uni-public",
          pros: ["Okul harcı yok, sadece dönemlik Semesterbeitrag (150–400 €) ödenir"],
          cons: ["Kontenjan (NC) rekabeti özel üniversitelere göre daha yüksek olabilir"],
        },
      },
      {
        label: "Özel üniversite",
        result: {
          title: "Özel üniversite yolu",
          text: "Özel üniversitelerde dönemlik okul harcı çok daha yüksektir. Burs/kredi seçeneklerini ve kuruma özel tam tutarı erken araştır.",
          costTag: "uni-private",
          pros: ["Kabul şartları genelde daha esnek, kontenjan baskısı daha az"],
          cons: ["Dönemlik okul harcı 2.500–10.000 € — devlet üniversitesine göre çok daha pahalı"],
        },
      },
    ],
  },
};
