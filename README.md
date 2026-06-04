# 📱 Brandly Mobile App — Creator Affiliate Console & Ledger

This is the premium mobile application frontend for the **Brandly** platform. Built using **Expo Router**, React Native, and custom HSL glassmorphic design assets, this app provides real-time partnership channels, marketing kit generation, product restrictions, and analytics dashboards for creators and vendors.

---

## 🎨 Branding & Identity

- **Name**: Brandly
- **Branding Assets**: Neon affliate logo merged with an interactive digital bridge (`assets/images/brandly_logo.png`).
- **Styles**: Glassmorphic and linear gradient components utilizing tailwind/DesignSystem design tokens. All views are encapsulated under a `<MeshBackground>` container.

---

## 🚀 Key Features

### 1. Vendor Operations
- **Overview Deck**: Pulse indicators, 7-day revenue bar distribution, and real-time partner metrics.
- **Checkout Simulator**: Simulates transactions on the vendor's active affiliate campaigns to test responsiveness.
- **Catalog Editor**: Creating, updating, or deleting product entries isolated to the active vendor using the shared `<ProductForm>` component.
- **Moderation Deck**: Inbox for reviewing promoter requests. Approving requests generates a Track QR code card.

### 2. Influencer Operations
- **Console Deck**: Tracks balance metrics against a $500 monthly commission target milestone.
- **Market Browser**: Displays all approved products.
- **Follower constraints**: Evaluates and displays locks if the influencer does not meet the vendor's required followers limit.
- **Promoter Slot Caps**: Displays closed status badges if vendor campaign slots are filled.
- **Affiliate tracking**: Simulates Stripe sandbox checkout links and referral codes (`BL-*` format).

---

## ⚙️ How to Start the App

### Prerequisites
Make sure you have Node dependencies installed and are inside the `apps/mobile` directory.

### Run Development server
```bash
npm run web
```
The Metro Bundler will compile components and serve the mobile web wrapper on `http://localhost:8081`.

---

## 🧪 TypeScript Compilation
Ensure strict type rules are checked before commits:
```bash
npx tsc --noEmit
```
All components build clean with zero warnings or errors.
