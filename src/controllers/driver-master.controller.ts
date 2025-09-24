import { Request, Response, NextFunction } from 'express';
import { BaseCRUDController } from './base-crud.controller';
import DriverMaster, { IDriverMaster } from '../models/DriverMaster.model';
import VehicleMaster from '../models/VehicleMaster.model';

export class DriverMasterController extends BaseCRUDController<IDriverMaster> {
  constructor() {
    super(DriverMaster, 'Driver');
  }

  // Get available drivers
  async getAvailableDrivers(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = { status: 'AVAILABLE', isActive: true };
      if (unitId) filters.unitId = unitId;

      // Check for drivers with valid licenses
      filters.licenseExpiry = { $gt: new Date() };

      const skip = (pagination.page - 1) * pagination.limit;

      const [drivers, total] = await Promise.all([
        DriverMaster.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('unitId'),
        DriverMaster.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, drivers, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Assign driver to vehicle
  async assignToVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { vehicleId } = req.body;

      // Check if driver exists and is available
      const driver = await DriverMaster.findById(id);
      if (!driver) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Driver not found'
        }, 404);
      }

      if (driver.status !== 'AVAILABLE') {
        return this.sendError(res, {
          code: 'DRIVER_NOT_AVAILABLE',
          message: 'Driver is not available for assignment'
        }, 400);
      }

      // Check if vehicle exists and is available
      const vehicle = await VehicleMaster.findById(vehicleId);
      if (!vehicle) {
        return this.sendError(res, {
          code: 'VEHICLE_NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      if (vehicle.status !== 'AVAILABLE') {
        return this.sendError(res, {
          code: 'VEHICLE_NOT_AVAILABLE',
          message: 'Vehicle is not available for assignment'
        }, 400);
      }

      // Update driver
      driver.assignedVehicleId = vehicleId;
      driver.status = 'ON_DUTY';
      await driver.save();

      // Update vehicle
      vehicle.currentDriverId = driver._id as any;
      vehicle.status = 'IN_USE';
      await vehicle.save();

      this.sendSuccess(res, {
        driver: driver,
        vehicle: vehicle
      }, 'Driver assigned to vehicle successfully');
    } catch (error) {
      next(error);
    }
  }

  // Release driver from vehicle
  async releaseFromVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const driver = await DriverMaster.findById(id);
      if (!driver) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Driver not found'
        }, 404);
      }

      if (!driver.assignedVehicleId) {
        return this.sendError(res, {
          code: 'NO_VEHICLE_ASSIGNED',
          message: 'Driver is not assigned to any vehicle'
        }, 400);
      }

      // Update vehicle
      await VehicleMaster.findByIdAndUpdate(driver.assignedVehicleId, {
        currentDriverId: null,
        status: 'AVAILABLE'
      });

      // Update driver
      driver.assignedVehicleId = undefined;
      driver.status = 'AVAILABLE';
      await driver.save();

      this.sendSuccess(res, driver, 'Driver released from vehicle successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update driver status
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const driver = await DriverMaster.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!driver) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Driver not found'
        }, 404);
      }

      this.sendSuccess(res, driver, 'Driver status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get drivers with expiring licenses
  async getExpiringLicenses(req: Request, res: Response, next: NextFunction) {
    try {
      const daysAhead = parseInt(req.query.days as string) || 30;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysAhead);

      const drivers = await DriverMaster.find({
        licenseExpiry: {
          $gte: new Date(),
          $lte: expiryDate
        },
        isActive: true
      }).populate('unitId');

      this.sendSuccess(res, drivers, `Found ${drivers.length} drivers with expiring licenses`);
    } catch (error) {
      next(error);
    }
  }

  // Update driver rating
  async updateRating(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (rating < 0 || rating > 5) {
        return this.sendError(res, {
          code: 'INVALID_RATING',
          message: 'Rating must be between 0 and 5',
          field: 'rating'
        }, 400);
      }

      const driver = await DriverMaster.findById(id);
      if (!driver) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Driver not found'
        }, 404);
      }

      // Calculate new rating (simple average for now)
      if (driver.rating && driver.totalTrips) {
        const totalRating = driver.rating * driver.totalTrips;
        driver.rating = (totalRating + rating) / (driver.totalTrips + 1);
        driver.totalTrips += 1;
      } else {
        driver.rating = rating;
        driver.totalTrips = 1;
      }

      await driver.save();

      this.sendSuccess(res, driver, 'Driver rating updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const driverMasterController = new DriverMasterController();