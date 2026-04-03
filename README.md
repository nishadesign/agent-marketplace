# Patch

AI-native consumer marketplace for finding and booking trusted home service providers in San Francisco.

Built with Next.js, TypeScript, Tailwind CSS, and shadcn/ui.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm (comes with Node.js)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/nishadesign/agent-marketplace.git
cd agent-marketplace

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Project Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── landing/      # Landing page (patch-agent-marketplace.vercel.app/landing)
│   ├── bookings/     # Bookings page
│   ├── messages/     # Messages page
│   └── profile/      # Profile page
├── components/       # React components grouped by feature
├── data/             # Mock data (providers, bookings, messages)
└── lib/              # Utilities and shared helpers
```

## Deployment

The app is deployed on [Vercel](https://vercel.com). Pushes to `main` trigger automatic deployments.

Live: [patch-agent-marketplace.vercel.app](https://patch-agent-marketplace.vercel.app)
