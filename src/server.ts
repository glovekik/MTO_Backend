import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import routing system
import { RouteLoader } from './utils/route-loader';
import { controllers } from './controllers';
import { errorHandler } from './middleware/error.middleware';
import apiRoutes from './routes/api.routes';
import testApiRoutes from './routes/test-api.routes';
import dbTestRoutes from './routes/db-test.routes';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login attempts per windowMs
  message: 'Too many login attempts, please try again later.',
  skipSuccessfulRequests: true
});

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Apply rate limiting
app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);

// Initialize route loader
const routeLoader = new RouteLoader();

// Load all routes from configuration
const legacyRoutes = routeLoader.loadAllServices(controllers as any);
app.use('/', legacyRoutes);

// Mount new API routes
app.use('/', apiRoutes);

// Mount test API routes (without authentication)
app.use('/api', testApiRoutes);

// Mount database test routes
app.use('/api', dbTestRoutes);

// Endpoint discovery route
app.get('/api/endpoints', (_req, res) => {
  const endpoints = routeLoader.getRegisteredRoutes();
  res.json({
    success: true,
    totalEndpoints: endpoints.length,
    endpoints
  });
});

// Error handling middleware
app.use(errorHandler);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
    });
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

export default app;