# Smart Tourism Demo - Setup Guide

## Project Overview
A full-stack MERN (MongoDB alternative: lowdb) tourism application with marketplace, itinerary planner, chatbot, and admin dashboard.

## Tech Stack
- **Backend:** Node.js + Express + lowdb
- **Frontend:** React 19 + Leaflet (maps) + React Router
- **Database:** lowdb (file-based JSON)
- **HTTP Client:** axios
- **Styling:** CSS3

## Prerequisites
- Node.js v16+ (check with `node --version`)
- npm v8+ (check with `npm --version`)

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Create environment file
npm run dev  # Start with auto-reload (development)
# OR: npm start  # Production mode
```

**Backend runs on:** http://localhost:4000

### 2. Frontend Setup
```bash
cd frontend
npm install
npm start
```

**Frontend runs on:** http://localhost:3000

## Available Scripts

### Backend
- `npm start` - Run production server
- `npm run dev` - Run development server with auto-reload (nodemon)

### Frontend
- `npm start` - Start React dev server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from react-scripts (irreversible)

## Project Structure

```
smart-tourism-demo/
├── backend/
│   ├── server.js                 # Express server entry point
│   ├── db.json                   # lowdb database file
│   ├── package.json
│   ├── .env                      # Environment variables (git ignored)
│   ├── .env.example              # Template for .env
│   └── routes/
│       ├── attractions.js        # Attraction management
│       ├── itinerary.js          # Itinerary generation
│       ├── marketplace.js        # Marketplace & bookings
│       ├── admin.js              # Admin dashboard API
│       └── chat.js               # Chatbot endpoint
│
├── frontend/
│   ├── src/
│   │   ├── App.js                # Main app router
│   │   ├── App.css
│   │   ├── components/
│   │   │   ├── Navbar.js         # Navigation bar
│   │   │   └── RouteMap.js       # Map component (Leaflet)
│   │   └── pages/
│   │       ├── Home.js
│   │       ├── Attractions.js
│   │       ├── Itinerary.js
│   │       ├── Marketplace.js    # Product marketplace
│   │       ├── ProductDetails.js
│   │       ├── Cart.js
│   │       ├── Chatbot.js
│   │       ├── AdminDashboard.js # Admin management UI
│   │       └── Wishlist.js
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── .gitignore                    # Git ignore file

```

## Key Features

### ✅ Implemented
- **Attractions:** Browse and view tourist attractions with maps
- **Itinerary Planner:** Generate multi-day itineraries with route maps
- **Marketplace:** Buy and sell local products with cart
- **Bookings:** Track purchases with status management
- **Chatbot:** AI-powered assistant (mock/mock responses)
- **Admin Dashboard:** Manage attractions, bookings, and listings
- **Responsive Design:** Mobile-friendly UI across all pages

### 🔧 Dependencies Added
- **Backend:** `dotenv` (env vars), `nodemon` (dev auto-reload)
- **Frontend:** `date-fns` (date utilities), `react-toastify` (notifications), `lodash` (utilities)

## API Endpoints

### Attractions
- `GET /api/attractions` - List all attractions
- `POST /api/attractions` - Create attraction
- `PUT /api/attractions/:id` - Update attraction
- `DELETE /api/attractions/:id` - Delete attraction

### Itinerary
- `POST /api/itinerary/generate` - Generate itinerary for attractions
- `GET /api/itinerary` - Get all itineraries

### Marketplace
- `GET /api/marketplace/listings` - Get all products
- `GET /api/marketplace/bookings` - Get all bookings
- `POST /api/marketplace/buy` - Create booking
- `PUT /api/marketplace/bookings/:id` - Update booking status
- `PUT /api/marketplace/listings/:id` - Update listing
- `DELETE /api/marketplace/listings/:id` - Delete listing

### Admin
- `GET /api/admin/stats` - Dashboard statistics

### Chat
- `POST /api/chat` - Send message to chatbot

## Environment Variables

Create a `.env` file in the `backend` folder:

```env
PORT=4000
NODE_ENV=development
DATABASE_FILE=db.json
# OPENAI_API_KEY=your_openai_key
# GEMINI_API_KEY=your_gemini_key
```

## Troubleshooting

### Backend not starting?
```bash
# Check if port 4000 is in use
netstat -ano | findstr ":4000"

# Kill process on port 4000 (Windows)
netTaskkill /PID <PID> /F
```

### Images not loading in Marketplace?
- Check browser DevTools (F12) → Network tab
- Verify CDN URLs are accessible
- Images are seeded from Pixabay/Unsplash CDNs

### CORS errors?
- Backend has CORS enabled in `server.js`
- Frontend makes requests to `http://localhost:4000`

### Database issues?
- Delete `backend/db.json` to reset with seed data
- lowdb will auto-recreate on next server start

## Development Workflow

1. **Terminal 1 - Backend:**
   ```bash
   cd backend
   npm run dev  # Auto-reloads on file changes
   ```

2. **Terminal 2 - Frontend:**
   ```bash
   cd frontend
   npm start    # Auto-reloads on file changes
   ```

3. Open http://localhost:3000 in browser

## Future Enhancements
- Real database (MongoDB, PostgreSQL)
- User authentication (JWT)
- Real payment integration (Stripe)
- Email notifications
- Advanced search & filters
- Real AI chatbot (OpenAI/Gemini integration)
- Performance optimization & caching

## License
ISC

## Support
For issues or feature requests, review the code comments and console logs.
