import { Router, Request, Response, NextFunction } from 'express';
import { userMasterController } from '../controllers/user-master.controller';
import { vehicleMasterController } from '../controllers/vehicle-master.controller';
import { driverMasterController } from '../controllers/driver-master.controller';
import { fuelStationController } from '../controllers/fuel-station.controller';
import { fuelLogController } from '../controllers/fuel-log.controller';
import { unitController } from '../controllers/unit.controller';
import * as validations from '../middleware/validation.schemas';

const router = Router();

// User Master Routes
router.post('/api/users', validations.createUserValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.create(req, res, next));
router.get('/api/users', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.findAll(req, res, next));
router.get('/api/users/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.findById(req, res, next));
router.put('/api/users/:id', validations.updateUserValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.update(req, res, next));
router.delete('/api/users/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.delete(req, res, next));
router.patch('/api/users/:id/deactivate', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.deactivateUser(req, res, next));
router.patch('/api/users/:id/password', validations.updatePasswordValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.updatePassword(req, res, next));
router.get('/api/users/role/:roleId', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.getUsersByRole(req, res, next));
router.get('/api/users/unit/:unitId', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => userMasterController.getUsersByUnit(req, res, next));

// Vehicle Master Routes
router.post('/api/vehicles', validations.createVehicleValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.create(req, res, next));
router.get('/api/vehicles', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.findAll(req, res, next));
router.get('/api/vehicles/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.findById(req, res, next));
router.put('/api/vehicles/:id', validations.updateVehicleValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.update(req, res, next));
router.delete('/api/vehicles/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.delete(req, res, next));
router.get('/api/vehicles/regno/:vehRegNo', (req: Request, res: Response, next: NextFunction) => vehicleMasterController.getByRegNo(req, res, next));
router.get('/api/vehicles/available', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.getAvailableVehicles(req, res, next));
router.patch('/api/vehicles/:id/status', validations.updateVehicleStatusValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.updateStatus(req, res, next));
router.patch('/api/vehicles/:id/odometer', validations.updateOdometerValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.updateOdometer(req, res, next));
router.get('/api/vehicles/unit/:unitId', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.getVehiclesByUnit(req, res, next));
router.patch('/api/vehicles/:id/maintenance', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => vehicleMasterController.scheduleMaintenance(req, res, next));

// Driver Master Routes
router.post('/api/drivers', validations.createDriverValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.create(req, res, next));
router.get('/api/drivers', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.findAll(req, res, next));
router.get('/api/drivers/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.findById(req, res, next));
router.put('/api/drivers/:id', validations.updateDriverValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.update(req, res, next));
router.delete('/api/drivers/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.delete(req, res, next));
router.get('/api/drivers/available', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.getAvailableDrivers(req, res, next));
router.patch('/api/drivers/:id/assign', validations.assignDriverValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.assignToVehicle(req, res, next));
router.patch('/api/drivers/:id/release', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.releaseFromVehicle(req, res, next));
router.patch('/api/drivers/:id/status', validations.updateDriverStatusValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.updateStatus(req, res, next));
router.get('/api/drivers/expiring-licenses', (req: Request, res: Response, next: NextFunction) => driverMasterController.getExpiringLicenses(req, res, next));
router.patch('/api/drivers/:id/rating', validations.updateDriverRatingValidation, (req: Request, res: Response, next: NextFunction) => driverMasterController.updateRating(req, res, next));

// Fuel Station Routes
router.post('/api/fuel-stations', validations.createFuelStationValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.create(req, res, next));
router.get('/api/fuel-stations', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.findAll(req, res, next));
router.get('/api/fuel-stations/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.findById(req, res, next));
router.put('/api/fuel-stations/:id', (req: Request, res: Response, next: NextFunction) => fuelStationController.update(req, res, next));
router.delete('/api/fuel-stations/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.delete(req, res, next));
router.get('/api/fuel-stations/code/:stationCode', (req: Request, res: Response, next: NextFunction) => fuelStationController.getByStationCode(req, res, next));
router.get('/api/fuel-stations/active', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.getActiveStations(req, res, next));
router.patch('/api/fuel-stations/:id/stock', validations.updateStockValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.updateStock(req, res, next));
router.patch('/api/fuel-stations/:id/prices', validations.updatePricesValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.updatePrices(req, res, next));
router.get('/api/fuel-stations/low-stock', (req: Request, res: Response, next: NextFunction) => fuelStationController.getLowStockStations(req, res, next));
router.get('/api/fuel-stations/expiring-contracts', (req: Request, res: Response, next: NextFunction) => fuelStationController.getExpiringContracts(req, res, next));
router.patch('/api/fuel-stations/:id/renew', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => fuelStationController.renewContract(req, res, next));

// Fuel Log Routes
router.post('/api/fuel-logs', validations.createFuelLogValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.create(req, res, next));
router.get('/api/fuel-logs', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.findAll(req, res, next));
router.get('/api/fuel-logs/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.findById(req, res, next));
router.put('/api/fuel-logs/:id', (req: Request, res: Response, next: NextFunction) => fuelLogController.update(req, res, next));
router.delete('/api/fuel-logs/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.delete(req, res, next));
router.get('/api/fuel-logs/vehicle/:vehicleId', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.getByVehicle(req, res, next));
router.get('/api/fuel-logs/driver/:driverId', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.getByDriver(req, res, next));
router.get('/api/fuel-logs/pending', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.getPendingApprovals(req, res, next));
router.patch('/api/fuel-logs/:id/approve', validations.approveFuelLogValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.approveFuelLog(req, res, next));
router.patch('/api/fuel-logs/:id/reject', validations.rejectFuelLogValidation, (req: Request, res: Response, next: NextFunction) => fuelLogController.rejectFuelLog(req, res, next));
router.get('/api/fuel-logs/report/consumption', (req: Request, res: Response, next: NextFunction) => fuelLogController.getFuelConsumptionReport(req, res, next));

// Unit Routes
router.post('/api/units', validations.createUnitValidation, (req: Request, res: Response, next: NextFunction) => unitController.create(req, res, next));
router.get('/api/units', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => unitController.findAll(req, res, next));
router.get('/api/units/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => unitController.findById(req, res, next));
router.put('/api/units/:id', validations.updateUnitValidation, (req: Request, res: Response, next: NextFunction) => unitController.update(req, res, next));
router.delete('/api/units/:id', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => unitController.delete(req, res, next));
router.get('/api/units/code/:unitCode', (req: Request, res: Response, next: NextFunction) => unitController.getByUnitCode(req, res, next));
router.get('/api/units/type/:unitType', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => unitController.getByType(req, res, next));
router.get('/api/units/:id/sub-units', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => unitController.getSubUnits(req, res, next));
router.get('/api/units/:id/hierarchy', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => unitController.getHierarchy(req, res, next));
router.patch('/api/units/:id/head', validations.updateUnitHeadValidation, (req: Request, res: Response, next: NextFunction) => unitController.updateHead(req, res, next));
router.patch('/api/units/:id/fuel-quota', validations.updateFuelQuotaValidation, (req: Request, res: Response, next: NextFunction) => unitController.updateFuelQuota(req, res, next));
router.get('/api/units/:id/statistics', validations.idParamValidation, (req: Request, res: Response, next: NextFunction) => unitController.getStatistics(req, res, next));
router.get('/api/units/district/:district', validations.paginationValidation, (req: Request, res: Response, next: NextFunction) => unitController.getByDistrict(req, res, next));

// Health check
router.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'MTO Backend API is running',
    timestamp: new Date().toISOString()
  });
});

export default router;