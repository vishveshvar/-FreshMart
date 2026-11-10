# FreshMart

A responsive, frontend-only grocery shopping and store management demo. FreshMart uses seeded Indian grocery data, simulated customer and payment flows, and browser LocalStorage for all app changes.

## Stack

React, JavaScript, Vite, React Router, Context API, Lucide React, Recharts, and React Hot Toast. No server, database, API keys, or real payment service is needed. Product photography is loaded from Unsplash; an internet connection is needed for those images and the hosted font.

## Features

- Customer storefront with 60+ grocery products, category browsing, search, filters, sort, product details, deals, and recently viewed items.
- Stock-aware cart, delivery threshold pricing, wishlist, simulated checkout, generated orders, order history, reorder, and tracking timeline.
- Editable local customer profile and transparent rule-based recommendations using preferences, browsing, cart, and order activity.
- An “AI Smart Picks” navigation item, homepage grocery assistant, persistent rule-based chat panel, smart basket pairings, replenishment prompts, and profile shopping insights.
- Admin overview, product add/edit/delete, stock adjustments and low stock states, order status view, customer directory, and analytics charts.
- Responsive desktop and mobile layouts. Reset demo data from the profile page.

## Run locally

Install Node.js LTS, then from this directory:

```bash
npm install
npm run dev
```

Vite prints the local URL (usually `http://localhost:5173`). Create a production build with `npm run build`, or preview it with `npm run preview`.

## Local data and demo behavior

The app seeds product and order data on first use and then saves products, cart, orders, wishlist, profile, browsing history, and activity history under `freshmart_*` keys in the current browser. Data survives refreshes in that browser and does not sync to another device. Use **Profile → Reset demo data** to clear FreshMart demo keys and reload the original sample data.

Checkout creates a local order, decrements inventory, and clears the cart. Payment options are demonstrations only; no payment is collected. Admin is an unauthenticated demonstration area.

Recommendations use a transparent browser-side score from preferred categories, browsing, past order categories, and current cart categories. Unavailable products are excluded. This is rule-based personalization, not an external AI service or trained model.

## Project structure

```text
src/
  App.jsx       Store context, storefront pages, checkout, recommendations, admin
  data.js       Product catalog, categories, and starter orders
  index.css     Responsive storefront and admin styles
  main.jsx      React and router entry point
```

All app logic and data are frontend-only; Vite/Node are used only for local development and builds.
