# # 🎉 Event Finder (Full Stack)

## 📌 Proje Hakkında

Event Finder, kullanıcıların etkinlikleri kolayca keşfetmesini sağlayan modern bir Full Stack web uygulamasıdır.

Uygulama frontend ve backend olmak üzere iki bölümden oluşmaktadır. Kullanıcılar sisteme giriş yaptıktan sonra şehirlerine uygun etkinlikleri görüntüleyebilir, etkinlikleri kategoriye göre filtreleyebilir, tarihe göre sıralayabilir ve profil bilgilerini yönetebilir.

Proje, gerçek ekip çalışması deneyimini simüle edecek şekilde REST API mimarisi kullanılarak geliştirilmiştir.

---

# 🏗️ Proje Mimarisi

```
Frontend (React)
        │
 REST API (Axios)
        │
Backend (Node.js + Express)
        │
PostgreSQL + Prisma ORM
```

---

# 🚀 Kullanılan Teknolojiler

## Frontend

- React
- JavaScript (ES6+)
- React Router
- Context API
- Axios
- CSS / SCSS

## Backend

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- REST API
- CORS
- Dotenv

---

# 📂 Frontend Klasör Yapısı

```
src/
│
├── components/
├── pages/
│   ├── Home
│   ├── Events
│   ├── Login
│   └── Profile
├── services/
├── context/
├── router/
└── assets/
```

### Açıklamalar

- **components** → Tekrar kullanılabilir bileşenler
- **pages** → Sayfa bileşenleri
- **services** → API servisleri
- **context** → Global durum yönetimi
- **router** → Sayfa yönlendirmeleri
- **assets** → Statik dosyalar

---

# 📂 Backend Klasör Yapısı

```
src/
│
├── controllers/
├── routes/
├── middlewares/
├── services/
├── prisma/
├── config/
└── server.js
```

### Açıklamalar

- **controllers** → Request / Response yönetimi
- **routes** → API endpoint tanımları
- **middlewares** → JWT doğrulama ve diğer middleware işlemleri
- **services** → İş kuralları (Business Logic)
- **prisma** → Veritabanı modeli ve migration dosyaları
- **config** → Uygulama ayarları

---

# 🌐 Sayfalar

- Ana Sayfa
- Giriş Yap
- Etkinlikler
- Profil

---

# 🔗 API Endpointleri

## Authentication

```
POST /auth/register
POST /auth/login
GET  /auth/me
```

## Users

```
GET  /users/:id
PUT  /users/:id
```

## Events

```
GET    /events
GET    /events/:id
POST   /events
PUT    /events/:id
DELETE /events/:id
```

---

# 🔍 Filtreleme

```
GET /events?city=istanbul

GET /events?type=concert

GET /events?date=2026-03-25

GET /events?city=ankara&type=theater
```

---

# 🗄️ Veritabanı Modelleri

## User

- id
- name
- email
- password
- city

## Event

- id
- title
- description
- city
- date
- type
- image

## Favorite

- id
- userId
- eventId

---

# 🔐 Kimlik Doğrulama

Sistemde JWT tabanlı kimlik doğrulama kullanılmaktadır.

- Kullanıcı kayıt olabilir.
- Giriş yaptıktan sonra JWT Token oluşturulur.
- Korumalı endpointlerde Authorization Header üzerinden doğrulama yapılır.
- Middleware yapısı ile yetkisiz erişimler engellenir.

---

# 🔄 Frontend - Backend Entegrasyonu

Frontend uygulaması REST API üzerinden backend ile haberleşmektedir.

Örnek API istekleri:

```
GET http://localhost:5000/events

POST http://localhost:5000/auth/login
```

---

# ⚙️ Kurulum

## Backend

```bash
cd backend

npm install

npm run dev
```

## Frontend

```bash
cd frontend

npm install

npm run dev
```

---

# 🎯 Projenin Amacı

Bu proje ile;

- React kullanarak modern kullanıcı arayüzleri geliştirmek
- Node.js ve Express.js ile REST API geliştirmek
- PostgreSQL ve Prisma ORM ile ilişkisel veritabanı kullanmak
- JWT Authentication yapısını uygulamak
- Frontend ve backend entegrasyonu gerçekleştirmek
- Gerçek ekip çalışması deneyimi kazanmak

amaçlanmıştır.

---

# 👨‍💻 Geliştirici

**Ahmet Erbey**

Full Stack Developer