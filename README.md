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
- 
![Screenshot_2026-01-14-17-02-18-65_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/91d419f8-1fdd-4caa-b813-58ebfa5a5367)
![Screenshot_2026-01-14-17-02-34-63_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/ccbaa3c2-7960-43ae-abf3-b46beac61d24)

### Ligand Management
- 📝 Complete list of available ligands (loaded from local file)
- 🔍 Real-time ligand search
- 📥 Automatic PDB structure download from RCSB
- 📤 Share molecular structures with other users

![Screenshot_2026-01-14-17-03-12-19_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/a05dffb5-0570-427b-a26c-c23bf72136a1)


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

![Screenshot_2026-01-14-17-04-08-95_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/56796c67-bdb2-4703-bfec-55d1a23c2bb2)
![Screenshot_2026-01-14-17-03-57-51_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/839bb432-57d8-4ff0-ba90-c58828e79f0b)
![Screenshot_2026-01-14-17-03-43-93_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/3e151f72-9080-4f51-ba0b-4210e1ce6839)
![Screenshot_2026-01-14-17-03-31-30_f73b71075b1de7323614b647fe394240](https://github.com/user-attachments/assets/69bbe35e-724d-485a-973f-506674219dbd)


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
