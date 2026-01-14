# Swifty Proteins

A mobile application for interactive 3D visualization of ligand molecular structures, built with React Native and Expo, with a Node.js/TypeScript backend and PostgreSQL.

## 📋 Description

Swifty Proteins is a molecular visualization application that allows users to explore three-dimensional structures of ligands obtained from the RCSB PDB database. The application offers three visualization modes (space-filling, ball-and-stick, ribbon) with interactive controls for rotation, zoom, and individual atom selection.

## ✨ Key Features

### Authentication & Security
- 🔐 Complete registration and login system
- 🔒 JWT authentication (Access Token + Refresh Token)
- 📱 Optional biometric authentication (Face ID / Touch ID / Fingerprint)
- 🛡️ Secure credential storage with Expo SecureStore
- 🔄 Session persistence with refresh tokens

<img width="300" alt="login view" src="https://github.com/user-attachments/assets/875bff81-3afb-4907-9171-1d66df1a553c" />
<img width="300" alt="fingerprint enable" src="https://github.com/user-attachments/assets/73417ad4-a565-4189-9d20-a1f11404fb73" />

### Ligand Management
- 📝 Complete list of available ligands (loaded from local file)
- 🔍 Real-time ligand search
- 📥 Automatic PDB structure download from RCSB
- 📤 Share molecular structures with other users

<img width="300" alt="ligands list" src="https://github.com/user-attachments/assets/ab409215-9a37-42b8-be70-d7ff4a6b936e" />

### 3D Molecule Visualization
- 🎨 **Three visualization modes:**
  - **Space-Filling**: Van der Waals spheres representation
  - **Ball-and-Stick**: Atoms as small spheres connected with cylinders
  - **Ribbon**: Secondary protein structure visualization
- 🔄 360° rotation with touch gestures
- 🔍 Zoom via pinch gestures
- 👆 Interactive atom selection with detailed information
- 📊 Tooltip with atomic information (symbol, name, coordinates)
- 🎨 Standard CPK color code for chemical elements

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://github.com/user-attachments/assets/8866a51a-74cf-442e-9326-5e7996fed80e" width="300" style="max-width: 100%;" alt="3D render">
  <img src="https://github.com/user-attachments/assets/1866ee2e-1e1b-44e7-8726-27b9aab0036b" width="300" style="max-width: 100%;" alt="3D render">
</div>
<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://github.com/user-attachments/assets/ce9d5efe-f6ab-405c-874b-e8c48e3be71b" width="300" style="max-width: 100%;" alt="3D render">
  <img src="https://github.com/user-attachments/assets/3b452603-5eaa-44d6-b5c8-67658f057d01" width="300" style="max-width: 100%;" alt="Atom tooltip">
</div>

### Technical Architecture
- 🐳 Fully Dockerized (Frontend, Backend, PostgreSQL)
- 🔄 REST API with schema validation (Zod)
- 🎯 TypeScript across the entire stack
- 📱 React Native with Expo for cross-platform development
- 🎨 Responsive design with NativeWind (TailwindCSS)
- 🌐 3D rendering with React Three Fiber

## 🛠️ Tech Stack

### Frontend
- **Framework**: React Native + Expo
- **Navigation**: React Navigation
- **3D Rendering**: React Three Fiber, Three.js, Expo GL
- **Styling**: NativeWind (TailwindCSS for React Native)
- **Biometric Authentication**: Expo Local Authentication
- **Storage**: Expo SecureStore
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Validation**: Zod
- **Authentication**: JWT (jsonwebtoken), bcrypt
- **Database**: PostgreSQL with pg driver

### DevOps
- **Containerization**: Docker + Docker Compose
- **Automation**: Makefile

## 📦 Prerequisites

- Docker and Docker Compose
- Node.js (if running locally without Docker)
- A mobile device or emulator for testing
- Expo Go app (for testing on physical device)

## 🚀 Installation & Usage

### 1. Clone the repository

```bash
git clone <repository-url>
cd swifty-proteins
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Backend
BACKEND_PORT=9000
NODE_ENV=development
BACKEND_URL=http://<your-ip>:9000

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=swiftyproteins
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/swiftyproteins

# JWT
JWT_ACCESS_SECRET=your_access_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# Expo Frontend
EXPO_PUBLIC_BACKEND_URL=http://<your-ip>:9000
REACT_NATIVE_PACKAGER_HOSTNAME=<your-ip>
```

