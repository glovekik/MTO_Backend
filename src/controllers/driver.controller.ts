import { Response } from 'express';
import { BaseController } from './base.controller';
import { AuthRequest } from '../middleware/auth.middleware';

export class DriverController extends BaseController {
  async assignments(_req: AuthRequest, res: Response) {
    try {
      const assignments: any[] = [];
      this.sendSuccess(res, assignments, 'Assignments retrieved successfully');
    } catch (error) {
      this.sendError(res, 'Failed to retrieve assignments', 500);
    }
  }

  async checkin(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { vehicleId, location, odometer } = req.body;
      const checkinData = {
        driverId: req.user?.id,
        vehicleId,
        location,
        odometer,
        checkinTime: new Date()
      };

      this.sendSuccess(res, checkinData, 'Check-in successful');
    } catch (error) {
      this.sendError(res, 'Check-in failed', 500);
    }
  }

  async checkout(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { vehicleId, location, odometer } = req.body;
      const checkoutData = {
        driverId: req.user?.id,
        vehicleId,
        location,
        odometer,
        checkoutTime: new Date()
      };

      this.sendSuccess(res, checkoutData, 'Check-out successful');
    } catch (error) {
      this.sendError(res, 'Check-out failed', 500);
    }
  }

  async odometerStart(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { vehicleId, reading } = req.body;
      const odometerData = {
        driverId: req.user?.id,
        vehicleId,
        startReading: reading,
        timestamp: new Date()
      };

      this.sendSuccess(res, odometerData, 'Odometer start reading recorded');
    } catch (error) {
      this.sendError(res, 'Failed to record odometer reading', 500);
    }
  }

  async odometerEnd(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { vehicleId, reading } = req.body;
      const odometerData = {
        driverId: req.user?.id,
        vehicleId,
        endReading: reading,
        timestamp: new Date()
      };

      this.sendSuccess(res, odometerData, 'Odometer end reading recorded');
    } catch (error) {
      this.sendError(res, 'Failed to record odometer reading', 500);
    }
  }

  async fuelQuota(req: AuthRequest, res: Response) {
    try {
      const quota = {
        driverId: req.user?.id,
        allocated: 100,
        used: 45,
        remaining: 55,
        period: 'monthly'
      };

      this.sendSuccess(res, quota, 'Fuel quota retrieved');
    } catch (error) {
      this.sendError(res, 'Failed to retrieve fuel quota', 500);
    }
  }

  async fuelRequest(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { amount, reason, vehicleId } = req.body;
      const request = {
        driverId: req.user?.id,
        vehicleId,
        amount,
        reason,
        status: 'pending',
        requestedAt: new Date()
      };

      this.sendSuccess(res, request, 'Fuel request submitted', 201);
    } catch (error) {
      this.sendError(res, 'Failed to submit fuel request', 500);
    }
  }

  async quotaAdditional(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { amount, justification } = req.body;
      const request = {
        driverId: req.user?.id,
        amount,
        justification,
        status: 'pending',
        requestedAt: new Date()
      };

      this.sendSuccess(res, request, 'Additional quota request submitted', 201);
    } catch (error) {
      this.sendError(res, 'Failed to submit quota request', 500);
    }
  }

  async breakRequest(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { startTime, endTime, reason } = req.body;
      const request = {
        driverId: req.user?.id,
        startTime,
        endTime,
        reason,
        status: 'pending',
        requestedAt: new Date()
      };

      this.sendSuccess(res, request, 'Break request submitted', 201);
    } catch (error) {
      this.sendError(res, 'Failed to submit break request', 500);
    }
  }

  async breakRequests(req: AuthRequest, res: Response) {
    try {
      const { page, limit } = this.handlePagination(req.query);

      const requests: any[] = [];

      this.sendSuccess(res, {
        requests,
        pagination: {
          page,
          limit,
          total: 0
        }
      }, 'Break requests retrieved');
    } catch (error) {
      this.sendError(res, 'Failed to retrieve break requests', 500);
    }
  }

  async tripReport(req: AuthRequest, res: Response) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const reportData = req.body;
      const report = {
        driverId: req.user?.id,
        ...reportData,
        submittedAt: new Date()
      };

      this.sendSuccess(res, report, 'Trip report submitted', 201);
    } catch (error) {
      this.sendError(res, 'Failed to submit trip report', 500);
    }
  }
}

export default new DriverController();