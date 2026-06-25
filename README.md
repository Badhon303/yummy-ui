# Yummy Bakery — Frontend

A production-quality, fully responsive **frontend** for a multi-outlet online bakery, built with **Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + GSAP**.

> Frontend only. All data is mocked and every "API" call is stubbed behind a thin layer (`src/lib/api.ts`) so a real backend + admin dashboard can be added later **without touching the UI**.

## Features

- **Multi-outlet** — outlet picker (first-visit modal + header), per-outlet pricing & availability, stored in `localStorage`.
- **Guest ordering** — full cart → checkout → confirmation flow with **no login required**.
- **Delivery & pickup** — pickup is tied to the selected outlet.
- **Animations** — GSAP ScrollTrigger (hero parallax, animated stat counters) + Framer Motion (page reveals, hover, cart drawer, modals). Respects `prefers-reduced-motion`.
- **Pages** — Home, Shop (filter/search/sort), Product detail (gallery + variants), Cart, Checkout, Order confirmation, Outlets, About, Contact, 404.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run build && npm start   # production build
```

## Project structure

```
src/
  app/                 # routes (App Router)
    page.tsx           # home
    shop/ product/ cart/ checkout/ order-confirmation/
    outlets/ about/ contact/ not-found.tsx
  components/          # UI + layout + section components
  context/             # CartContext, OutletContext (localStorage)
  data/                # mock data: products, outlets, categories, testimonials
  lib/                 # types, api (swap point for backend), formatting
public/products/       # product images
```

## Wiring a real backend later

Replace the function bodies in `src/lib/api.ts` (e.g. `getProducts`, `placeOrder`) with real `fetch` calls. All functions are already `async` and typed via `src/lib/types.ts`, so UI components need **no changes**.

## Customising the look

- **Colors & fonts** — edit the theme tokens in `tailwind.config.ts` (`cream`, `caramel`, `choco`, `berry`, `pistachio`) and the fonts in `src/app/layout.tsx`.
- **Currency** — prices are in Bangladeshi Taka (৳) via `formatTaka` in `src/lib/format.ts`.

## Replacing product images

Drop your PNG/JPG files into `public/products/` using the same filenames referenced in `src/data/products.ts` (e.g. `dinner-rolls.jpg`, `chicken-puff.jpg`). No code changes needed.

## Tech

Next.js 14 · React 18 · TypeScript · Tailwind CSS 3 · Framer Motion · GSAP · lucide-react
