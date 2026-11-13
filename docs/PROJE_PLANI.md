# Prova Defteri - Proje Planı

## Problem ve amaç

Bir gelinlik atölyesinde müşteri bilgileri, prova tarihleri ve düzeltme notları ayrı yerlerde tutulduğunda bir sonraki provanın hazırlığını izlemek güçleşebilir. Prova Defteri, bu bilgileri müşteriye bağlı kayıtlar halinde gösterir. Hedef kullanıcı, günlük prova akışını yöneten atölye çalışanıdır.

Başlıca kullanım sorusu: **Bugün hangi provalar var, hangi düzeltmeler bekliyor ve bir sonraki randevu ne zaman?**

Proje bağımsız bir React uygulaması olarak geliştirilir. Üç ekran, bu iş akışına hizmet etmek için seçilmiştir; yönergede zorunlu bir ekran sayısı olduğu varsayılmamıştır.

## Ekran planı

| Ekran | Görev | Ana etkileşim |
|---|---|---|
| Genel Bakış | Günlük iş akışını görmek | Bugünün ve yaklaşan provalarını incelemek; ilgili kayda gitmek |
| Provalar | Randevu ve düzeltmeleri yönetmek | Oluşturmak, aramak, filtrelemek, ayrıntı açmak, düzenlemek ve silmek |
| Müşteriler | Müşteri kayıtlarını yönetmek | Kayıt oluşturmak/düzenlemek/silmek; ilişkili provalara ulaşmak |
| Detay çekmecesi | Ekran bağlamını koruyarak prova ayrıntılarını görmek | Durum, düzeltme maddeleri ve notları incelemek/güncellemek |

## Kavramsal veri modeli

| Kayıt | Temel bilgiler | İlişki |
|---|---|---|
| Müşteri | Benzersiz kimlik, ad, iletişim ve kayıt notları | Bir müşterinin birden fazla provası olabilir. |
| Prova | Benzersiz kimlik, müşteri kimliği, tarih, saat, prova türü, durum ve notlar | Her prova bir müşteriye bağlıdır. |
| Düzeltme maddesi | Kimlik, açıklama ve tamamlanma bilgisi | Bir provanın düzeltme listesinde yer alır. |

`src/lib/types.ts`, uygulamadaki kesin alan adlarının kaynağıdır. Özet kartları ayrı ve bağımsız sayılar olarak kaydedilmez; mevcut kayıtlar üzerinden hesaplanır. Oluşturma ve düzenleme işlemlerinde zorunlu alanlar kontrol edilir. Müşteri silme akışı, bağlı provaların da silineceğini onaylamayı gerektirir.

## Temel teknik kararlar

- React bileşenleri görünümü ve kullanıcı etkileşimlerini yönetir.
- TypeScript, kayıtların yapısını ve fonksiyon girdilerini tanımlar.
- CSS, masaüstü ve mobil düzeni sağlar. Anlamsal HTML öğeleri, etiketli form alanları ve klavye ile kullanım gözetilir.
- `localStorage`, sayfa yenilendiğinde veriyi geri yüklemek için kullanılır. Bu sürümde bir sunucu veritabanı kurulmaz.
- Açılıştaki gösterim verileri tamamen kurgudur. Tarih özetleri gerçek uygulama kayıtlarından hesaplanır.
- Uygulama için AI API anahtarı veya model eğitimi gerekmez. AI, geliştirme sürecinde kullanılan asistandır.

## Çalışma adımları

| Adım | Çalışma | Beklenen kanıt |
|---|---|---|
| 1 | Yönergeyi problem, ekran ve veri modeline dönüştürmek | Bu plan ve AI kullanım belgesi |
| 2 | React/Vite yapısını ve duyarlı arayüzü kurmak | Çalışan üç ekran ve ortak bileşenler |
| 3 | Müşteri/prova işlemlerini ve kalıcı saklamayı bağlamak | Kayıt ekleme, düzenleme, silme ve yeniden yükleme senaryosu |
| 4 | Filtreleri, hesaplanan özetleri ve detay akışını tamamlamak | Arama, durum filtresi ve güncel özetler |
| 5 | Derleme, otomatik kontroller ve tarayıcı doğrulaması | Gerçek komut sonuçları ve ekran görüntüleri |
| 6 | Depoyu ve canlı yayını teslim etmek | Herkese açık GitHub ve erişilebilir canlı uygulama bağlantıları |

Bu adımlar çalışma sırasını belirtir; yönergede bulunmayan bir teslim süresi veya tarih şartı eklemez.

## Kapsam sınırı

Kimlik doğrulama, çok kullanıcılı eşitleme, ödeme, SMS gönderimi ve otomatik AI önerisi bu çalışmanın kapsamına dahil değildir. Atölye Nabzı Python modeli bu web uygulamasına bağlanmaz; iki proje farklı eğitim çıktılarını karşılar.

Ek olarak JSON yedekleme/geri yükleme akışı uygulanmıştır. Veri yapısı, sürüm, kimlikler ve müşteri-prova ilişkileri geri yüklemeden önce doğrulanır. Doğrulama kapsamı `docs/TESLIM_KONTROLU.md` içinde kayıtlıdır.
