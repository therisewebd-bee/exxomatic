# Exxomatic — Fleet Tracker Pro

![Fleet Tracker Badge](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white)
![Nginx](https://img.shields.io/badge/Nginx-SSL%20Proxy-009639?logo=nginx&logoColor=white)

A complete, production-grade, real-time fleet management and vehicle monitoring system. Built for high-throughput IoT data ingestion, live GPS tracking, smart geofencing, route playback, and fuel compliance reporting.

---

## Features

- **Live Real-Time Tracking** — Vehicles plotted on a Leaflet map, updated instantly via WebSockets with no page refresh.
- **IGN-Based Status Markers** — Green blinking marker when Ignition ON (moving), red blinking marker when Ignition OFF (stopped), amber for idling.
- **Smart Geofencing** — Draw custom zones (circle, polygon, rectangle) on the map using Leaflet Draw. Real-time breach alerts via WebSocket when vehicles exit assigned zones.
- **Route History & Playback** — Replay past routes with smooth interpolated animation, adjustable speed (1×/2×/5×/10×), and a scrubber timeline.
- **Vehicle Analytics** — Daily summary reports with distance (odometer), idle time, max/avg speed, running time, and detailed movement logs.
- **Fuel Compliance Reports** — Log fuel transactions with live fuel rate scraping from government sources, auto-calculated total cost, reverse-geocoded fill location, and receipt storage.
- **Role-Based Access Control** — Admin (full access to all vehicles) vs Customer (only sees assigned vehicles). JWT authentication with httpOnly cookies.
- **User Management Panel** — Admin-only panel to view, edit roles, and manage all registered users.
- **Unknown Device Detection** — Unregistered IoT devices appear as pulsing red "?" markers with a Quick Register button.
- **Vehicle Management** — Full CRUD interface for fleet management with real-time sync.
- **Supercharged UI** — React Query for instant loading, WebSocket-buffered state updates (500ms flush cycle), viewport-based spatial filtering, and IndexedDB tile caching.

---

## System Architecture

Exxomatic operates as a three-tier system: **Device Ingest Layer** (TCP socket server), **Application Layer** (REST API + WebSocket broadcaster + Geofence Engine), and **Client Layer** (React SPA dashboard). In production, all traffic is routed through an **NGINX reverse proxy** that handles SSL termination, WebSocket upgrades (`wss://`), and TCP stream proxying.

```mermaid
graph TD
    subgraph "GPS Devices"
        T1["GPS Tracker 1"]
        T2["GPS Tracker 2"]
    end

    subgraph "NGINX Reverse Proxy"
        N80["Port 80<br/>(HTTP → 301 HTTPS)"]
        N443["Port 443<br/>(SSL + API + WSS)"]
        N5000["Port 5000<br/>(TCP Stream Proxy)"]
    end

    subgraph "Backend Server — Node.js + Express"
        TCP["TCP Socket Server<br/>(Internal Port 5000)"]
        BUFFER["Write Buffer<br/>(2-min flush cycle)"]
        CACHE["Vehicle Cache<br/>(Registered IMEI Set)"]
        GEO["Geofence Engine<br/>(PostGIS ST_Contains)"]
        API["REST API<br/>(Internal Port 3000)"]
        AUTH["JWT Auth Middleware<br/>(Cookie + Bearer)"]
        WS["WebSocket Server<br/>(Authenticated)"]
        CONN["Connection Manager<br/>(Role + Viewport Filter)"]
    end

    subgraph "Data Layer"
        DB[("PostgreSQL + PostGIS")]
        PRISMA["Prisma ORM"]
    end

    subgraph "Frontend — React + Vite"
        UI["React Dashboard"]
        RQ["React Query Cache"]
        MAP["Leaflet Map<br/>(Cached Tiles + Draw)"]
        WSC["WebSocket Client<br/>(Buffered State Updates)"]
    end

    subgraph "External Services"
        OSM["OpenStreetMap Tiles"]
        NOM["Nominatim Geocoder"]
        FUEL["Fuel Price Scraper<br/>(GoodReturns / NDTV / ET)"]
    end

    %% Device → NGINX → Backend Flow
    T1 -- "TCP Data Stream" --> N5000
    T2 -- "TCP Data Stream" --> N5000
    N5000 --> TCP
    TCP --> CACHE

    CACHE -- "Registered IMEI" --> BUFFER
    CACHE -- "Registered IMEI" --> GEO
    CACHE -- "Unknown IMEI" --> WS

    BUFFER -- "Batch Persist (2 min)" --> PRISMA
    GEO -- "ST_Contains Check<br/>(Throttled: 1km + 5min)" --> PRISMA

    %% API Flow
    N443 -- "HTTPS / WSS" --> API
    API --> AUTH
    AUTH --> PRISMA
    PRISMA <--> DB

    %% Real-time Flow
    GEO -- "Breach Alert" --> WS
    BUFFER -- "Location Update" --> WS
    WS --> CONN
    CONN -- "Role-filtered +<br/>Viewport-filtered" --> WSC

    %% Frontend Flow
    UI <--> RQ
    RQ <--> N443
    WSC -- "500ms flush" --> UI
    MAP <--> UI
    MAP --> OSM
    UI --> NOM
    API --> FUEL
```

### Data Flow Summary

| Step | Component | Description |
|------|-----------|-------------|
| 1 | **TCP Server** | Accepts GPS data from tracking devices via NGINX stream proxy on port `5000` |
| 2 | **Vehicle Cache** | In-memory Set of registered IMEIs — instantly routes known vs unknown devices without DB round-trips |
| 3 | **Write Buffer** | Deduplicates per-IMEI updates (keeps latest), batch-flushes to PostgreSQL every 2 minutes via `Promise.allSettled` |
| 4 | **Geofence Engine** | PostGIS `ST_Contains` spatial queries, throttled by distance (1 km) and time (5 min) to prevent excessive DB load |
| 5 | **WebSocket Broadcaster** | Sends updates only to authorized clients (Admin sees all, Customer sees only assigned vehicles) and filters by map viewport |
| 6 | **React Dashboard** | Buffers incoming WS messages at 500ms intervals before flushing to React state, preventing UI freezing under high throughput |

### Production Traffic Flow

```
Browser (HTTPS)  →  :443 (NGINX SSL termination)  →  :3000 (Node.js internal)
GPS Device       →  :5000 (NGINX TCP stream)       →  :5000 (TCP server internal)
HTTP Request     →  :80  (NGINX)                    →  301 redirect → :443
```

---

## Database Schema

The PostgreSQL database uses **5 core tables** + **1 join table** + **PostGIS geometry** for spatial operations:

```mermaid
erDiagram
    User {
        uuid id PK
        varchar name
        varchar email UK
        varchar password
        enum role "Admin | Customer"
        timestamp createdAt
        timestamp updatedAt
    }

    VehicleInfo {
        uuid id PK
        varchar imei UK
        varchar vechicleNumb UK
        uuid customerId FK
        timestamp createdAt
        timestamp updatedAt
    }

    LocationLog {
        uuid id PK
        varchar imei FK
        decimal lat
        decimal lng
        decimal altitude
        decimal speed
        decimal heading
        float batteryVoltage
        boolean ignition
        timestamp timestamp
        timestamp createdAt
    }

    Geofence {
        uuid id PK
        varchar name
        geometry zone "PostGIS Polygon"
        varchar zoneHash UK
        boolean isActive
        timestamp createdAt
        timestamp updatedAt
    }

    VehiclesOnGeofences {
        uuid vehicleId PK_FK
        uuid geofenceId PK_FK
        timestamp assignedAt
    }

    VehicleCompliance {
        uuid id PK
        uuid vehicleId FK
        decimal fuelQuantity
        decimal fuelRate
        decimal totalCost
        decimal filledLat
        decimal filledLng
        varchar filledAddress
        varchar filledBy
        varchar receiptUrl
        timestamp filledAt
        timestamp createdAt
    }

    User ||--o{ VehicleInfo : "owns"
    VehicleInfo ||--o{ LocationLog : "has logs"
    VehicleInfo ||--o{ VehicleCompliance : "has compliance"
    VehicleInfo }o--o{ Geofence : "VehiclesOnGeofences"
```

---

## API Endpoints

All endpoints except auth are protected via JWT (`Authorization: Bearer <token>` or `fleet_token` cookie).

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/users/register` | Register a new user (name, email, password, role) |
| `POST` | `/api/users/login` | Login and receive JWT token + httpOnly cookie |

### Users (Admin Only)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/users` | Fetch all registered users |
| `PATCH` | `/api/users/:userId/role` | Update a user's role (Admin/Customer) |
| `DELETE` | `/api/users/:userId` | Delete a user account |

### Vehicles
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/vehicles` | Fetch all vehicles (filtered by role: Admin=all, Customer=own) |
| `GET` | `/api/vehicles/:vehicleId` | Fetch a specific vehicle |
| `POST` | `/api/vehicles` | Register a new vehicle (IMEI, vehicle number) |
| `PATCH` | `/api/vehicles/:vehicleId` | Update vehicle info |
| `DELETE` | `/api/vehicles/:vehicleId` | Remove a vehicle |

### Location
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/locations` | Log a location update manually |
| `GET` | `/api/locations/history` | Fetch historical location data (IMEI + date range) |
| `GET` | `/api/locations/:locationId` | Get a specific location record |
| `DELETE` | `/api/locations/:locationId` | Delete a location record |

### Geofences
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/geofences` | List all geofences |
| `GET` | `/api/geofences/check` | Check if an IMEI is inside/outside assigned geofences |
| `GET` | `/api/geofences/:geofenceId` | Get a specific geofence |
| `POST` | `/api/geofences` | Create a geofence (name, GeoJSON polygon, vehicle IDs) |
| `PATCH` | `/api/geofences/:geofenceId` | Update a geofence |
| `DELETE` | `/api/geofences/:geofenceId` | Delete a geofence |

### Fuel Compliance
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/compliance` | List all compliance records |
| `GET` | `/api/compliance/fuel/live-rate` | Fetch live petrol price by city (scrapes GoodReturns/NDTV/ET) |
| `GET` | `/api/compliance/:complianceId` | Get a specific record |
| `POST` | `/api/compliance` | Log a new fuel entry (quantity, rate, filled by, date) |
| `PATCH` | `/api/compliance/:complianceId` | Update a compliance record |
| `DELETE` | `/api/compliance/:complianceId` | Delete a compliance record |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check (returns `{ status: 'UP' }`) |

---

## Project Structure

```
exxomatic/
├── server/                              # Backend (Node.js + Express + TypeScript)
│   ├── prisma/
│   │   └── schema.prisma               # Database schema (5 tables + PostGIS)
│   ├── src/
│   │   ├── config/
│   │   │   └── config.ts               # Environment config + CORS allowed origins
│   │   ├── controllers/
│   │   │   ├── user.controllers.ts      # Auth + user management
│   │   │   ├── vehicle.controllers.ts   # Vehicle CRUD
│   │   │   ├── location.controllers.ts  # Location logging + history
│   │   │   ├── geofence.controllers.ts  # Geofence CRUD + breach checking
│   │   │   └── vehicleCompliance.controllers.ts
│   │   ├── dbQuery/
│   │   │   ├── dbInit.ts               # Database connection initialization
│   │   │   ├── user.dbquery.ts
│   │   │   ├── vehicle.dbquery.ts
│   │   │   ├── location.dbquery.ts
│   │   │   ├── geofence.dbquery.ts      # PostGIS spatial queries
│   │   │   └── vehicleCompliance.dbquery.ts
│   │   ├── dto/                         # Zod validation schemas
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts       # JWT verification
│   │   │   ├── cors.middleware.ts       # Dynamic CORS allowlist
│   │   │   ├── validate.middleware.ts   # Zod request validation
│   │   │   └── preventDuplicateRequests.ts
│   │   ├── routes/                      # Express route definitions
│   │   ├── services/
│   │   │   ├── tcp/
│   │   │   │   ├── server.ts           # TCP socket server + data parser
│   │   │   │   └── buffer.ts           # Write buffer (2-min batch flush)
│   │   │   ├── websocket/
│   │   │   │   ├── socket.ts           # WebSocket server + broadcasting
│   │   │   │   └── connectionManager.ts # Role + viewport filtering
│   │   │   ├── logger/logger.ts        # Winston structured logging
│   │   │   └── retention/retention.ts  # Data retention policy
│   │   ├── types/                       # TypeScript type definitions
│   │   ├── utils/                       # Helpers (auth, API response, fuel scraper)
│   │   ├── app.ts                      # Express app setup
│   │   ├── index.ts                    # Server entry point
│   │   └── cluster.ts                  # Multi-core cluster mode
│   ├── scripts/
│   │   ├── simulate.cjs               # Device traffic simulator
│   │   ├── simulate2.cjs              # Alternate simulator
│   │   ├── simulate_1M.cjs            # High-volume stress test
│   │   ├── seedGeofences.cjs           # Seed geofence data
│   │   ├── upgrade-users.cjs          # Bulk user role upgrade
│   │   └── diagnose.cjs               # Database diagnostics
│   ├── docker-compose.yml              # Docker orchestration
│   ├── Dockerfile                      # Multi-stage production image
│   ├── nginx.conf                      # NGINX: SSL + WSS + TCP stream
│   ├── setup-ssl.sh                    # Automated SSL setup
│   └── prisma.config.ts                # Prisma configuration
│
├── frontend/                            # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx             # Leaflet map with markers + geofences
│   │   │   ├── VehicleList.jsx         # Vehicle list with status indicators
│   │   │   ├── VehicleCard.jsx         # Vehicle card component
│   │   │   ├── GeofencePanel.jsx       # Geofence management
│   │   │   ├── ReportsPanel.jsx        # Fuel compliance reports
│   │   │   ├── AnalyticsPanel.jsx      # Analytics + daily summary
│   │   │   ├── AuthOverlay.jsx         # Login/Signup overlay
│   │   │   ├── Sidebar.jsx             # Navigation sidebar
│   │   │   ├── VehicleManagementPanel.jsx
│   │   │   ├── UserManagementPanel.jsx # Admin-only user management
│   │   │   ├── SettingsPanel.jsx
│   │   │   ├── NotificationsPanel.jsx  # Geofence breach alerts
│   │   │   ├── PlaybackControls.jsx    # Route playback controls
│   │   │   ├── HistoryDataOverlay.jsx
│   │   │   ├── AddressCell.jsx         # Reverse geocoded address
│   │   │   └── UserProfileCard.jsx
│   │   ├── components/MapComponents/
│   │   │   ├── BoundsTracker.jsx       # Viewport change tracker
│   │   │   ├── CachedTileLayer.jsx     # IndexedDB tile caching
│   │   │   ├── DrawControl.jsx         # Leaflet Draw shapes
│   │   │   └── FlyToVehicle.jsx        # Animated map focus
│   │   ├── components/ui/              # Reusable UI primitives
│   │   │   ├── DataTable.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── PanelLayout.jsx
│   │   │   ├── SearchableMultiSelect.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── context/
│   │   │   ├── AuthContext.jsx         # JWT auth state + WS lifecycle
│   │   │   └── HistoryContext.jsx      # Route history state
│   │   ├── hooks/
│   │   │   ├── useQueries.js           # Core React Query hooks
│   │   │   ├── useVehicleQueries.js
│   │   │   ├── useGeofenceQueries.js
│   │   │   ├── useComplianceQueries.js
│   │   │   ├── useUserQueries.js
│   │   │   ├── useGeolocation.js
│   │   │   ├── useMapLogic.jsx         # Map interaction logic
│   │   │   └── useWebSocketVehicles.js # WS vehicle state
│   │   ├── services/
│   │   │   ├── api.js                  # Axios HTTP client
│   │   │   ├── websocket.js            # WebSocket client
│   │   │   └── tileCache.js            # IndexedDB tile caching
│   │   ├── lib/
│   │   │   ├── queryClient.js          # React Query config
│   │   │   └── queryKeys.js            # Centralized query keys
│   │   ├── utils/
│   │   │   ├── geoUtils.js             # Haversine + geo calculations
│   │   │   └── mapIcons.jsx            # Custom marker icons
│   │   ├── App.jsx                     # Main dashboard layout
│   │   ├── main.jsx                    # React entry point
│   │   └── index.css                   # TailwindCSS + custom styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── netlify.toml                    # Netlify deployment config
│   └── postcss.config.js
│
└── README.md
```

---

## Getting Started

### Prerequisites
- **Node.js** (v22+)
- **PostgreSQL** (with PostGIS extension)
- **NPM** or **Yarn**
- **Docker & Docker Compose** (for production deployment)

### 1. Database Setup
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```
Configure: `DATABASE_URL="postgresql://user:password@localhost:5432/fleet_db?schema=public"`

### 2. Backend Setup
```bash
cd server
npm install
cp .env.example .env        # Edit with your DATABASE_URL, JWT_SECRET, FRONTEND_URL
npx prisma generate
npx prisma migrate dev --name init
npm run dev                  # Starts API on :3000, TCP on :5000, WS server
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Edit .env: VITE_API_URL=http://localhost:3000, VITE_WS_URL=ws://localhost:3000
npm run dev                  # Starts on :5173
```

---

## Production Docker Deployment (AWS / VPS)

Runs behind **NGINX reverse proxy** with SSL termination, WSS upgrades, and TCP stream proxying.

| Port | Service | Purpose |
|------|---------|---------|
| `80` | NGINX | ACME challenge + HTTP → HTTPS redirect |
| `443` | NGINX | SSL → proxies to internal `:3000` (API + WSS) |
| `5000` | NGINX stream | TCP passthrough → internal `:5000` (IoT data) |

### Steps

```bash
# 1. Configure .env with production DATABASE_URL, JWT_SECRET, FRONTEND_URL
cd server && nano .env

# 2. Start app + nginx
sudo docker-compose up -d app nginx

# 3. Generate SSL cert (ports 80/443 must be open in security group)
sudo docker-compose run --rm certbot

# 4. Restart nginx to load new certificate
sudo docker-compose restart nginx

# 5. Verify
curl https://your-domain.duckdns.org/health
```

### SSL Renewal (every 90 days)
```bash
sudo docker-compose run --rm certbot
sudo docker-compose restart nginx
```

---

## Utility Scripts

Located in `server/scripts/`:

| Script | Description |
|--------|-------------|
| `simulate.cjs` | Simulates IoT GPS device traffic |
| `simulate2.cjs` | Alternative simulator |
| `simulate_1M.cjs` | High-volume stress test (1M points) |
| `seedGeofences.cjs` | Seeds sample geofence polygons |
| `upgrade-users.cjs` | Bulk upgrade user roles |
| `diagnose.cjs` | Database connection diagnostics |

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Query, React-Leaflet, Leaflet Draw, Recharts |
| **Backend** | Node.js 22, Express.js, TypeScript, native `net` TCP sockets, `ws` WebSockets |
| **Database** | PostgreSQL + PostGIS, Prisma ORM |
| **Auth** | JWT (jsonwebtoken), bcrypt, httpOnly cookies |
| **Infra** | Docker, Docker Compose, NGINX (SSL + stream + reverse proxy), Certbot (Let's Encrypt) |
| **Hosting** | AWS EC2 (backend), Netlify (frontend), DuckDNS (dynamic DNS) |
| **External** | OpenStreetMap tiles, Nominatim geocoding, GoodReturns/NDTV fuel price scraping |

---

## Environment Variables

### Backend (`server/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP API server port |
| `TCP_PORT` | `5000` | TCP socket server port for IoT devices |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `JWT_SECRET` | — | Secret for JWT token signing |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiry duration |
| `FRONTEND_URL` | `https://exxomatic.netlify.app` | CORS allowed origin |
| `NODE_ENV` | `development` | Environment mode |
| `LOG_LEVEL` | `info` | Winston logging level |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:3000` | Backend API base URL |
| `VITE_WS_URL` | `ws://localhost:3000` | WebSocket connection URL |

---

## Map Providers

Uses **OpenStreetMap** tiles via Leaflet with **IndexedDB tile caching** for offline support. Google Maps can be integrated by swapping the tile layer URL in `CachedTileLayer.jsx`.

---

## License

⚠️ **This software is proprietary and confidential.**

All rights reserved by **The Rise**. Unauthorized copying, modification, distribution, or use of this software is strictly prohibited and may result in legal action.

See the full [LICENSE](./LICENSE) file for details.

> **WARNING:** If you download, copy, modify, or use this software without explicit written permission, you do so at your own risk. The copyright holders accept no liability and reserve the right to pursue legal action against any unauthorized use.
