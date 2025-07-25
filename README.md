# GameStart - Technical Documentation

## Overview

GameStart is a Next.js-based gaming platform that allows users to browse, purchase, and manage free-to-play games. The application features a comprehensive authentication system, shopping cart functionality, credit-based payment system, and game library management.

## Tech Stack

- **Framework**: Next.js 15.3.4
- **Language**: JavaScript (JSX)
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **Authentication**: NextAuth.js (Google OAuth + Local)
- **HTTP Client**: Axios
- **Icons**: Lucide React, FontAwesome
- **Deployment**: Vercel-ready

## Architecture

### Frontend Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
├── lib/
│   ├── features/        # Redux slices
│   ├── hooks/          # Custom React hooks
│   ├── services/       # API service layer
│   └── store/          # Redux store configuration
└── middleware.js       # Next.js middleware for route protection
```

### State Management

The application uses Redux Toolkit with the following slices:

- **authSlice**: User authentication, registration, profile management, credit system
- **cartSlice**: Shopping cart management with pricing and discount calculations
- **gameSlice**: Game data management and price generation
- **searchSlice**: Search and filtering functionality
- **carouselSlice**: Featured games carousel management
- **couponSlice**: Discount coupon system (4+1 promotion)
- **gameDetailsSlice**: Individual game details
- **clickerSlice**: Cookie Clicker mini-game state

## Core Features

### Authentication System

- **Local Authentication**: Email/password registration and login
- **OAuth Integration**: Google authentication via NextAuth.js
- **Session Management**: Persistent sessions with automatic OAuth user sync
- **Protected Routes**: Middleware-based route protection for `/profile`, `/checkout`, `/library`

### Credit System

- **Credit Balance**: Users can add credits to their account
- **Dual Payment**: Choose between credit balance or banking card at checkout
- **Automatic Deduction**: Credits are automatically deducted for credit-based purchases
- **Balance Validation**: Insufficient credit balance disables credit payment option

### Shopping Cart

- **Persistent Storage**: Cart data stored in JSON file (`cart.json`)
- **Dynamic Pricing**: Consistent price generation based on game ID
- **Discount System**: Individual game discounts (10-30%) and bulk purchase promotions
- **4+1 Promotion**: Buy 4 games, get the cheapest one free

### Game Management

- **External API Integration**: FreeToGame API for game data
- **Price Generation**: Deterministic pricing algorithm based on game ID
- **Filtering**: By category, platform, and search terms
- **Game Details**: Comprehensive game information with video playback

### User Profile

- **Profile Management**: Update name, email, and description
- **Purchase History**: Track all purchased games
- **Library Access**: View and manage purchased games
- **Credit Management**: Add credits and view balance

## API Endpoints

### External API (FreeToGame)

- `/api/games`: All free-to-play games
- `/api/games/game?id={id}`: Specific game details
- `/api/games?category={category}`: Games by category
- `/api/games?platform={platform}`: Games by platform
- `/api/games?sort-by={sort}`: Sorted games

### Internal API Routes

#### Authentication

- `POST /api/users/auth`: Local authentication
- `POST /api/users/oauth`: OAuth user synchronization
- `POST /api/users/update`: User registration/profile update

#### User Management

- `GET /api/users/lookup`: Find user by email
- `POST /api/users/add-credits`: Add credits to account
- `POST /api/users/purchase`: Purchase with banking card
- `POST /api/users/purchase-with-credits`: Purchase with credit balance

#### Cart Management

- `GET /api/cart`: Retrieve cart items
- `POST /api/cart/add`: Add game to cart
- `DELETE /api/cart/remove`: Remove game from cart

#### Game Data

- `GET /api/games`: Proxy to FreeToGame API

## Data Storage

### File-based Storage

- `users.json`: User accounts, profiles, and purchase history
- `cart.json`: Shopping cart data

### Session Storage

- NextAuth.js sessions for OAuth authentication
- Redux store for application state

## Key Algorithms

### Price Generation

```javascript
// Deterministic pricing based on game ID
const generatePrice = (gameId) => {
  const seed = parseInt(gameId, 10);
  const basePrice = ((seed % 95) + 5 + 0.99).toFixed(2);
  const hasDiscount = seed % 5 === 0;
  const discount = hasDiscount ? Math.floor(seed % 21) + 10 : 0;
  // Returns consistent pricing for each game
};
```

### Coupon System

- **4+1 Promotion**: Automatically applies when cart has 5+ items
- **Discount Calculation**: Removes cheapest game price from total
- **Real-time Updates**: Cart total updates automatically

## Security Features

- **Route Protection**: Middleware-based authentication checks
- **OAuth Security**: Secure Google authentication flow
- **Input Validation**: Server-side validation for all user inputs
- **Error Handling**: Comprehensive error handling and user feedback

## Performance Optimizations

- **Image Optimization**: Next.js built-in image optimization
- **API Proxy**: Efficient proxying to external APIs
- **State Management**: Optimized Redux store with selective updates

## Development Setup

1. **Install Dependencies**: `npm install`
2. **Environment Variables**: Configure NextAuth.js and Google OAuth credentials
3. **Development Server**: `npm run dev`
4. **Build**: `npm run build`
5. **Production**: `npm start`

## Environment Variables

```env
GOOGLE_ID=your_google_oauth_client_id
GOOGLE_SECRET=your_google_oauth_client_secret
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000 | vercel.app
```

## Color Palette

```css
--color-rosy: #bf988a;
--color-ivory: #f6f3ee;
--color-plum: #7c5e6a;
--color-pine: #247c6d;
--color-moss: #a3b18a;
--color-copper: #b87333;
--color-midnight: #031c26;
--color-slate: #475569;
```
