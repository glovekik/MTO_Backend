import { Request, Response, NextFunction } from 'express';
import { BaseCRUDController } from './base-crud.controller';
import FuelStation, { IFuelStation } from '../models/FuelStation.model';

export class FuelStationController extends BaseCRUDController<IFuelStation> {
  constructor() {
    super(FuelStation, 'Fuel Station');
  }

  // Get station by code
  async getByStationCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { stationCode } = req.params;

      const station = await FuelStation.findOne({
        stationCode: stationCode.toUpperCase()
      });

      if (!station) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel station not found'
        }, 404);
      }

      this.sendSuccess(res, station);
    } catch (error) {
      next(error);
    }
  }

  // Get active stations
  async getActiveStations(req: Request, res: Response, next: NextFunction) {
    try {
      const { district, fuelType } = req.query;
      const pagination = this.parsePagination(req.query);

      const filters: any = {
        isActive: true,
        contractEndDate: { $gt: new Date() }
      };

      if (district) filters.district = district;
      if (fuelType) filters.fuelTypes = fuelType;

      const skip = (pagination.page - 1) * pagination.limit;

      const [stations, total] = await Promise.all([
        FuelStation.find(filters)
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort),
        FuelStation.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, stations, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Update stock levels
  async updateStock(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { petrolStock, dieselStock, operation = 'set' } = req.body;

      const station = await FuelStation.findById(id);
      if (!station) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel station not found'
        }, 404);
      }

      if (operation === 'add') {
        if (petrolStock) station.currentStock.petrol += petrolStock;
        if (dieselStock) station.currentStock.diesel += dieselStock;
      } else if (operation === 'subtract') {
        if (petrolStock) {
          if (station.currentStock.petrol < petrolStock) {
            return this.sendError(res, {
              code: 'INSUFFICIENT_STOCK',
              message: 'Insufficient petrol stock',
              field: 'petrolStock'
            }, 400);
          }
          station.currentStock.petrol -= petrolStock;
        }
        if (dieselStock) {
          if (station.currentStock.diesel < dieselStock) {
            return this.sendError(res, {
              code: 'INSUFFICIENT_STOCK',
              message: 'Insufficient diesel stock',
              field: 'dieselStock'
            }, 400);
          }
          station.currentStock.diesel -= dieselStock;
        }
      } else {
        if (petrolStock !== undefined) station.currentStock.petrol = petrolStock;
        if (dieselStock !== undefined) station.currentStock.diesel = dieselStock;
      }

      await station.save();

      this.sendSuccess(res, station, 'Stock updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Update fuel prices
  async updatePrices(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { petrolPrice, dieselPrice } = req.body;

      const updateData: any = { updatedAt: new Date() };
      if (petrolPrice !== undefined) updateData['pricePerLiter.petrol'] = petrolPrice;
      if (dieselPrice !== undefined) updateData['pricePerLiter.diesel'] = dieselPrice;

      const station = await FuelStation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!station) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel station not found'
        }, 404);
      }

      this.sendSuccess(res, station, 'Prices updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Get stations with low stock
  async getLowStockStations(req: Request, res: Response, next: NextFunction) {
    try {
      const threshold = parseInt(req.query.threshold as string) || 1000;

      const stations = await FuelStation.find({
        isActive: true,
        $or: [
          { 'currentStock.petrol': { $lt: threshold } },
          { 'currentStock.diesel': { $lt: threshold } }
        ]
      });

      this.sendSuccess(res, stations, `Found ${stations.length} stations with low stock`);
    } catch (error) {
      next(error);
    }
  }

  // Get stations with expiring contracts
  async getExpiringContracts(req: Request, res: Response, next: NextFunction) {
    try {
      const daysAhead = parseInt(req.query.days as string) || 30;
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + daysAhead);

      const stations = await FuelStation.find({
        contractEndDate: {
          $gte: new Date(),
          $lte: expiryDate
        },
        isActive: true
      });

      this.sendSuccess(res, stations, `Found ${stations.length} stations with expiring contracts`);
    } catch (error) {
      next(error);
    }
  }

  // Renew contract
  async renewContract(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { contractEndDate, monthlyQuota } = req.body;

      const updateData: any = {
        contractEndDate,
        updatedAt: new Date()
      };

      if (monthlyQuota) {
        updateData['monthlyQuota.petrol'] = monthlyQuota.petrol;
        updateData['monthlyQuota.diesel'] = monthlyQuota.diesel;
      }

      const station = await FuelStation.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!station) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'Fuel station not found'
        }, 404);
      }

      this.sendSuccess(res, station, 'Contract renewed successfully');
    } catch (error) {
      next(error);
    }
  }
}

export const fuelStationController = new FuelStationController();