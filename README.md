# AnonWall MVP

Anonim paylaşım platformu - Kullanıcıların anonim olarak paylaşım yapabileceği, beğenebileceği ve trend listeleriyle etkileşime girebileceği minimal sosyal mikroblog platformu.

## Özellikler

- ✅ Anonim kimlik sistemi (rastgele username + avatar)
- ✅ Post oluşturma (kısa metin + kategori)
- ✅ Feed sayfası (sonsuz scroll)
- ✅ Like butonu (IP/fingerprint tabanlı)
- ✅ Trending sayfası (24 saatlik ve haftalık)
- ✅ Anon Duvar (kullanıcının kendi paylaşımları)
- ✅ Profanity filter ve raporlama
- ✅ Kategori sistemi
- ✅ Paylaşım kartları (sosyal medya paylaşımı)

## Teknoloji Stack

- **Backend**: Node.js + Express.js + PostgreSQL
- **Frontend**: Next.js 16 + TypeScript + Tailwind CSS
- **UI Components**: Radix UI

## Kurulum

### Backend

```bash
cd backend
npm install
cp .env.example .env
# .env dosyasını düzenleyin ve PostgreSQL bilgilerinizi girin

# Veritabanını oluşturun
createdb anonwall

# Veritabanı şemasını başlatın
npm run init-db

# Sunucuyu başlatın
npm run dev
```

Backend varsayılan olarak `http://localhost:3000` adresinde çalışır.

### Frontend

```bash
cd web
npm install

# .env.local dosyası oluşturun (opsiyonel, varsayılan localhost:3000)
echo "NEXT_PUBLIC_API_URL=http://localhost:3000/api" > .env.local

# Development sunucusunu başlatın
npm run dev
```

Frontend varsayılan olarak `http://localhost:3001` adresinde çalışır.

## API Endpoints

### Posts
- `GET /api/posts` - Tüm postları getir
- `GET /api/posts/trending` - Trend postları getir
- `GET /api/posts/my` - Kullanıcının kendi postlarını getir
- `GET /api/posts/:id` - Belirli bir postu getir
- `POST /api/posts` - Yeni post oluştur
- `POST /api/posts/:id/like` - Post beğen/beğenme
- `POST /api/posts/:id/report` - Post raporla

### Session
- `GET /api/session` - Oturum bilgilerini getir veya oluştur

### Categories
- `GET /api/categories` - Tüm kategorileri getir

## Veritabanı Şeması

- `categories` - Kategoriler
- `posts` - Paylaşımlar
- `likes` - Beğeniler (fingerprint tabanlı)
- `reports` - Raporlar
- `sessions` - Anonim oturumlar

## Geliştirme Notları

- Anonim kimlikler cookie tabanlı session'larla yönetilir
- Like sistemi IP + User-Agent hash'i ile çalışır
- Profanity filter basit kelime listesi kullanır (geliştirilebilir)
- 5+ rapor alan postlar otomatik olarak gizlenir

## Lisans

MIT
