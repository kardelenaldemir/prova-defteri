# Prova Defteri tasarım kararı

Ana referans: `prova-defteri-konsept.png`. Taslak, yerleşik ImageGen aracıyla `ui-mockup` olarak üretildi.

Görsel yön: sıcak krem zemin, koyu zeytin metin ve bakır sayılar; editoryal atölye defteri.
Üç sabit gezinti: Genel bakış, Provalar, Müşteriler. Ana eylem Yeni prova.

## Sistem

- Zemin #F7F4ED, yan menü #EEEDE4, metin/ana eylem #263E2C, vurgu #A6654C, çizgi #E1DED4.
- Başlıklar Cormorant Garamond 500/600, arayüz DM Sans 400/500/600. Fontlar yerel paketlerden sunulur.
- Masaüstü: yaklaşık 268px yan menü, 32px ana boşluk, açık metrik şeridi, 65/35 akış/not bölünmesi.
- Liste satırları yatay çizgilerle ayrılır; genel panoyu kutu/kart ızgarasına dönüştürmeyiz.
- Küçük ekranda yatay üçlü gezinti ve tek sütun; ana eylem başlıkla aynı hizada kalır.
- İnce, 1.6px lucide outline ikonlar. Marka simgesi scissors, nav home/calendar/users, veri database.
- Hareket: 140ms renk/geçiş, drawer 180ms. Azaltılmış hareket tercihinde kapatılır.

## Uygulama yüzeyleri

Genel bakış başlığı Atölyede bugün. Alt satır Provalar, notlar ve küçük detaylar bir arada.
Metrikler Bugünkü provalar, Yaklaşan provalar, Bekleyen düzeltmeler.
Bugünün akışı listesi, Prova notları kontrol listesi ve Sıradaki günler.

Formlar ve detay çekmecesi, zorunlu kayıt ekleme/düzenleme işlevleri için aynı renk, tipografi ve çizgi dilinde genişletilir.
Arama ve filtreler Provalar/Müşteriler ekranlarında yer alır. Gereksiz üst başlık etiketi ve sahte AI özelliği eklenmez.

## Dinamik veriler ve bilinçli farklar

Referanstaki tarih ve sayılar örnek durumu temsil eder. Uygulama gerçek yerel tarihi, kurgu başlangıç verisinden hesaplanan sayıları ve kullanıcının düzenlemelerini gösterir.
Metin, buton ve kayıtlar gerçek HTML/React öğeleridir; referans PNG uygulamada arka plan olarak kullanılmaz.
JSON yedekleme ve geri yükleme, yerel kayıtların taşınabilmesi için Veri yönetimi iletişim kutusunda bulunur.

## Üretim istemi

Yerleşik ImageGen ile, Türkçe gelinlik atölyesi planlama uygulaması için 1536x1024 ön yüz mockup istendi.
Tam bir ana ekran, üçlü sol gezinti, Yeni prova eylemi, açık metrik şeridi, üç randevu satırı,
işaretlenebilir Prova notları paneli ve Sıradaki günler bölümü tanımlandı.
Krem/yeşil/bakır renkler, Cormorant/DM Sans yazı sistemi, kodla uygulanabilir kontroller,
fotoğraf/illüstrasyon gerektirmeyen düz yerleşim ve sahte AI işlevinden kaçınma belirtildi.

## Son doğrulama ve referans uyumu

Kabul edilen referans, ImageGen ile üretilen `design/prova-defteri-konsept.png` (1536×1024).
Konsept ve son masaüstü görüntüsü `view_image` ile görsel olarak karşılaştırıldı.
CUA/IAB üzerinden tam sayfa görüntüleri kaydedildi: `screenshots/desktop.jpg` (1536×1024 görünüm alanı)
ve `screenshots/mobile.jpg` (390×844 görünüm alanı, tam sayfa). Her iki görünümde yatay taşma kontrolü `false` döndü.

| Karşılaştırma | Son uygulamadaki durum |
|---|---|
| Sol gezinti ve yerleşim | Masaüstünde yaklaşık 268px sol menü, üstte marka, ortada üç gezinti ve altta veri yönetimi konumu korundu. |
| Renkler | Sıcak krem zemin, koyu yeşil metin/eylem ve bakır metrik sayıları korundu. |
| Yazı sistemi | Serif ana başlık ve sans arayüz ayrımı korundu. Tarayıcıdaki gövde, küçük metin boyutları ve başlık ölçeği referansla piksel düzeyinde aynı değil. |
| Metrik şeridi | Örnek verideki 3 / 5 / 11 sayıları, açık zemin ve ince dikey ayırıcılar korundu. |
| Ana akış ve not paneli | Masaüstünde yaklaşık 65/35 akış/not bölünmesi ve sağdaki kontrol listesi korundu. |
| Prova satırları | Üç yatay kayıt, saat/ad/model/durum hiyerarşisi ve satırlar arasındaki ince çizgiler korundu. |
| Alt bölüm | Sıradaki günler bölümü, ana akışın altında kaldı. Mobilde kayıtlar alt alta sıralanır. |

### Bilinçli farklar ve metin karşılaştırması

- Marka için kullanılan Lucide `scissors` simgesi, referanstaki makas çiziminden farklı.
- Tarih kontrolü, gerçek etkileşim için düğme ve yerel tarih girdisiyle çalışır.
- Mobilde tek sütun, yatay gezinti ve formlar/detay çekmeceleri, referansın işlevsel genişletmeleridir.
- Ana Türkçe başlıklar ve arayüz metinleri korundu. Tarihler yerel takvime göre dinamiktir; form ve doğrulama metinleri işlevler için eklendi. Sahte AI özelliği yok.

Sonuç: Referansla yakın yapısal uyum var; uygulama piksel düzeyinde birebir eşleşme iddiası taşımıyor.

### Test durumu ve açık konu

İş mantığı testleri, üretim derlemesi ve TypeScript kontrolü geçti. JSON yedeğini tarayıcıdan indirme testi takıldı;
indirme akışının tarayıcı üzerinden tamamlandığı doğrulanmadı. Bu uçtan uca kontrol açık kalıyor.
