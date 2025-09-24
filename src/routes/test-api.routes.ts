import { Router, Request, Response, NextFunction } from 'express';
import { userMasterController } from '../controllers/user-master.controller';
import { vehicleMasterController } from '../controllers/vehicle-master.controller';
import { driverMasterController } from '../controllers/driver-master.controller';
import { fuelStationController } from '../controllers/fuel-station.controller';
import { fuelLogController } from '../controllers/fuel-log.controller';
import { unitController } from '../controllers/unit.controller';

const router = Router();

// TEST ROUTES WITHOUT AUTHENTICATION - FOR TESTING ONLY

// User Master Routes
router.post('/test/users', (req: Request, res: Response, next: NextFunction) => userMasterController.create(req, res, next));
router.get('/test/users', (req: Request, res: Response, next: NextFunction) => userMasterController.findAll(req, res, next));
router.get('/test/users/:id', (req: Request, res: Response, next: NextFunction) => userMasterController.findById(req, res, next));
router.put('/test/users/:id', (req: Request, res: Response, next: NextFunction) => userMasterController.update(req, res, next));
router.delete('/test/users/:id', (req: Request, res: Response, next: NextFunction) => userMasterController.delete(req, res, next));
router.patch('/test/users/:id/deactivate', (req: Request, res: Response, next: NextFunction) => userMasterController.deactivateUser(req, res, next));

// Vehicle Master Routes
router.post('/test/vehicles', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.create(req, res, next));
router.get('/test/vehicles', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.findAll(req, res, next));
router.get('/test/vehicles/:id', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.findById(req, res, next));
router.put('/test/vehicles/:id', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.update(req, res, next));
router.delete('/test/vehicles/:id', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.delete(req, res, next));
router.get('/test/vehicles/regno/:vehRegNo', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.getByRegNo(req, res, next));

// Driver Master Routes
router.post('/test/drivers', (req: Request, res: Response, next: NextFunction) => driverMasterController.create(req, res, next));
router.get('/test/drivers', (req: Request, res: Response, next: NextFunction) => driverMasterController.findAll(req, res, next));
router.get('/test/drivers/:id', (req: Request, res: Response, next: NextFunction) => driverMasterController.findById(req, res, next));
router.put('/test/drivers/:id', (req: Request, res: Response, next: NextFunction) => driverMasterController.update(req, res, next));
router.delete('/test/drivers/:id', (req: Request, res: Response, next: NextFunction) => driverMasterController.delete(req, res, next));

// Fuel Station Routes
router.post('/test/fuel-stations', (req: Request, res: Response, next: NextFunction) => fuelStationController.create(req, res, next));
router.get('/test/fuel-stations', (req: Request, res: Response, next: NextFunction) => fuelStationController.findAll(req, res, next));
router.get('/test/fuel-stations/:id', (req: Request, res: Response, next: NextFunction) => fuelStationController.findById(req, res, next));
router.put('/test/fuel-stations/:id', (req: Request, res: Response, next: NextFunction) => fuelStationController.update(req, res, next));
router.delete('/test/fuel-stations/:id', (req: Request, res: Response, next: NextFunction) => fuelStationController.delete(req, res, next));

// Fuel Log Routes
router.post('/test/fuel-logs', (req: Request, res: Response, next: NextFunction) => fuelLogController.create(req, res, next));
router.get('/test/fuel-logs', (req: Request, res: Response, next: NextFunction) => fuelLogController.findAll(req, res, next));
router.get('/test/fuel-logs/:id', (req: Request, res: Response, next: NextFunction) => fuelLogController.findById(req, res, next));
router.put('/test/fuel-logs/:id', (req: Request, res: Response, next: NextFunction) => fuelLogController.update(req, res, next));
router.delete('/test/fuel-logs/:id', (req: Request, res: Response, next: NextFunction) => fuelLogController.delete(req, res, next));

// Unit Routes
router.post('/test/units', (req: Request, res: Response, next: NextFunction) => unitController.create(req, res, next));
router.get('/test/units', (req: Request, res: Response, next: NextFunction) => unitController.findAll(req, res, next));
router.get('/test/units/:id', (req: Request, res: Response, next: NextFunction) => unitController.findById(req, res, next));
router.put('/test/units/:id', (req: Request, res: Response, next: NextFunction) => unitController.update(req, res, next));
router.delete('/test/units/:id', (req: Request, res: Response, next: NextFunction) => unitController.delete(req, res, next));

// Health check
router.get('/test/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'MTO Test API is running (No Auth)',
    timestamp: new Date().toISOString()
  });
});

export default router;