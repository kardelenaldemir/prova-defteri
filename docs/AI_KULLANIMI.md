# Prova Defteri - Yapay Zekâ Kullanım Kaydı

**Kullanılan asistan:** OpenAI Codex.  
**Kullanım yeri:** Web uygulamasının geliştirme süreci.  
**Ürün içindeki AI hizmeti:** Yok; AI API'si, model çıkarımı veya tahmin servisi kullanılmaz.

## Asistan hangi aşamada kullanıldı?

| Aşama | Asistanın katkısı | Kayıt / doğrulama durumu |
|---|---|---|
| Fikir ve kapsam | Mevcut projelerle ilişkili fikirleri karşılaştırmak; müşteri/prova/düzeltme sorununu seçmek | Fikir seçimi yapıldı; kapsam `docs/PROJE_PLANI.md` içinde yazıldı. |
| Ekran planı | Genel Bakış, Provalar, Müşteriler ve detay çekmecesi akışlarını tasarlamak | Ekranlar uygulandı; masaüstü ve mobil kullanım tarayıcıda kontrol edildi. |
| Veri modeli | Müşteri, müşteriye bağlı prova ve düzeltme maddesi ilişkisini kurmak; kalıcı saklamayı planlamak | Kesin türler `src/lib/types.ts` içinde; veri ve ilişki doğrulama testleri geçti. |
| Arayüz ve kod | React/TypeScript bileşenleri, saf CSS, formlar, filtreler ve saklama kodunda yardımcı olmak | Uygulama geliştirildi; TypeScript denetimi ve üretim derlemesi başarılı. |
| Kod incelemesi ve test | CRUD, ilişki bütünlüğü, form doğrulama, tarih özetleri, yenileme ve mobil kullanım senaryolarını kontrol etmek | 14 otomatik test geçti. Temel müşteri/prova akışları, form hataları, saat çakışması ve kalıcı saklama tarayıcıda kontrol edildi. |
| Dokümantasyon | Kurulum, kullanılan teknolojiler, AI katkısı ve teslim gerekliliklerini açıklamak | README ve üç proje belgesi hazırlandı; gerçek ekran görüntüleri ve depo bağlantısı eklendi. |

Asistanın önerileri, çalışan uygulama ve test sonuçlarıyla kontrol edildi. Test kapsamı ve yayın durumunun ayrıntıları `docs/TESLIM_KONTROLU.md` içindedir.

## Planı yönlendiren görevler

Aşağıdaki maddeler konuşmanın kelimesi kelimesine dökümü değil, geliştirmeye verilen görevlerin özetidir:

- Modern bir JavaScript framework'üyle yapılabilecek, küçük ama anlamlı bir atölye uygulaması seç.
- Müşteri, prova ve düzeltme maddeleri için ekranları ve veri ilişkilerini planla.
- Kayıt işlemlerini React ve TypeScript ile uygula; sayfa yenilendiğinde veriyi koru.
- Arama, durum filtresi, bugün/yaklaşan özetleri ve duyarlı görünümü incele.
- Teslim belgelerinde gerçek test sonuçlarını, ekran görüntülerini ve yayın bağlantılarını açıkça belirt.

## Kullanılan kontrol senaryoları

1. Müşteri oluştur, düzenle ve sil; bağlı provaların tutarlı kaldığını kontrol et.
2. Prova oluştur; tarih/saat, tür, durum ve notları düzenle.
3. Bir düzeltme maddesini tamamla; çekmeceyi kapatıp aç ve kaydın korunduğunu kontrol et.
4. Arama ve durum filtresini birlikte kullan; boş sonuç durumunu incele.
5. Sayfayı yenile; müşteri ve prova değişikliklerinin `localStorage` üzerinden geri geldiğini doğrula.
6. Bugün/yaklaşan özetlerini farklı tarihli ve durumdaki kayıtlarla kontrol et.
7. Masaüstü ve mobil görünümü; form kullanımı, çekmece, taşma ve klavye erişimi açısından incele.
8. Üretim derlemesini, otomatik kontrolleri, herkese açık depo erişimini ve canlı yayını doğrula.

**Sonuç:** `npm test` ile 14/14 test geçti; `npm run typecheck` ve `npm run build` başarılı. Ekran görüntüleri `screenshots/desktop.jpg` ve `screenshots/mobile.jpg` dosyalarındadır. Canlı yayın, erişim doğrulaması tamamlandığında teslim kontrolüne işlenecektir.

## Geliştiricinin rolü

Problem seçimi ve kapsam onayı kullanıcıya aittir. Üretilen kodun davranışı, kullanılan teknolojiler ve AI katkısı açıklanabilir biçimde teslim edilmelidir. Bu uygulamadaki özet kartlarının hesaplanması, AI destekli tahmin olarak sunulmaz.
