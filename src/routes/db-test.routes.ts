import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import UserMaster from '../models/UserMaster.model';
import VehicleMaster from '../models/VehicleMaster.model';
import DriverMaster from '../models/DriverMaster.model';
import FuelStation from '../models/FuelStation.model';
import FuelLog from '../models/FuelLog.model';
import Unit from '../models/Unit.model';

const router = Router();

// Database connection status endpoint
router.get('/db/status', async (_req: Request, res: Response) => {
  try {
    const connectionState = mongoose.connection.readyState;
    const states: Record<number, string> = {
      0: 'Disconnected',
      1: 'Connected',
      2: 'Connecting',
      3: 'Disconnecting'
    };

    // Get collection stats
    const collections = mongoose.connection.db
      ? await mongoose.connection.db.listCollections().toArray()
      : [];

    // Get document counts
    const [userCount, vehicleCount, driverCount, stationCount, logCount, unitCount] = await Promise.all([
      UserMaster.countDocuments(),
      VehicleMaster.countDocuments(),
      DriverMaster.countDocuments(),
      FuelStation.countDocuments(),
      FuelLog.countDocuments(),
      Unit.countDocuments()
    ]);

    // Get database stats
    const dbStats = mongoose.connection.db
      ? await mongoose.connection.db.stats()
      : { dataSize: 0, storageSize: 0, indexes: 0, objects: 0 };

    res.json({
      success: true,
      database: {
        status: states[connectionState] || 'Unknown',
        connected: connectionState === 1,
        name: mongoose.connection.name,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        uri: process.env.MONGODB_URI?.replace(/mongodb\+srv:\/\/[^:]+:[^@]+@/, 'mongodb+srv://***:***@') || 'Not configured'
      },
      statistics: {
        databaseSize: `${(dbStats.dataSize / 1024 / 1024).toFixed(2)} MB`,
        storageSize: `${(dbStats.storageSize / 1024 / 1024).toFixed(2)} MB`,
        indexes: dbStats.indexes,
        collections: collections.length,
        totalDocuments: dbStats.objects
      },
      collections: collections.map(col => ({
        name: col.name,
        type: col.type
      })),
      documentCounts: {
        users: userCount,
        vehicles: vehicleCount,
        drivers: driverCount,
        fuelStations: stationCount,
        fuelLogs: logCount,
        units: unitCount,
        total: userCount + vehicleCount + driverCount + stationCount + logCount + unitCount
      },
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to get database status',
        details: error.message
      }
    });
  }
});

// Test database write operation
router.post('/db/test-write', async (_req: Request, res: Response) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Create a test document
    const testUser = new UserMaster({
      name: `Test User ${Date.now()}`,
      phoneNo: `9${Math.floor(Math.random() * 1000000000)}`,
      email: `test${Date.now()}@test.com`,
      roleId: new mongoose.Types.ObjectId(),
      unitId: new mongoose.Types.ObjectId(),
      isActive: true
    });

    const saved = await testUser.save({ session });

    // Immediately delete it
    await UserMaster.findByIdAndDelete(saved._id, { session });

    await session.commitTransaction();

    res.json({
      success: true,
      message: 'Database write test successful',
      testData: {
        created: saved._id,
        deleted: true,
        transactionSuccessful: true
      }
    });
  } catch (error: any) {
    await session.abortTransaction();
    res.status(500).json({
      success: false,
      message: 'Database write test failed',
      error: error.message
    });
  } finally {
    session.endSession();
  }
});

// Get sample data from each collection
router.get('/db/sample-data', async (_req: Request, res: Response) => {
  try {
    const [users, vehicles, drivers, stations, logs, units] = await Promise.all([
      UserMaster.find().limit(2).select('-password -refreshToken'),
      VehicleMaster.find().limit(2),
      DriverMaster.find().limit(2),
      FuelStation.find().limit(2),
      FuelLog.find().limit(2),
      Unit.find().limit(2)
    ]);

    res.json({
      success: true,
      sampleData: {
        users: users.length > 0 ? users : 'No users found',
        vehicles: vehicles.length > 0 ? vehicles : 'No vehicles found',
        drivers: drivers.length > 0 ? drivers : 'No drivers found',
        fuelStations: stations.length > 0 ? stations : 'No fuel stations found',
        fuelLogs: logs.length > 0 ? logs : 'No fuel logs found',
        units: units.length > 0 ? units : 'No units found'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Ping database
router.get('/db/ping', async (_req: Request, res: Response) => {
  try {
    const start = Date.now();
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    await mongoose.connection.db.admin().ping();
    const latency = Date.now() - start;

    res.json({
      success: true,
      message: 'Database ping successful',
      latency: `${latency}ms`,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Database ping failed',
      error: error.message
    });
  }
});

// Get indexes information
router.get('/db/indexes', async (_req: Request, res: Response) => {
  try {
    const collections = ['usermasters', 'vehiclemasters', 'drivermasters', 'fuelstations', 'fuellogs', 'units'];
    const indexes: any = {};

    for (const collection of collections) {
      try {
        if (!mongoose.connection.db) {
          throw new Error('Database connection not established');
        }
        const collectionIndexes = await mongoose.connection.db.collection(collection).indexes();
        indexes[collection] = collectionIndexes.map((idx: any) => ({
          name: idx.name,
          key: idx.key,
          unique: idx.unique || false,
          sparse: idx.sparse || false
        }));
      } catch (err) {
        indexes[collection] = 'Collection not found';
      }
    }

    res.json({
      success: true,
      indexes
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

export default router;