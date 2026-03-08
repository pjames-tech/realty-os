# RealtyOS

**Zero-latency lead engagement system** that qualifies, tags, and books appointments automatically.

RealtyOS is a full-stack real estate lead management platform with an AI-powered chatbot (Sloane), automated lead qualification, and client self-service portal.

## Features

- **Smart Inquiry Form** — Multi-step property search form that captures budget, location, property type, and timeline
- **AI Assistant (Sloane)** — Floating chat widget that guides visitors, answers questions, and provides direct navigation
- **Admin Dashboard** — Real-time lead feed, qualification details, appointment tracking, and manual entry
- **Client Portal** — Self-service portal for leads to check their qualification status and booking links
- **Auto-Qualification** — AI-powered lead scoring and qualification pipeline
- **Theme Support** — Light and dark mode with persistent user preference

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **AI:** OpenAI API
- **Styling:** Vanilla CSS with glassmorphism design system
- **Fonts:** Inter + Space Grotesk (Google Fonts)

## Getting Started

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Project Structure

```
app/
├── page.tsx              # Landing page
├── layout.tsx            # Root layout with fonts & theme
├── globals.css           # Design system & all styles
├── inquiry/              # Property inquiry form
├── portal/               # Client self-service portal
├── admin/                # Admin dashboard (protected)
└── api/                  # API routes (leads, auth, chat)

components/
├── public-landing.tsx    # Landing page UI
├── inquiry-form.tsx      # Multi-step inquiry form
├── admin-shell.tsx       # Admin layout with sidebar
├── admin-dashboard.tsx   # Dashboard with lead feed
├── client-portal.tsx     # Client qualification view
├── sloane-widget.tsx     # AI chat widget
└── ...                   # Other components
```

## License

Private — All rights reserved.
