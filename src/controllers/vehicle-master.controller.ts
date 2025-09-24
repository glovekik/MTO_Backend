import { Request, Response, NextFunction } from 'express';
import { BaseCRUDController } from './base-crud.controller';
import VehicleMaster from '../models/VehicleMaster.model';

export class VehicleMasterController extends BaseCRUDController<any> {
  constructor() {
    super(VehicleMaster, 'Vehicle');
  }

  // Get vehicle by registration number
  async getByRegNo(req: Request, res: Response, next: NextFunction) {
    try {
      const { vehRegNo } = req.params;

      const vehicle = await VehicleMaster.findOne({ vehRegNo: vehRegNo.toUpperCase() })
        .populate('unitId currentDriverId');

      if (!vehicle) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      this.sendSuccess(res, vehicle);
    } catch (error) {
      next(error);
    }
  }

  // Get available vehicles
  async getAvailableVehicles(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = { status: 'AVAILABLE', isActive: true };
      if (unitId) filters.unitId = unitId;

      const skip = (pagination.page - 1) * pagination.limit;

      const [vehicles, total] = await Promise.all([
        VehicleMaster.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('unitId'),
        VehicleMaster.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, vehicles, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Update vehicle status
  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { status, currentDriverId } = req.body;

      const updateData: any = { status, updatedAt: new Date() };

      if (status === 'IN_USE' && currentDriverId) {
        updateData.currentDriverId = currentDriverId;
      } else if (status === 'AVAILABLE') {
        updateData.currentDriverId = null;
      }

      const vehicle = await VehicleMaster.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!vehicle) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      this.sendSuccess(res, vehicle, 'Vehicle status updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update vehicle odometer
  async updateOdometer(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { totalKm } = req.body;

      const vehicle = await VehicleMaster.findById(id);
      if (!vehicle) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      if (totalKm < vehicle.totalKm!) {
        return this.sendError(res, {
          code: 'INVALID_ODOMETER',
          message: 'New odometer reading cannot be less than current reading',
          field: 'totalKm'
        }, 400);
      }

      vehicle.totalKm = totalKm;
      await vehicle.save();

      this.sendSuccess(res, vehicle, 'Odometer updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get vehicles by unit
  async getVehiclesByUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [vehicles, total] = await Promise.all([
        VehicleMaster.find({ unitId, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('currentDriverId'),
        VehicleMaster.countDocuments({ unitId, isActive: true })
      ]);

      this.sendPaginatedResponse(res, vehicles, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Schedule maintenance
  async scheduleMaintenance(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { nextServiceDue } = req.body;

      const vehicle = await VehicleMaster.findByIdAndUpdate(
        id,
        {
          nextServiceDue,
          status: 'MAINTENANCE',
          updatedAt: new Date()
        },
        { new: true, runValidators: true }
      );

      if (!vehicle) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Vehicle not found'
        }, 404);
      }

      this.sendSuccess(res, vehicle, 'Maintenance scheduled successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const vehicleMasterController = new VehicleMasterController();