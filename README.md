# Fleet Tracker Pro

![Fleet Tracker Badge](https://img.shields.io/badge/Status-Active-success)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=nodedotjs&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?logo=react&logoColor=black)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-PostGIS-4169E1?logo=postgresql&logoColor=white)

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
- **Unknown Device Detection** — Unregistered IoT devices appear as pulsing red "?" markers with a Quick Register button.
- **Vehicle Management** — Full CRUD interface for fleet management with real-time sync.
- **Supercharged UI** — React Query for instant loading, WebSocket-buffered state updates (500ms flush cycle), viewport-based spatial filtering, and IndexedDB tile caching.

---

## System Architecture

Fleet Tracker operates as a three-tier system: **IoT Ingest Layer** (TCP socket server), **Application Layer** (REST API + WebSocket broadcaster + Geofence Engine), and **Client Layer** (React SPA dashboard).

```mermaid
graph TD
    subgraph "IoT Devices"
        T1["GPS Tracker 1<br/>(AEPL Protocol)"]
        T2["GPS Tracker 2<br/>(JSON Protocol)"]
    end

    subgraph "Backend Server — Node.js + Express"
        TCP["TCP Socket Server<br/>(Port 5000)"]
        PARSER["Data Parser<br/>(AEPL $1 + JSON)"]
        BUFFER["Write Buffer<br/>(2-min flush cycle)"]
        CACHE["Vehicle Cache<br/>(Registered IMEI Set)"]
        GEO["Geofence Engine<br/>(PostGIS ST_Contains)"]
        API["REST API<br/>(Port 5001)"]
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

    %% IoT → Backend Flow
    T1 -- "Raw TCP: $1,AEPL,..." --> TCP
    T2 -- "JSON TCP Stream" --> TCP
    TCP --> PARSER
    PARSER --> CACHE

    CACHE -- "Registered IMEI" --> BUFFER
    CACHE -- "Registered IMEI" --> GEO
    CACHE -- "Unknown IMEI" --> WS

    BUFFER -- "Batch Persist (2 min)" --> PRISMA
    GEO -- "ST_Contains Check<br/>(Throttled: 1km + 5min)" --> PRISMA

    %% API Flow
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
    RQ <--> API
    WSC -- "500ms flush" --> UI
    MAP <--> UI
    MAP --> OSM
    UI --> NOM
    API --> FUEL
```

### Data Flow Summary

| Step | Component | Description |
|------|-----------|-------------|
| 1 | **TCP Server** | Accepts raw GPS data from IoT devices on port `5000` (supports both `$1,AEPL,...` protocol and JSON payloads) |
| 2 | **Data Parser** | Parses IMEI, lat/lng, speed, heading, altitude, ignition, battery voltage, and timestamp from raw data |
| 3 | **Vehicle Cache** | In-memory Set of registered IMEIs — instantly routes known vs unknown devices without DB round-trips |
| 4 | **Write Buffer** | Deduplicates per-IMEI updates (keeps latest), batch-flushes to PostgreSQL every 2 minutes via `Promise.allSettled` |
| 5 | **Geofence Engine** | PostGIS `ST_Contains` spatial queries, throttled by distance (1 km) and time (5 min) to prevent excessive DB load |
| 6 | **WebSocket Broadcaster** | Sends updates only to authorized clients (Admin sees all, Customer sees only assigned vehicles) and filters by map viewport |
| 7 | **React Dashboard** | Buffers incoming WS messages at 500ms intervals before flushing to React state, preventing UI freezing under high throughput |

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

## IoT Message Format

The TCP server accepts the following AEPL protocol format from live IoT GPS trackers:

```
$1,AEPL,0.0.1,NR,2,H,860738079276675,XXXXXXXXXX,1,24022026,085610,18.465794,N,73.782791,E,1.00,80.27,10,553.00,1.27,1.00,AIRTEL,1,1,23.20,4.20,0,O,28,404,90,110E,E0EB,,0000,00,000074,9822,*
```

### Field Mapping

| Index | Field | Example | Description |
|-------|-------|---------|-------------|
| 6 | IMEI | `860738079276675` | Unique IoT hardware identifier |
| 9 | Date | `24022026` | DDMMYYYY format |
| 10 | Time | `085610` | HHMMSS format (UTC) |
| 11 | Latitude | `18.465794` | Decimal degrees |
| 12 | Lat Direction | `N` | North/South |
| 13 | Longitude | `73.782791` | Decimal degrees |
| 14 | Lng Direction | `E` | East/West |
| 15 | Speed | `1.00` | km/h |
| 16 | Heading | `80.27` | Degrees |
| 17 | Altitude | `10` | Meters |

The server also accepts JSON-format messages: `{ "imei": "...", "lat": ..., "lng": ..., "timestamp": "..." }`

---

## Project Structure

```
fleetTracker/
├── server/                         # Backend (Node.js + Express + TypeScript)
│   ├── prisma/
│   │   └── schema.prisma           # Database schema (5 tables + PostGIS)
│   ├── src/
│   │   ├── config/config.ts        # Environment configuration
│   │   ├── controllers/            # Request handlers
│   │   │   ├── user.controllers.ts
│   │   │   ├── vehicle.controllers.ts
│   │   │   ├── location.controllers.ts
│   │   │   ├── geofence.controllers.ts
│   │   │   └── vehicleCompliance.controllers.ts
│   │   ├── dbQuery/                # Prisma database queries
│   │   │   ├── dbInit.ts
│   │   │   ├── user.dbquery.ts
│   │   │   ├── vehicle.dbquery.ts
│   │   │   ├── location.dbquery.ts
│   │   │   ├── geofence.dbquery.ts
│   │   │   └── vehicleCompliance.dbquery.ts
│   │   ├── dto/                    # Zod validation schemas
│   │   ├── middleware/             # Auth + validation middleware
│   │   ├── routes/                 # Express route definitions
│   │   ├── services/
│   │   │   ├── tcp/                # TCP socket server + AEPL parser + write buffer
│   │   │   ├── tracker/            # Tracker logic + vehicle IMEI cache
│   │   │   ├── websocket/          # WS server + connection manager
│   │   │   └── logger/             # Winston logger
│   │   ├── types/                  # TypeScript type definitions
│   │   ├── utils/                  # Helpers (auth, API response, async handler)
│   │   ├── app.ts                  # Express app setup
│   │   └── index.ts                # Server entry point
│   ├── docker-compose.yml          # Docker orchestration
│   ├── Dockerfile                  # Production Docker image
│   └── nginx.conf                  # Reverse proxy config
│
├── frontend/                       # Frontend (React + Vite + TailwindCSS)
│   ├── src/
│   │   ├── components/
│   │   │   ├── MapView.jsx         # Leaflet map with markers, geofences, playback, draw
│   │   │   ├── VehicleList.jsx     # Left panel vehicle list with status indicators
│   │   │   ├── VehicleCard.jsx     # Individual vehicle card component
│   │   │   ├── GeofencePanel.jsx   # Geofence CRUD management panel
│   │   │   ├── ReportsPanel.jsx    # Fuel compliance reports with live rate
│   │   │   ├── AnalyticsPanel.jsx  # Daily summary + idling + historical logs
│   │   │   ├── AuthOverlay.jsx     # Login/Signup overlay (role selection)
│   │   │   ├── Sidebar.jsx         # Navigation sidebar
│   │   │   ├── VehicleManagementPanel.jsx  # Fleet CRUD management
│   │   │   ├── SettingsPanel.jsx   # App settings
│   │   │   ├── NotificationsPanel.jsx      # Geofence breach alerts
│   │   │   ├── AddressCell.jsx     # Reverse geocoded address display
│   │   │   └── UserProfileCard.jsx # User info display
│   │   ├── context/
│   │   │   ├── AuthContext.jsx     # JWT auth state + WS connection lifecycle
│   │   │   └── HistoryContext.jsx  # Route history state management
│   │   ├── hooks/
│   │   │   └── useQueries.js       # React Query hooks for all API endpoints
│   │   ├── services/
│   │   │   ├── api.js              # Axios HTTP client
│   │   │   ├── websocket.js        # WebSocket client with event emitter
│   │   │   └── tileCache.js        # IndexedDB tile caching for offline support
│   │   ├── utils/
│   │   │   └── geoUtils.js         # Haversine distance + geo calculations
│   │   ├── App.jsx                 # Main dashboard layout + WS event wiring
│   │   ├── main.jsx                # React entry point with QueryClientProvider
│   │   └── index.css               # TailwindCSS + custom styles
│   ├── vite.config.js              # Vite build configuration
│   └── tailwind.config.js          # TailwindCSS configuration
│
└── README.md                       # This file
```

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (with PostGIS extension installed for geofence geometry)
- **NPM** or **Yarn**

### 1. Database Setup
Ensure you have a PostgreSQL database running and accessible. Enable PostGIS:
```sql
CREATE EXTENSION IF NOT EXISTS postgis;
```
Configure your database URL in the backend's environment variables.
The standard format is:
`DATABASE_URL="postgresql://user:password@localhost:5432/fleet_db?schema=public"`

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL, JWT_SECRET, etc.
   ```
4. Generate the Prisma Client and migrate the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
5. Start the backend development server (this starts the HTTP API on port 5001, TCP server on port 5000, and WebSocket server):
   ```bash
   npm run dev
   ```

### 3. Frontend Setup
1. Open a new terminal instance and navigate to the frontend folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development mode:
   ```bash
   npm run dev
   ```

### 4. Access the App
Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

### 5. Connect IoT Device (Optional)
Send GPS data to the TCP server on port `5000`:
```bash
# Using netcat
echo '$1,AEPL,0.0.1,NR,2,H,860738079276675,XXXXXXXXXX,1,24022026,085610,18.465794,N,73.782791,E,1.00,80.27,10,553.00,1.27,1.00,AIRTEL,1,1,23.20,4.20,0,O,28,404,90,110E,E0EB,,0000,00,000074,9822,*' | nc localhost 5000

# Or JSON format
echo '{"imei":"860738079276675","lat":18.465794,"lng":73.782791}' | nc localhost 5000
```

---

## Docker Deployment

```bash
cd server
docker-compose up --build
```

This starts PostgreSQL (with PostGIS), the Node.js backend, and Nginx reverse proxy.

---

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, Vite, TailwindCSS, React Query, React-Leaflet, Leaflet Draw |
| **Backend** | Node.js, Express.js, TypeScript, native `net` TCP sockets, `ws` WebSockets |
| **Database** | PostgreSQL + PostGIS, Prisma ORM |
| **Auth** | JWT (jsonwebtoken), bcrypt, httpOnly cookies |
| **DevOps** | Docker, Docker Compose, Nginx |
| **External** | OpenStreetMap tiles, Nominatim geocoding, GoodReturns/NDTV fuel price scraping |

---

## Map Providers

The application uses **OpenStreetMap** tiles via Leaflet with **IndexedDB tile caching** for offline support. Google Maps can be integrated by swapping the tile layer URL and adding a Google Maps API key to the `CachedTileLayer` configuration in `MapView.jsx`.

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5001` | HTTP API server port |
| `TCP_PORT` | `5000` | TCP socket server port for IoT devices |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `JWT_SECRET` | `your-default-secret-key` | Secret for JWT token signing |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiry duration |
| `COOKIE_SECRET` | `your-cookie-secret` | Secret for cookie signing |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allowed origin(s), comma-separated |
| `NODE_ENV` | `development` | Environment mode |
