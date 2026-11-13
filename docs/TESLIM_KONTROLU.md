# Prova Defteri - Yönerge ve Teslim Kontrolü

Bu belge, Web Geliştirme ve Yapay Zekâ proje yönergesinin gerekliliklerini somut teslimlere eşler. Dosya yolları proje köküne göredir. **Uygulama, otomatik kontroller, ekran görüntüleri, herkese açık kaynak deposu ve canlı yayın hazırdır.** GitHub Pages yayını HTTP ve tarayıcı üzerinden doğrulandı.

## Yönerge gereklilikleri

| Gereklilik | Projedeki karşılığı | Durum ve kanıt |
|---|---|---|
| Modern bir JavaScript framework'ü kullanmak | React + Vite + TypeScript; `package.json`, `src/` | Tamam; TypeScript denetimi ve üretim derlemesi geçti. |
| Geliştirmede en az bir AI asistanı kullanmak | OpenAI Codex | Tamam; planlama, kod, inceleme, test ve dokümantasyonda kullanıldı. Ayrıntı `docs/AI_KULLANIMI.md` içinde. |
| Fikri, ekranları ve veri modelini AI ile planlamak | `docs/PROJE_PLANI.md`; `docs/AI_KULLANIMI.md` | Plan hazır. |
| HTML, CSS ve JavaScript temellerini kullanmak | Anlamsal JSX/HTML, saf CSS, olaylar ve veri işlemleri | Tamam; kaynak kod ve çalışan arayüzde mevcut. |
| README'de proje açıklaması | `README.md` | Hazır. |
| README'de kurulum adımları | `README.md` | Tamam; Node.js 22.12+/24, npm kurulum ve çalıştırma komutları yazılı. |
| README'de kullanılan teknolojiler | `README.md` | Tamam; `package.json` ve uygulamayla eşleştirildi. |
| README'de AI'ın hangi aşamada ne yaptığını açıklamak | `README.md`; `docs/AI_KULLANIMI.md` | Tamam; gerçekleştirilen geliştirme ve test aşamaları kayıtlı. |
| En az bir uygulama ekran görüntüsü | `screenshots/desktop.jpg` | Tamam; 1.536 piksel masaüstü görünümü README'ye eklendi. |
| Ek mobil ekran görüntüsü | `screenshots/mobile.jpg` | Tamam; 390 piksel mobil görünümü README'ye eklendi. |
| Herkese açık GitHub depo bağlantısı | [kardelenaldemir/prova-defteri](https://github.com/kardelenaldemir/prova-defteri) | Tamam; kaynak kod `main` dalına aktarıldı. GitHub API'sinde `private: false`, varsayılan dal `main`. |
| Canlı uygulama bağlantısı | [Prova Defteri](https://kardelenaldemir.github.io/prova-defteri/) | Tamam; Pages derlemesi `built`, anonim HTTP isteği 200. CUA/IAB'de arayüz ve Müşteriler ekranı açıldı. |

Uygulama içinde AI API'si/modeli bulunması yönergenin bir koşulu olarak ele alınmamıştır. LocalStorage, bu proje için seçilen veri saklama yöntemidir. Üç ekran ve iki ekran görüntüsü, projenin uygulama tercihidir; yönergede zorunlu ekran sayısı veya iki ekran görüntüsü şartı olduğu ileri sürülmez.

## Uygulama ve kalite kontrolü

- [x] Bağımlılıklar kuruldu; geliştirme sunucusu çalıştırıldı.
- [x] `npm run typecheck` başarıyla tamamlandı.
- [x] `npm run build` başarıyla tamamlandı.
- [x] `npm test` çalıştırıldı; 14/14 test geçti.
- [x] Genel Bakış, Provalar ve Müşteriler ekranları tarayıcıda açıldı.
- [x] Müşteri oluşturma, düzenleme ve arama akışı tarayıcıda kontrol edildi.
- [x] Prova kaydı, düzeltme maddeleri ve durum güncelleme akışı kontrol edildi.
- [x] Hatalı/eksik form girdileri ve saat çakışması kontrol edildi.
- [x] Bugün/yaklaşan kayıtları destekleyen tarih ve sıralama mantığı test edildi.
- [x] Sayfa yenilendikten sonra değişikliklerin korunduğu tarayıcıda doğrulandı.
- [x] Müşteri silindiğinde bağlı provaların silinmesi tarayıcıda doğrulandı.
- [x] Mobil düzen ve detay çekmecesi kontrol edildi.
- [x] Masaüstü ekran görüntüsü kaydedildi ve README'de gösterildi.
- [x] Mobil ekran görüntüsü kaydedildi ve README'de gösterildi.
- [x] README ve AI kullanım belgesi gerçek uygulama/test sonuçlarıyla güncellendi.
- [x] Herkese açık GitHub deposu oluşturuldu.
- [x] Kaynak kod GitHub'ın `main` dalına aktarıldı; depo API'sinden herkese açık olduğu doğrulandı.
- [x] GitHub Pages adresi oluşturuldu ve README'ye eklendi.
- [x] Canlı yayının HTTP/tarayıcı erişimi doğrulandı.

## Son doğrulama kaydı

**Yerel doğrulama tarihi:** 13 Kasım 2026.

| Kontrol | Sonuç |
|---|---|
| Otomatik testler | `npm test`: 14 test başarılı, başarısız test yok. Testler `src/lib/domain.test.ts` içinde. |
| Tür kontrolü | `npm run typecheck`: başarılı. |
| Üretim derlemesi | `npm run build`: başarılı; TypeScript ve Vite derlemesi geçti. |
| Masaüstü | 1.536 piksel genişlikte tarayıcı kontrolü; `screenshots/desktop.jpg`. |
| Mobil | 390 piksel genişlikte tarayıcı kontrolü; `screenshots/mobile.jpg`. |
| Veri saklama | Yenileme sonrası müşteri/prova ve düzeltme değişiklikleri korundu. |
| İlişkili kayıtlar | Müşteri silme ve bağlı provaların kaldırılması kontrol edildi. |
| Canlı müşteri düzenleme | Not değiştirildi, kaydedildi ve detayda yeni değeri görüldü; örnek not ilk haline döndürüldü. |
| JSON yedek mantığı | Dışa/içe aktarma turu, sürüm ve alan doğrulama, bozuk veri, ilişki kontrolü ve geri yükleme/yazma hatası senaryoları otomatik testlerden geçti. |
| Kaynak depo | Kaynak kod `main` dalına aktarıldı; GitHub API yanıtında `private: false` ve `default_branch: main`. |
| Canlı yayın | GitHub Pages son derleme durumu `built`; `public: true`, kaynak dal `gh-pages`. Anonim HTTP 200; tarayıcıda Genel Bakış ve Müşteriler açıldı, konsol hata/uyarı listesi boş. |

**Doğrulama sınırı:** Tarayıcı otomasyon aracı indirme etkileşiminde takıldığı için JSON yedek dosyasını kullanıcı arayüzünden indirme akışı doğrulanamadı. Yedek içeriği ve geri yükleme mantığı otomatik testlerde doğrulandı; bu sonuç, tarayıcıdan dosya indirme akışının da test edildiği anlamına gelmez.

**Teslim durumu:** Kaynak depo ve canlı demo hesap girişi olmadan HTTP 200 döndü. Son masaüstü ekran görüntüsü canlı yayından kaydedildi. Yukarıdaki yedek indirme doğrulaması dışında açık kalite kontrol adımı yoktur.
