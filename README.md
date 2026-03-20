# Fleet Tracker Pro
![Fleet Tracker Badge](https://img.shields.io/badge/Status-Active-success)

A complete, full-stack, real-time fleet management and vehicle monitoring system. Built with performance and real-time data flow in mind, it provides live tracking, historical playback, and smart geofencing capabilities.

---

## Features

- **Live Real-Time Tracking**: Watch your vehicles move on a high-performance Leaflet map updated instantly via WebSockets.
- **Smart Geofencing**: Draw custom polygon zones directly on the map. Get instant breach alerts when vehicles enter or leave a zone.
- **Analytics & History Playback**: Replay past routes and review vehicle performance metrics.
- **Vehicle Management**: Full CRUD interface for your fleet, beautifully synchronized across the dashboard without page reloads.
- **Compliance & Reporting**: Log fuel transactions, fetch live fuel rates, and generate summaries.
- **Supercharged UI**: Powered by React Query for instant loading times and smart background data fetching.

---

## System Architecture

Fleet Tracker consists of three primary layers: the TCP ingest server for IoT devices, the backend REST API & WebSocket broadcaster, and the React frontend dashboard.

```mermaid
graph TD
    subgraph IoT Devices
        T1[GPS Tracker 1]
        T2[GPS Tracker 2]
    end

    subgraph Backend Server - Node.js + Express
        TCP[TCP Socket Ingest]
        API[REST HTTP API]
        WS[WebSocket Broadcaster]
        GEO[Geofence Engine / PostGIS]
    end

    subgraph Data Layer
        DB[(PostgreSQL + PostGIS)]
        PRISMA[Prisma ORM]
    end

    subgraph Frontend - React + Vite
        UI[React Dashboard]
        RQ[React Query Cache]
        MAP[Leaflet Map UI]
    end

    %% Flow
    T1 -- Raw GPS TCP Stream --> TCP
    T2 -- Raw GPS TCP Stream --> TCP
    
    TCP -- Parse & Validate --> DB
    TCP -- Breach Checks --> GEO
    TCP -- Live Updates --> WS
    
    API <--> PRISMA
    PRISMA <--> DB
    GEO <--> PRISMA
    
    UI <--> API
    UI <--> RQ
    RQ <--> UI
    UI <-- Subscription --> WS
    WS -- Broadcast State --> MAP
```

---

## Getting Started

Follow these instructions to get the project running on your local machine.

### Prerequisites
- **Node.js** (v18+)
- **PostgreSQL** (with PostGIS extension installed for geofence geometry)
- **NPM** or **Yarn**

### 1. Database Setup
Ensure you have a PostgreSQL database running and accessible. Configure your database URL in the backend's environment variables. 
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
3. Generate the Prisma Client and migrate the database:
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start the backend development server (this starts both the HTTP API and the TCP/WebSocket server):
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

---

## Tech Stack 

- **Frontend**: React.js, Vite, TailwindCSS, React Query (@tanstack/react-query), React-Leaflet
- **Backend**: Node.js, Express.js, native `net` TCP sockets, `ws` WebSockets
- **Database**: PostgreSQL with PostGIS extension, Prisma ORM
