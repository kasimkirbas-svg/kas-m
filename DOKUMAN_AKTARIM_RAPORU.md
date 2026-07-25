# Dokuman Aktarim ve Test Raporu

Tarih: 25 Temmuz 2026

## Kapsam

- `DOKUMANLARIM` klasorundeki 87 DOCX dosyasinin tamami siteye aktarildi.
- 14 kategori korundu.
- Belgelerdeki komutlardan 1.796 adet dokumana ozel sol panel alani uretildi.
- Uygulama eski 26 sabit sablon yerine uretilen 87 sablonluk katalogla calisacak sekilde guncellendi.

## Komut Donusumleri

- `{alan}`: metin, tarih veya uzun aciklama kontrolu
- `{%logo}` ve diger `{%resim}` komutlari: PNG/JPG dosya secici
- `{#isRES}`, `{#isGES}`, `{#isHES}`, `{#isTermik}` ve benzeri bloklar: Goster/Gizle secimi
- `{#tablo}...{/tablo}` bloklari: satir eklenebilir ve silinebilir dinamik tablo
- Tablo icindeki `{%fotograf}` komutlari: satira ozel fotograf secici

10 belgede bagimsiz logo veya sema alani, 15 dinamik tabloda satir ici fotograf alani bulunmaktadir. 8 belgede kosullu bolum, 76 belgede en az bir dinamik tablo vardir.

## Onarilan Kaynak Sorunlari

Kaynak dosyalara dokunulmadi; siteye alinan kopyalarda su komut hatalari otomatik ve tekrarlanabilir bicimde onarildi:

1. `Enerji Santralleri/EKAT_Yetki_Belgesi_Takip_Cizelgesi_Sablonu.docx`
   Bos `personeller` dongusu gercek tablo satirinin etrafina tasindi.
2. `Metal ve Dokum/Termal Konfor Takip Formu.docx`
   Yanlis `{#no}` komutu `{no}` yapildi ve `{{bolum}` etiketi `{bolum}` olarak duzeltildi.
3. `STANDART DOKUMANLAR/Kapali Alanda Calisma Egitimi ve Izin Formu.docx`
   `guvenlikTedbirleri` ve `gorevliPersonel` dongu kapanislari kendi tablo satirlarina tasindi.

Bu onarimlar `scripts/import-docx-templates.mjs` icinde tutulur. Kaynak klasor tekrar aktarildiginda ayni duzeltmeler otomatik uygulanir.

## Calistirilan Testler

- `npm run import:docx -- <kaynak-klasor>`: 87/87 dosya basarili
- `npm run test:docx`: 87/87 DOCX okunabilir, donguler dengeli ve docxtemplater ile test verisi kullanilarak render edilebilir
- `npm run build`: Vite uretim derlemesi basarili
- VS Code tanilari: hata yok
- Tarayici testi, enerji belgesi: DOCX yuklendi, onizleme olustu, logo secici ve dort santral filtresi gorundu
- Tarayici testi, FOD formu: iki dinamik tablo gorundu; satir ekleme islemi beklenen bes sutunu olusturdu
- Tarayici testi sirasinda bulunan eski `setEditorInitialData` cagrisi kaldirildi; karttan editor acilisi duzeltildi

## Operasyon Notu

Yerel katalog 87 sablondur. Test ortaminda Supabase'den gelen bir eski uzak sablon da birlestirildigi icin panel ust sayacinda 88 gorulebilir. Canli Supabase `document_templates` tablosundaki eski/mukerrer kayit pasife alinmali veya yeni katalogla eslestirilmelidir.

Vite build, buyuk JavaScript paketleri icin performans uyarisi vermektedir. Bu bir calisma hatasi degildir; sonraki performans calismasinda editor ve DOCX kutuphaneleri ayri chunk olarak bolunebilir.