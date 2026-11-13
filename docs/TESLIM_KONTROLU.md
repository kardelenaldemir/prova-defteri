# Prova Defteri - Yönerge ve Teslim Kontrolü

Bu belge, Web Geliştirme ve Yapay Zekâ proje yönergesinin gerekliliklerini somut teslimlere eşler. Dosya yolları proje köküne göredir. **Yerel uygulama, otomatik kontroller ve ekran görüntüleri hazırdır.** GitHub deposuna kaynak aktarımı ve canlı yayın henüz tamamlandı olarak işaretlenmemiştir.

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
| Herkese açık GitHub depo bağlantısı | [kardelenaldemir/prova-defteri](https://github.com/kardelenaldemir/prova-defteri) | Herkese açık depo oluşturuldu; kaynak kod aktarımı ve son erişim kontrolü bekleniyor. |
| Canlı uygulama bağlantısı | Gerçek yayın URL'si | Henüz oluşturulmadı. Yayın sonrasında erişim kontrolü yapılacak. |

Uygulama içinde AI API'si/modeli bulunması yönergenin bir koşulu olarak ele alınmamıştır. LocalStorage, bu proje için seçilen veri saklama yöntemidir. Üç ekran ve iki ekran görüntüsü, projenin uygulama tercihidir; yönergede zorunlu ekran sayısı veya iki ekran görüntüsü şartı olduğu ileri sürülmez.

## Uygulama ve kalite kontrolü

- [x] Bağımlılıklar kuruldu; geliştirme sunucusu çalıştırıldı.
- [x] `npm run typecheck` başarıyla tamamlandı.
- [x] `npm run build` başarıyla tamamlandı.
- [x] `npm test` çalıştırıldı; 14/14 test geçti.
- [x] Genel Bakış, Provalar ve Müşteriler ekranları tarayıcıda açıldı.
- [x] Müşteri oluşturma ve arama akışı tarayıcıda kontrol edildi.
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
- [ ] Kaynak kod GitHub'a aktarıldı ve depo içeriği kontrol edildi.
- [ ] Canlı yayın bağlantısı erişim kontrolü yapılarak README'ye eklendi.

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
| JSON yedek mantığı | Dışa/içe aktarma turu, sürüm ve alan doğrulama, bozuk veri, ilişki kontrolü ve geri yükleme/yazma hatası senaryoları otomatik testlerden geçti. |

**Doğrulama sınırı:** Tarayıcı otomasyon aracı indirme etkileşiminde takıldığı için JSON yedek dosyasını kullanıcı arayüzünden indirme akışı doğrulanamadı. Yedek içeriği ve geri yükleme mantığı otomatik testlerde doğrulandı; bu sonuç, tarayıcıdan dosya indirme akışının da test edildiği anlamına gelmez.

**Bekleyen teslim adımları:** GitHub'a kaynak kod aktarımı ve gerçek canlı yayın adresinin erişim kontrolü. Canlı adres doğrulanmadan tamamlandı olarak işaretlenmez.
