import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import { connectDB } from "./config/database";

// IMPORTANT: Import models in the correct order
// First, import models that don't depend on others
import './models/User';
import './models/Customer';

// Then import models that reference others
import './models/Vehicle';    // References Customer
import './models/Service';    // No dependencies
import './models/Mechanic';   // References User

// Finally, import Booking which references all others
import './models/Booking';

// Import routes after models are registered
import authRoutes from "./routes/auth";
import dashboardRoutes from "./routes/dashboard";
import bookingRoutes from "./routes/bookings";
import mechanicRoutes from "./routes/mechanics";
import customerRoutes from "./routes/customers";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to database
connectDB();

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

app.listen(PORT, () => {
    console.log(`🚀 InstantOps API running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});