### 3. Start the application

```bash
# Build and start all services
make up

# Or manually:
docker compose up -d --build
```

The `make up` command automatically:
- Detects your local IP
- Updates environment variables
- Builds Docker images
- Starts all containers
- Shows frontend logs

### 4. Access the application

#### Option A: Using a physical device
1. Install **Expo Go** from App Store / Play Store
2. Scan the QR code shown in the frontend logs
3. The app will load on your device

#### Option B: Using an emulator
- **iOS**: Open the iOS simulator and press `i` in the Expo terminal
- **Android**: Open the Android emulator and press `a` in the Expo terminal

### 5. Using the application

1. **Register**: Create an account with username, email, and password
2. **Biometric setup**: (Optional) Enable biometric authentication
3. **Login**: Sign in with your credentials or biometrics
4. **Explore ligands**: Search and select ligands from the list
5. **Visualize structure**: 
   - Use one finger to rotate the molecule
   - Pinch with two fingers to zoom
   - Tap an atom to see its information
   - Switch between visualization modes with top buttons
   - Share the structure with the share button

## 🎮 Available Commands (Makefile)

```bash
make up          # Start all services
make down        # Stop all services
make logs        # View frontend logs
make attach      # Attach to frontend container
make clean       # Clean containers and volumes
make fclean      # Complete cleanup (includes images)
make re-backend  # Rebuild backend only
make re-frontend # Rebuild frontend only
make re-db       # Rebuild database only
make ios         # Start in iOS development mode (without Docker)
```

## 📱 Application Architecture

### Backend API Endpoints

```
POST   /api/v1/auth/register      # User registration
POST   /api/v1/auth/login         # User login
POST   /api/v1/auth/refresh-token # Refresh access token
GET    /api/v1/pdb/:ligand_id     # Get PDB file for a ligand
```

### PDB Data Flow

1. Frontend requests a ligand by ID
2. Backend queries RCSB Search API to get Entry ID
3. mmCIF file is downloaded from RCSB
4. mmCIF is converted to PDB format
5. Frontend parses PDB and extracts atoms and bonds
6. React Three Fiber renders the 3D structure

### Database

**Table: users**
- `id`: UUID (primary key)
- `username`: VARCHAR(50) UNIQUE
- `email`: VARCHAR(100) UNIQUE
- `password`: VARCHAR(255) (hashed with bcrypt)
- `refresh_token`: TEXT
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## 🎨 Atom Color Code (CPK)

- **Carbon (C)**: Gray (#909090)
- **Nitrogen (N)**: Blue (#3050F8)
- **Oxygen (O)**: Red (#FF0D0D)
- **Hydrogen (H)**: White (#FFFFFF)
- **Sulfur (S)**: Yellow (#FFFF30)
- And more elements according to CPK standard...

## 🔒 Security

- Passwords hashed with bcrypt (10 salt rounds)
- JWT with short-lived tokens (15 minutes access, 7 days refresh)
- Authentication middleware on protected routes
- Input validation with Zod schemas
- Environment variables for secrets
- CORS configured

## 🐛 Troubleshooting

### Frontend cannot connect to backend
- Verify that `EXPO_PUBLIC_BACKEND_URL` in `.env` has your correct IP
- Use `make update-ip` to update automatically
- Make sure firewall allows connections

### Biometric authentication error
- Verify that your device/emulator supports biometrics
- On emulators, configure Face ID/Touch ID in settings

### 3D structure doesn't load
- Check internet connection (required to download PDB)
- Review backend logs: `make logs`
- Some ligands may not be available in RCSB

# Team work 💪

This project was a team effort. You can checkout the team members here:

-   **Alejandro Díaz Ufano Pérez**
    -   [Github](https://github.com/adiaz-uf)
    -   [LinkedIn](https://www.linkedin.com/in/alejandro-d%C3%ADaz-35a996303/)
    -   [42 intra](https://profile.intra.42.fr/users/adiaz-uf)
-   **Alejandro Aparicio**
    -   [Github](https://github.com/magnitopic)
    -   [LinkedIn](https://www.linkedin.com/in/magnitopic/)
    -   [42 intra](https://profile.intra.42.fr/users/alaparic)

## 📄 License

This project is part of the 42 Network curriculum.
