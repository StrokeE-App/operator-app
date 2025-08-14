# StrokeE Operator App

A Next.js-based web application designed to accept/decline emergencies and assign ambulances. This app is part of the larger StrokeE emergency response system, serving as the central command center for emergency coordination between patients and paramedics.

## 🚨 Features

### Core Functionality

- **Emergency Monitoring Dashboard**: Real-time view of all active stroke emergencies
- **Emergency Verification System**: Validate and confirm emergency alerts from patients
- **Ambulance Management**: Coordinate and assign ambulances
- **Patient Information Display**: Access critical patient data for emergency assessment
- **Map**: Visualize emergency location

## 🛠️ Tech Stack

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Authentication**: Firebase Auth
- **Real-time Communication**: Server-Sent Events (SSE) for live updates
- **Maps**: Leaflet with React-Leaflet for location services
- **State Management**: React Context API
- **Testing**: Jest with React Testing Library
- **Package Manager**: npm/yarn/pnpm

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- Firebase project setup
- Access to StrokeE backend services

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd strokee/operator-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory with your configuration:

   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   NEXT_PUBLIC_BACKEND_URL=your_backend_url
   NEXT_PUBLIC_NOTIFICATION_BACKEND_URL=your_backend_url
   ```

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

Run the test suite using the following commands:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🏗️ Building for Production

```bash
# Build the application
npm run build

# Start production server
npm start
```

## 🐳 Docker

The app includes Docker support for containerized deployment:

```bash
# Build Docker image
docker build -t strokee-operator-app .

# Run container
docker run -p 3000:3000 strokee-operator-app
```

## 📋 Key Features Explained

### Emergency Monitoring Dashboard

- Operators can view all active stroke emergencies in real-time
- Emergency verification and confirmation system

### Emergency Management Interface

- Patient data access for emergency assessment
- Map showing emergency location

### Ambulance Assignment

- View available ambulances and assign them to an emergency


## 🔒 Security Features

- Firebase Authentication for secure user management
- Role-based access control for emergency operators
- Secure API endpoints with authentication
- Encrypted communication for sensitive emergency data

## 📱 Responsive Design

- Web-optimized interface for desktop and tablet use
- Touch-friendly controls for mobile devices
- Progressive Web App (PWA) capabilities
- Responsive layout for various screen sizes

## 🔄 Real-time Communication

- Server-Sent Events (SSE) for live emergency updates
