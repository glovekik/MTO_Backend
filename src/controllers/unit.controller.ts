import { Request, Response, NextFunction } from 'express';
import { BaseCRUDController } from './base-crud.controller';
import Unit, { IUnit } from '../models/Unit.model';
import UserMaster from '../models/UserMaster.model';
import VehicleMaster from '../models/VehicleMaster.model';

export class UnitController extends BaseCRUDController<IUnit> {
  constructor() {
    super(Unit, 'Unit');
  }

  // Get unit by code
  async getByUnitCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitCode } = req.params;

      const unit = await Unit.findOne({
        unitCode: unitCode.toUpperCase()
      }).populate('headOfficerId parentUnitId');

      if (!unit) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Unit not found'
        }, 404);
      }

      this.sendSuccess(res, unit);
    } catch (error) {
      next(error);
    }
  }

  // Get units by type
  async getByType(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitType } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [units, total] = await Promise.all([
        Unit.find({ unitType, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('headOfficerId'),
        Unit.countDocuments({ unitType, isActive: true })
      ]);

      this.sendPaginatedResponse(res, units, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Get sub-units
  async getSubUnits(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [units, total] = await Promise.all([
        Unit.find({ parentUnitId: id, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('headOfficerId'),
        Unit.countDocuments({ parentUnitId: id, isActive: true })
      ]);

      this.sendPaginatedResponse(res, units, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Get unit hierarchy
  async getHierarchy(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const unit = await Unit.findById(id);
      if (!unit) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Unit not found'
        }, 404);
      }

      // Get parent units
      const parents = [];
      let currentUnit = unit;
      while (currentUnit.parentUnitId) {
        const parent = await Unit.findById(currentUnit.parentUnitId);
        if (!parent) break;
        parents.push(parent);
        currentUnit = parent;
      }

      // Get child units (one level deep)
      const children = await Unit.find({ parentUnitId: id, isActive: true });

      this.sendSuccess(res, {
        unit,
        parents: parents.reverse(),
        children
      });
    } catch (error) {
      next(error);
    }
  }

  // Update unit head
  async updateHead(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { headOfficerId } = req.body;

      // Validate officer exists
      const officer = await UserMaster.findById(headOfficerId);
      if (!officer) {
        return this.sendError(res, {
          code: 'OFFICER_NOT_FOUND',
          message: 'Officer not found'
        }, 404);
      }

      const unit = await Unit.findByIdAndUpdate(
        id,
        { headOfficerId, updatedAt: new Date() },
        { new: true }
      ).populate('headOfficerId');

      if (!unit) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Unit not found'
        }, 404);
      }

      this.sendSuccess(res, unit, 'Unit head updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update fuel quota
  async updateFuelQuota(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { petrolQuota, dieselQuota } = req.body;

      const updateData: any = { updatedAt: new Date() };
      if (petrolQuota !== undefined) updateData['monthlyFuelQuota.petrol'] = petrolQuota;
      if (dieselQuota !== undefined) updateData['monthlyFuelQuota.diesel'] = dieselQuota;

      const unit = await Unit.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!unit) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Unit not found'
        }, 404);
      }

      this.sendSuccess(res, unit, 'Fuel quota updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get unit statistics
  async getStatistics(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const unit = await Unit.findById(id);
      if (!unit) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Unit not found'
        }, 404);
      }

      // Get counts
      const [personnelCount, vehicleCount, activeVehicles, availableVehicles] = await Promise.all([
        UserMaster.countDocuments({ unitId: id, isActive: true }),
        VehicleMaster.countDocuments({ unitId: id, isActive: true }),
        VehicleMaster.countDocuments({ unitId: id, isActive: true, status: 'IN_USE' }),
        VehicleMaster.countDocuments({ unitId: id, isActive: true, status: 'AVAILABLE' })
      ]);

      // Update unit counts
      unit.personnelCount = personnelCount;
      unit.vehicleCount = vehicleCount;
      await unit.save();

      this.sendSuccess(res, {
        unit: {
          _id: unit._id,
          unitName: unit.unitName,
          unitCode: unit.unitCode
        },
        statistics: {
          personnelCount,
          vehicleCount,
          activeVehicles,
          availableVehicles,
          vehiclesInMaintenance: vehicleCount - activeVehicles - availableVehicles,
          monthlyFuelQuota: unit.monthlyFuelQuota
        }
      });
    } catch (error) {
      next(error);
    }
  }

  // Get units by district
  async getByDistrict(req: Request, res: Response, next: NextFunction) {
    try {
      const { district } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [units, total] = await Promise.all([
        Unit.find({ district, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('headOfficerId'),
        Unit.countDocuments({ district, isActive: true })
      ]);

      this.sendPaginatedResponse(res, units, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }
}

export const unitController = new UnitController();