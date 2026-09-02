# 🚗 Instant Mechanic - Live Operations Dashboard

A **production-ready** Full Stack Live Operations Dashboard for vehicle service management. Built with React, Node.js, MongoDB, and real-time WebSocket updates.

## 🚀 Live Demo

| Service | URL |
|---------|-----|
| **Frontend** | [https://instant-mechanic-dashboard-ten.vercel.app](https://instant-mechanic-dashboard-ten.vercel.app) |
| **Backend API** | [http://13.60.40.245:5000/api](http://13.60.40.245:5000/api) |
| **API Documentation** | [http://13.60.40.245:5000/api-docs](http://13.60.40.245:5000/api-docs) |

### ⚠️ Important Note for Viewing

Since the frontend is hosted on **HTTPS** and the backend is on **HTTP**, browsers block the connection for security. To view the dashboard:

1. **Use Google Chrome** (not Firefox)
2. Go to the frontend URL
3. Click the **lock icon** (🔒) in the address bar
4. Click **"Site settings"**
5. Find **"Insecure content"** → Change from **"Block"** to **"Allow"**
6. Refresh the page

### 🔑 Login Credentials

```
Email: admin@instantmechanic.com
Password: admin123
```

---

## 📋 Features

### 🔐 Authentication & Security
- JWT-based authentication
- Role-based access control (Admin/Operations/Mechanic)
- Protected routes with auto-redirect

### 📊 Dashboard
- Real-time statistics (Total Bookings, Revenue, Active Mechanics, etc.)
- Interactive charts (Booking Trends, Revenue Trends, Status Distribution, Service Breakdown)
- Live data updates every 30 seconds

### 📅 Bookings Management
- Advanced table with sorting, filtering, and pagination
- Search by customer, vehicle, or booking ID
- Real-time status updates
- Export to CSV

### 👨‍🔧 Mechanics Management
- Grid view with status indicators
- Real-time location tracking on interactive map
- Filter by availability status
- Add new mechanics

### 👥 Customer Management
- Searchable customer list
- View customer booking history
- Vehicle information display

### 🔄 Real-time Features
- WebSocket connections for live updates
- Toast notifications
- Live indicator in header

### 🎨 UI/UX
- **Dark/Light mode** with persistence
- Responsive design
- shadcn/ui components
- Loading states and error handling

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 19 | UI Framework |
| TypeScript | Type safety |
| Tailwind CSS v4 | Styling |
| shadcn/ui | UI Components |
| Recharts | Data Visualization |
| React Query | Data fetching & caching |
| Socket.io-client | Real-time updates |
| React Router v6 | Navigation |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Runtime |
| Express | Web framework |
| TypeScript | Type safety |
| MongoDB Atlas | Database |
| Mongoose | ODM |
| Socket.io | Real-time WebSocket |
| JWT | Authentication |
| Swagger | API Documentation |

### Infrastructure
| Platform | Service |
|----------|---------|
| AWS EC2 | Backend Hosting |
| Vercel | Frontend Hosting |
| MongoDB Atlas | Database |

---

## 📁 Project Structure

```
instant-mechanic-dashboard/
├── backend/
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── models/         # Mongoose models
│   │   │   ├── User.ts
│   │   │   ├── Customer.ts
│   │   │   ├── Mechanic.ts
│   │   │   ├── Vehicle.ts
│   │   │   ├── Service.ts
│   │   │   └── Booking.ts
│   │   ├── routes/         # API routes
│   │   │   ├── auth.ts
│   │   │   ├── dashboard.ts
│   │   │   ├── bookings.ts
│   │   │   ├── mechanics.ts
│   │   │   └── customers.ts
│   │   ├── controllers/    # Business logic
│   │   ├── middleware/     # Auth middleware
│   │   ├── scripts/        # Seed data generator
│   │   └── server.ts       # Entry point
│   ├── .env.example
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API client & endpoints
│   │   ├── components/     # React components
│   │   ├── contexts/       # Context providers
│   │   ├── hooks/          # Custom hooks
│   │   ├── pages/          # Page components
│   │   └── types/          # TypeScript types
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Frontend  │────▶│   Backend   │────▶│  Database   │
│   (Vercel)  │     │   (AWS EC2) │     │  (MongoDB)  │
└─────────────┘     └─────────────┘     └─────────────┘
       │                    │
       │◀─── WebSocket ────│
       │   (Real-time)     │
```

---

## 🚀 Local Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Update .env with your MongoDB URI
npm run seed    # Generate 500+ sample bookings
npm run dev     # Start development server
```

### Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
# Update VITE_API_URL to your backend URL
npm run dev     # Start development server
```

### Login Credentials
```
Email: admin@instantmechanic.com
Password: admin123
```

---

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/instant_mechanic
JWT_SECRET=your-super-secret-jwt-key
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 📚 API Documentation

When the backend is running, visit `/api-docs` for Swagger documentation.

### Key Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/auth/login` | User login | ❌ |
| POST | `/auth/register` | User registration | ❌ |
| GET | `/dashboard` | Dashboard statistics | ✅ |
| GET | `/bookings` | List all bookings | ✅ |
| PUT | `/bookings/:id/status` | Update booking status | ✅ |
| GET | `/mechanics` | List all mechanics | ✅ |
| POST | `/mechanics` | Create new mechanic | ✅ |
| GET | `/customers` | List all customers | ✅ |

---

## 🤖 AI Usage

This project was built with assistance from AI tools:

| Tool | Usage |
|------|-------|
| **Claude** | Architecture design, code generation, debugging, error fixing |
| **ChatGPT** | Documentation, debugging assistance, concept explanation |
| **GitHub Copilot** | Code autocompletion, refactoring suggestions |

All code was reviewed, understood, and modified by the developer before implementation.

---

## 📦 Deployment

### Frontend (Vercel)
```bash
cd frontend
npm run build
vercel --prod
```

### Backend (AWS EC2)
```bash
# SSH into EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Pull and restart
cd /home/ubuntu
git pull
npm run build
pm2 restart instant-mechanic-api
```

---

## 👨‍💻 Author

**Ashok Kumar Dubey**
- GitHub: [@ashok-8081](https://github.com/ashok-8081)
- Email: ashok8081@gmail.com

---

## 📄 License

This project is for demonstration purposes as part of a Full Stack Developer Internship assignment.

---

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) for beautiful components
- [Recharts](https://recharts.org/) for charts
- [Socket.io](https://socket.io/) for real-time communication
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

**⭐ If you find this project helpful, please give it a star!**