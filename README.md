# 🔐 Catatan Aman Cloud

> **Aplikasi note-taking berbasis cloud dengan enkripsi end-to-end dan keamanan enterprise-grade**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react)](https://reactjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)

**Live Demo:** [https://notelist-encrypted.netlify.app]([[https://notelist-encrypted.netlify.app]])

---

## 📋 Daftar Isi

- [Fitur Utama](#fitur-utama)
- [Tech Stack](#tech-stack)
- [Arsitektur Sistem](#arsitektur-sistem)
- [Keamanan](#keamanan)
- [Instalasi](#instalasi)
- [Konfigurasi](#konfigurasi)
- [Penggunaan](#penggunaan)
- [Database Schema](#database-schema)
- [API Endpoints](#api-endpoints)
- [Deployment](#deployment)
- [Testing](#testing)
- [Kontribusi](#kontribusi)
- [Lisensi](#lisensi)

---

## ✨ Fitur Utama

### 🔒 Keamanan Tingkat Enterprise

- **Enkripsi AES-256 End-to-End** - Data terenkripsi di browser sebelum dikirim ke server
- **Row Level Security (RLS)** - Setiap user hanya bisa akses data mereka sendiri
- **JWT Authentication** - Stateless authentication dengan token yang aman
- **HTTPS/TLS 1.3** - Semua komunikasi terenkripsi dengan protokol modern

### 📝 Manajemen Catatan

- ✅ **CRUD Operations** - Create, Read, Update, Delete catatan dengan mudah
- 📂 **Kategorisasi** - Organisir catatan ke dalam kategori (Personal, Pekerjaan, Ide, Lainnya)
- 🔍 **Search & Filter** - Cari catatan secara real-time berdasarkan judul atau konten
- 🏷️ **Tagging** - Tambahkan tag untuk organisasi yang lebih baik
- 📅 **Timestamp** - Setiap catatan memiliki waktu pembuatan dan update

### 🔐 Enkripsi Fleksibel

- Pilih untuk enkripsi individual catatan atau simpan sebagai plain-text
- **Modal Dekripsi** - Input kunci enkripsi untuk membuka catatan terenkripsi
- Password strength indicator untuk membantu memilih kunci yang kuat
- Zero-knowledge architecture - bahkan developer tidak bisa lihat data terenkripsi

### 📊 Audit & Monitoring

- 📋 **Audit Trail** - Catat semua aktivitas pengguna (create, update, delete)
- 🕐 **Activity Logging** - Timestamp dan detail untuk setiap action
- 📈 **User Session Tracking** - Monitor user login dan logout events
- 🚨 **Alert System** - Notifikasi untuk suspicious activities

---

## 🛠️ Tech Stack

### Frontend
```
React 18                    - UI Framework
CryptoJS                    - Client-side encryption
Tailwind CSS                - Styling
Vite                        - Build tool
```

### Backend
```
Supabase                    - Backend-as-a-Service (BaaS)
PostgreSQL 13               - Database
PostgREST                   - Auto-generated REST API
JWT Authentication          - Secure token auth
```

### Infrastructure
```
Netlify                     - Frontend hosting & deployment
Cloudflare                  - CDN & DDoS protection
Let's Encrypt               - SSL/TLS certificates
```

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENT LAYER (BROWSER)                   │
├─────────────────────────────────────────────────────────────┤
│  ┌─────────────────────┐      ┌──────────────────────┐     │
│  │  React Components   │      │  CryptoJS Encryption │     │
│  │  - Auth Component   │      │  - AES-256-CBC       │     │
│  │  - NotesList Comp   │      │  - Key Derivation    │     │
│  └─────────────────────┘      └──────────────────────┘     │
│              │                           │                  │
│              └───────────────┬───────────┘                  │
│                              ▼                              │
│              ┌──────────────────────────┐                  │
│              │  HTTPS/TLS 1.3 Secure    │                  │
│              │  Connection              │                  │
│              └──────────────┬───────────┘                  │
└─────────────────────────────┼──────────────────────────────┘
                              ▼
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE BACKEND LAYER                          │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Service │  │PostgREST API │  │  PostgreSQL  │     │
│  │ (JWT-based)  │  │ (RLS enabled)│  │     DB       │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│           │                ▲                ▲               │
│           └────────────┬───┘                │               │
│                        │      Encryption    │               │
│                    Row Level Security       │               │
│                                        Backups               │
└─────────────────────────────────────────────────────────────┘
```

### Layer Details

**Layer 1 - Client Side**
- React UI Components
- CryptoJS AES-256 Encryption
- Session Management
- User Input Validation

**Layer 2 - Backend API**
- JWT Token Authentication
- PostgREST REST API
- Row Level Security Enforcement
- Input Validation & Sanitization

**Layer 3 - Database**
- PostgreSQL 13
- Encryption at Rest
- Automated Backups
- Transaction Logging

---

## 🔐 Keamanan

### Encryption Flow

```
User Input
    ▼
Client-side Validation
    ▼
AES-256 Encryption (CryptoJS)
    ▼
HTTPS/TLS 1.3 Transmission
    ▼
Server-side RLS Validation
    ▼
Database Storage (Encrypted)
    ▼
Daily Encrypted Backups
```

### Security Features

| Fitur | Implementasi | Status |
|-------|--------------|--------|
| Client-side Encryption | AES-256-CBC | ✅ Enabled |
| Transport Security | HTTPS/TLS 1.3 | ✅ Enforced |
| Authentication | JWT Tokens | ✅ Implemented |
| Data Isolation | Row Level Security | ✅ Enforced |
| Password Hashing | bcrypt | ✅ Applied |
| Rate Limiting | 100 req/min per IP | ✅ Active |
| DDoS Protection | Cloudflare WAF | ✅ Enabled |
| Audit Logging | Comprehensive trail | ✅ Complete |

### Security Best Practices

- ✅ Never store encryption keys server-side
- ✅ All passwords hashed with bcrypt
- ✅ CORS restricted to trusted origins
- ✅ CSRF tokens enabled
- ✅ XSS prevention via Content Security Policy
- ✅ SQL Injection prevention via parameterized queries
- ✅ Regular security audits recommended

---

## 📦 Instalasi

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org/))
- npm atau yarn
- Git

### Langkah Instalasi

1. **Clone Repository**
```bash
git clone https://github.com/muhammadridha/catatan-aman-cloud.git
cd catatan-aman-cloud
```

2. **Install Dependencies**
```bash
npm install
# atau
yarn install
```

3. **Setup Environment Variables**
```bash
cp .env.example .env.local
```

Isi file `.env.local` dengan credentials Supabase Anda:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

4. **Run Development Server**
```bash
npm run dev
# atau
yarn dev
```

Aplikasi akan berjalan di `http://localhost:5173`

---

## ⚙️ Konfigurasi

### Supabase Setup

1. **Buat Supabase Project** di [supabase.com](https://supabase.com)

2. **Jalankan SQL Schema**
```sql
-- Tabel notes
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  category VARCHAR(50),
  is_encrypted BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabel audit_logs
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action VARCHAR(100),
  details TEXT,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Enable RLS
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own notes"
  ON notes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own notes"
  ON notes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own logs"
  ON audit_logs FOR SELECT USING (auth.uid() = user_id);
```

3. **Configure Supabase Auth**
- Enable Email/Password authentication
- Configure email templates
- Set up redirect URLs

### Netlify Deployment

1. **Connect Repository**
- Push code ke GitHub
- Connect GitHub repo ke Netlify

2. **Environment Variables**
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

3. **Build Settings**
- Build command: `npm run build`
- Publish directory: `dist`

---

## 🚀 Penggunaan

### Authentication

**Sign Up**
```
1. Klik tombol "Daftar di sini"
2. Masukkan email dan password (min 6 karakter)
3. Verifikasi email yang dikirimkan ke inbox
4. Login dengan akun baru Anda
```

**Login**
```
1. Masukkan email dan password
2. Sistem akan authenticate via JWT
3. Session akan disimpan di browser
```

### Membuat Catatan

```
1. Klik "Buat Catatan Baru"
2. Masukkan judul catatan
3. Tulis isi catatan
4. Pilih kategori (optional)
5. Enable enkripsi jika ingin (optional)
6. Klik "Simpan"
```

### Enkripsi Catatan

```
1. Enable checkbox "Enkripsi catatan ini"
2. Masukkan kunci enkripsi (minimal 6 karakter)
3. Catat/ingat kunci Anda (tidak bisa di-recover!)
4. Klik "Simpan"
```

### Membuka Catatan Terenkripsi

```
1. Klik "Edit" pada catatan terenkripsi
2. Modal "Buka Catatan Terenkripsi" akan muncul
3. Masukkan kunci enkripsi yang benar
4. Klik "Buka" untuk decrypt dan edit
```

### Mencari Catatan

```
1. Gunakan search box "🔍 Cari catatan..."
2. Cari berdasarkan judul atau konten
3. Hasil akan di-filter secara real-time
```

---

## 📊 Database Schema

### Tabel: notes

| Kolom | Type | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY | Reference ke auth.users |
| title | VARCHAR(255) | NOT NULL | Judul catatan |
| content | TEXT | NOT NULL | Isi catatan (encrypted/plain) |
| category | VARCHAR(50) | - | Kategori catatan |
| is_encrypted | BOOLEAN | DEFAULT false | Flag enkripsi |
| created_at | TIMESTAMP | DEFAULT NOW() | Waktu pembuatan |
| updated_at | TIMESTAMP | DEFAULT NOW() | Waktu update terakhir |

### Tabel: audit_logs

| Kolom | Type | Constraint | Deskripsi |
|-------|------|-----------|-----------|
| id | UUID | PRIMARY KEY | Unique identifier |
| user_id | UUID | FOREIGN KEY | Reference ke auth.users |
| action | VARCHAR(100) | - | CREATE_NOTE, UPDATE_NOTE, DELETE_NOTE |
| details | TEXT | - | Detail informasi action |
| ip_address | VARCHAR(45) | - | IP address user |
| created_at | TIMESTAMP | DEFAULT NOW() | Timestamp action |

---

## 🔌 API Endpoints

### Authentication

```
POST /auth/v1/signup
  - Create new user account
  - Body: { email, password }

POST /auth/v1/signin
  - Login user
  - Body: { email, password }

POST /auth/v1/logout
  - Logout user
```

### Notes CRUD

```
GET /rest/v1/notes?select=*
  - Get all notes (RLS enforced)
  - Headers: Authorization: Bearer {token}

POST /rest/v1/notes
  - Create new note
  - Body: { title, content, category, is_encrypted }

PATCH /rest/v1/notes?id=eq.{noteId}
  - Update note
  - Body: { title, content, category, is_encrypted }

DELETE /rest/v1/notes?id=eq.{noteId}
  - Delete note
```

### Audit Logs

```
GET /rest/v1/audit_logs?select=*
  - Get user's audit logs (RLS enforced)
  - Headers: Authorization: Bearer {token}

POST /rest/v1/audit_logs
  - Log action (automatic)
  - Body: { action, details, ip_address }
```

---

## 🌐 Deployment

### Netlify

1. **Connect GitHub Repository**
```bash
# Push ke GitHub
git push origin main
```

2. **Setup di Netlify**
- Go to [netlify.com](https://netlify.com)
- Click "New site from Git"
- Select GitHub repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`

3. **Environment Variables**
- Go to Site settings → Build & deploy → Environment
- Add variables:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_ANON_KEY`

4. **Deploy**
- Netlify akan auto-deploy setiap push ke main branch

### Vercel (Alternative)

```bash
npm install -g vercel
vercel
# Follow interactive setup
```

---

## 🧪 Testing

### Unit Tests

```bash
npm run test
```

### E2E Tests

```bash
npm run test:e2e
```

### Security Testing

```bash
npm run audit
```

### Build Test

```bash
npm run build
npm run preview
```

---

## 🤝 Kontribusi

Kami menerima kontribusi dari komunitas! Berikut cara berkontribusi:

1. **Fork Repository**
```bash
git clone https://github.com/your-username/catatan-aman-cloud.git
```

2. **Create Feature Branch**
```bash
git checkout -b feature/amazing-feature
```

3. **Commit Changes**
```bash
git commit -m 'Add amazing feature'
```

4. **Push ke Branch**
```bash
git push origin feature/amazing-feature
```

5. **Open Pull Request**
- Jelaskan perubahan dan alasan
- Reference related issues

### Guidelines

- Follow code style existing
- Test sebelum submit PR
- Write meaningful commit messages
- Update documentation jika perlu

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Supabase](https://supabase.com/) - Backend Infrastructure
- [CryptoJS](https://cryptojs.org/) - Encryption Library
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [Netlify](https://netlify.com/) - Hosting Platform

---
