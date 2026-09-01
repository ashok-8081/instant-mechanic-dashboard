import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server as SocketServer } from "socket.io";
import { connectDB } from "./config/database";

// Import models
import './models/User';
import './models/Customer';
import './models/Vehicle';
import './models/Service';
import './models/Mechanic';
import './models/Booking';

// Import routes
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import bookingRoutes from "./routes/bookings";
import mechanicRoutes, { setBroadcastMechanicUpdate } from "./routes/mechanics";
import customerRoutes from "./routes/customers";

dotenv.config();

const app = express();
const server = createServer(app);
const io = new SocketServer(server, {
    cors: {
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        methods: ["GET", "POST"],
        credentials: true
    }
});

const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

// Set up WebSocket broadcast functions
const broadcastMechanicUpdate = (data: any) => {
    io.emit('mechanic-update', data);
};

const broadcastBookingUpdate = (data: any) => {
    io.emit('booking-update', data);
};

// Set the broadcast function for mechanics routes
setBroadcastMechanicUpdate(broadcastMechanicUpdate);

// Make io and broadcast functions available in routes
app.set('io', io);
app.set('broadcastMechanicUpdate', broadcastMechanicUpdate);
app.set('broadcastBookingUpdate', broadcastBookingUpdate);

// Middleware
app.use(helmet());
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

// Rate limiting
app.use(
    rateLimit({
        windowMs: 15 * 60 * 1000,
        limit: 100,
        standardHeaders: "draft-7",
        legacyHeaders: false,
    })
);

// Health check
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "InstantOps API is running",
        timestamp: new Date().toISOString(),
    });
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/mechanics", mechanicRoutes);
app.use("/api/customers", customerRoutes);

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('subscribe', (channel) => {
        socket.join(channel);
        console.log(`Client ${socket.id} subscribed to ${channel}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error'
    });
});

// 404 handler
app.use((_req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

server.listen(PORT, () => {
    console.log(`🚀 InstantOps API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🔌 WebSocket server running on port ${PORT}`);
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
    console.log('\n🔴 Shutting down gracefully...');
    process.exit(0);
});