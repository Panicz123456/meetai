# MeetAI

**MeetAI** to nowoczesna aplikacja do prowadzenia rozmów w czasie rzeczywistym z udziałem **customowych agentów AI**, umożliwiająca:

- połączenia audio-wideo z udziałem AI,
- automatyczne generowanie **transkryptów i podsumowań spotkań** w tle,
- pełne doświadczenie po rozmowie: **odtwarzanie nagrań**, **przeszukiwanie transkryptów**, oraz **chat z AI**, który rozumie kontekst spotkania.

---

## 🧠 Funkcjonalności

- ✅ Połączenia wideo z asystentem AI
- 📝 Generowanie transkryptów i podsumowań spotkań (background jobs)
- 🔍 Przeszukiwanie treści spotkania
- 🤖 Chat AI z kontekstem historycznym rozmowy
- 📼 Odtwarzanie nagranych spotkań
- 🔐 Uwierzytelnianie i autoryzacja użytkowników
- 🌗 Obsługa motywów (dark/light)

---

## ⚙️ Technologie

### 🧩 Framework & UI

- **Next.js** — główny framework frontendowy (SSR + API)
- **React 19** — nowoczesny interfejs użytkownika
- **Tailwind CSS** + **Radix UI** — szybkie i dostępne komponenty UI
- **Lucide-react** — ikony SVG

### 📞 Komunikacja w czasie rzeczywistym

- **@stream-io/video-react-sdk** — integracja połączeń wideo
- **@stream-io/openai-realtime-api** — AI reagujące w czasie rzeczywistym
- **stream-chat / stream-chat-react** — czatowanie z AI oraz między użytkownikami

### 🤖 Sztuczna inteligencja

- **OpenAI SDK** — dostęp do modeli GPT
- **AI podsumowania i analizy transkryptów** (z wykorzystaniem background jobs)

### 💾 Backend & Baza danych

- **Drizzle ORM** — typowany ORM dla TypeScript
- **Neon** — serwerless baza danych PostgreSQL
- **Inngest** — background jobs / task scheduling (np. generowanie transkryptów)

### 🔐 Autoryzacja

- **Better-auth / @polar-sh** — bezpieczne uwierzytelnianie i zarządzanie sesjami

### 📊 Inne

- **React Query + TRPC** — komunikacja klient–serwer
- **Zod** — walidacja danych
- **React Hook Form** — obsługa formularzy
- **Embla Carousel, recharts, day-picker** — komponenty UI i interaktywne elementy

---

## 🛠️ Uruchamianie lokalnie

```bash
# Instalacja zależności
npm install

# Start w trybie developerskim
npm run dev

# Budowanie projektu
npm run build
npm start

# Synchronizacja schematu DB
npm run db:push

# Panel do eksploracji DB (Drizzle Studio)
npm run db:studio
