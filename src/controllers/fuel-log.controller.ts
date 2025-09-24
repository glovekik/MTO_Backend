import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { BaseCRUDController } from './base-crud.controller';
import FuelLog, { IFuelLog } from '../models/FuelLog.model';
import VehicleMaster from '../models/VehicleMaster.model';
import FuelStation from '../models/FuelStation.model';

export class FuelLogController extends BaseCRUDController<IFuelLog> {
  constructor() {
    super(FuelLog, 'Fuel Log');
  }

  // Override create to update vehicle odometer and station stock
  async create(req: Request, res: Response, next: NextFunction) {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      if (this.handleValidationErrors(req, res)) return;

      const { vehicleId, stationId, quantity, fuelType, odometerReading } = req.body;

      // Validate vehicle
      const vehicle = await VehicleMaster.findById(vehicleId).session(session);
      if (!vehicle) {
        await session.abortTransaction();
        return this.sendError(res, {
          code: 'VEHICLE_NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      // Validate and update odometer
      if (odometerReading < vehicle.totalKm!) {
        await session.abortTransaction();
        return this.sendError(res, {
          code: 'INVALID_ODOMETER',
          message: 'Odometer reading cannot be less than current vehicle reading',
          field: 'odometerReading'
        }, 400);
      }

      // Update vehicle odometer
      vehicle.totalKm = odometerReading;
      await vehicle.save({ session });

      // Validate and update station stock
      const station = await FuelStation.findById(stationId).session(session);
      if (!station) {
        await session.abortTransaction();
        return this.sendError(res, {
          code: 'STATION_NOT_FOUND',
          message: 'Fuel station not found'
        }, 404);
      }

      // Check stock availability
      const stockField = fuelType.toLowerCase() as 'petrol' | 'diesel';
      if (station.currentStock[stockField] < quantity) {
        await session.abortTransaction();
        return this.sendError(res, {
          code: 'INSUFFICIENT_STOCK',
          message: `Insufficient ${fuelType} stock at station`,
          field: 'quantity'
        }, 400);
      }

      // Update station stock
      station.currentStock[stockField] -= quantity;
      await station.save({ session });

      // Calculate total amount
      req.body.totalAmount = quantity * req.body.pricePerLiter;

      // Create fuel log
      const fuelLog = new FuelLog(req.body);
      const saved = await fuelLog.save({ session });

      await session.commitTransaction();

      // Populate references
      await saved.populate('vehicleId driverId stationId unitId');

      this.sendSuccess(res, saved, 'Fuel log created successfully', 201);
    } catch (error: any) {
      await session.abortTransaction();
      if (error.code === 11000) {
        this.sendError(res, {
          code: 'DUPLICATE_RECEIPT',
          message: 'Receipt number already exists',
          field: 'receiptNo'
        }, 409);
      } else {
        next(error);
      }
    } finally {
      session.endSession();
    }
  }

  // Get fuel logs by vehicle
  async getByVehicle(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehicleId } = req.params;
      const { startDate, endDate } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = { vehicleId };

      if (startDate || endDate) {
        filters.fillDate = {};
        if (startDate) filters.fillDate.$gte = new Date(startDate as string);
        if (endDate) filters.fillDate.$lte = new Date(endDate as string);
      }

      const skip = (pagination.page - 1) * pagination.limit;

      const [logs, total] = await Promise.all([
        FuelLog.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort('-fillDate')
          .populate('driverId stationId'),
        FuelLog.countDocuments(filters)
      ]);

      // Calculate fuel efficiency
      const efficiency = await this.calculateFuelEfficiency(vehicleId, logs);

      this.sendPaginatedResponse(res, logs, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit),
        efficiency
      });
    } catch (error) {
      next(error);
    }
  }

  // Get fuel logs by driver
  async getByDriver(req: Request, res: Response, next: NextFunction) {
    try {
      const { driverId } = req.params;
      const { startDate, endDate } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = { driverId };

      if (startDate || endDate) {
        filters.fillDate = {};
        if (startDate) filters.fillDate.$gte = new Date(startDate as string);
        if (endDate) filters.fillDate.$lte = new Date(endDate as string);
      }

      const skip = (pagination.page - 1) * pagination.limit;

      const [logs, total] = await Promise.all([
        FuelLog.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort('-fillDate')
          .populate('vehicleId stationId'),
        FuelLog.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, logs, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Get pending approvals
  async getPendingApprovals(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = { approvalStatus: 'PENDING' };
      if (unitId) filters.unitId = unitId;

      const skip = (pagination.page - 1) * pagination.limit;

      const [logs, total] = await Promise.all([
        FuelLog.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort('-createdAt')
          .populate('vehicleId driverId stationId unitId'),
        FuelLog.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, logs, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Approve fuel log
  async approveFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { approvedBy, approvalRemarks } = req.body;

      const fuelLog = await FuelLog.findByIdAndUpdate(
        id,
        {
          approvalStatus: 'APPROVED',
          approvedBy,
          approvalRemarks,
          updatedAt: new Date()
        },
        { new: true }
      ).populate('vehicleId driverId stationId');

      if (!fuelLog) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel log not found'
        }, 404);
      }

      this.sendSuccess(res, fuelLog, 'Fuel log approved successfully');
    } catch (error) {
      next(error);
    }
  }

  // Reject fuel log
  async rejectFuelLog(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { approvedBy, approvalRemarks } = req.body;

      if (!approvalRemarks) {
        return this.sendError(res, {
          code: 'REMARKS_REQUIRED',
          message: 'Approval remarks are required for rejection',
          field: 'approvalRemarks'
        }, 400);
      }

      const fuelLog = await FuelLog.findByIdAndUpdate(
        id,
        {
          approvalStatus: 'REJECTED',
          approvedBy,
          approvalRemarks,
          updatedAt: new Date()
        },
        { new: true }
      ).populate('vehicleId driverId stationId');

      if (!fuelLog) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel log not found'
        }, 404);
      }

      this.sendSuccess(res, fuelLog, 'Fuel log rejected');
    } catch (error) {
      next(error);
    }
  }

  // Get fuel consumption report
  async getFuelConsumptionReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId, startDate, endDate } = req.query;

      const filters: any = { approvalStatus: 'APPROVED' };
      if (unitId) filters.unitId = unitId;

      if (startDate || endDate) {
        filters.fillDate = {};
        if (startDate) filters.fillDate.$gte = new Date(startDate as string);
        if (endDate) filters.fillDate.$lte = new Date(endDate as string);
      }

      const logs = await FuelLog.aggregate([
        { $match: filters },
        {
          $group: {
            _id: {
              vehicleId: '$vehicleId',
              fuelType: '$fuelType'
            },
            totalQuantity: { $sum: '$quantity' },
            totalAmount: { $sum: '$totalAmount' },
            fillCount: { $sum: 1 },
            avgPricePerLiter: { $avg: '$pricePerLiter' }
          }
        },
        {
          $lookup: {
            from: 'vehiclemasters',
            localField: '_id.vehicleId',
            foreignField: '_id',
            as: 'vehicle'
          }
        },
        { $unwind: '$vehicle' },
        {
          $project: {
            vehicleRegNo: '$vehicle.vehRegNo',
            vehicleModel: '$vehicle.model',
            fuelType: '$_id.fuelType',
            totalQuantity: 1,
            totalAmount: 1,
            fillCount: 1,
            avgPricePerLiter: 1
          }
        }
      ]);

      const summary = {
        totalVehicles: new Set(logs.map(l => l.vehicleRegNo)).size,
        totalFuelConsumed: logs.reduce((sum, l) => sum + l.totalQuantity, 0),
        totalExpenditure: logs.reduce((sum, l) => sum + l.totalAmount, 0),
        byFuelType: {
          petrol: logs.filter(l => l.fuelType === 'PETROL').reduce((sum, l) => sum + l.totalQuantity, 0),
          diesel: logs.filter(l => l.fuelType === 'DIESEL').reduce((sum, l) => sum + l.totalQuantity, 0)
        }
      };

      this.sendSuccess(res, {
        summary,
        details: logs
      });
    } catch (error) {
      next(error);
    }
  }

  // Helper method to calculate fuel efficiency
  private async calculateFuelEfficiency(_vehicleId: string, logs: any[]): Promise<any> {
    if (logs.length < 2) return null;

    const sortedLogs = logs.sort((a, b) => a.odometerReading - b.odometerReading);
    const totalDistance = sortedLogs[sortedLogs.length - 1].odometerReading - sortedLogs[0].odometerReading;
    const totalFuel = sortedLogs.reduce((sum, log) => sum + log.quantity, 0);

    return {
      kmPerLiter: totalDistance / totalFuel,
      totalDistance,
      totalFuel
    };
  }
}

export const fuelLogController = new FuelLogController();