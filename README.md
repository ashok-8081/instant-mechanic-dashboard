# InstantOps

A modern live vehicle service operations dashboard built for the Instant Mechanic internship assignment.

## Project Structure

- `frontend/` — React + TypeScript dashboard
- `backend/` — Node.js + Express + TypeScript API

## Planned Architecture

React + TypeScript
        ↓
REST API / Socket.IO
        ↓
Node.js + Express + TypeScript
        ↓
MongoDB Atlas

## Core Features

- Operations dashboard
- Booking management
- Booking analytics
- Mechanic management
- Customer management
- Real-time booking updates
- Search, filtering, sorting and pagination
- Responsive SaaS-style UI

# 🚗 Instant Mechanic - Live Operations Dashboard

A **production-ready** Full Stack Live Operations Dashboard for vehicle service management. Built with React, Node.js, MongoDB, and real-time WebSocket updates.

![Dashboard Preview](https://via.placeholder.com/1200x600/1a1a2e/ffffff?text=Instant+Mechanic+Dashboard)

## ✨ Live Demo

- **Frontend**: [https://instant-mechanic-dashboard.vercel.app](https://instant-mechanic-dashboard.vercel.app)
- **Backend API**: [https://api.instantmechanic.com](https://api.instantmechanic.com)
- **API Documentation**: [https://api.instantmechanic.com/api-docs](https://api.instantmechanic.com/api-docs)

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
- Real-time status updates (Pending → Assigned → In Progress → Completed)
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
- Toast notifications for events (booking updates, mechanic status changes)
- Live indicator in header

### 🎨 UI/UX
- **Dark/Light mode** with persistence
- Responsive design for all screen sizes
- shadcn/ui components for consistent design
- Loading states and error handling

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI Framework |
| **TypeScript** | Type safety |
| **Tailwind CSS v4** | Styling |
| **shadcn/ui** | UI Components |
| **Recharts** | Data Visualization |
| **React Query** | Data fetching & caching |
| **Socket.io-client** | Real-time updates |
| **React Router v6** | Navigation |
| **Vite** | Build tool |

### Backend
| Technology | Purpose |
|------------|---------|
| **Node.js** | Runtime |
| **Express** | Web framework |
| **TypeScript** | Type safety |
| **MongoDB** | Database |
| **Mongoose** | ODM |
| **Socket.io** | Real-time WebSocket |
| **JWT** | Authentication |
| **Swagger** | API Documentation |

## 📁 Project Structure
