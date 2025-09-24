import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import { BaseCRUDController } from './base-crud.controller';
import UserMaster, { IUserMaster } from '../models/UserMaster.model';

export class UserMasterController extends BaseCRUDController<IUserMaster> {
  constructor() {
    super(UserMaster, 'User');
  }

  // Override create to hash password
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      // Hash password if provided
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }

      const user = new UserMaster(req.body);
      const saved = await user.save();

      // Remove password from response
      const userResponse = saved.toObject();
      delete userResponse.password;

      this.sendSuccess(res, userResponse, 'User created successfully', 201);
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        this.sendError(res, {
          code: field === 'phoneNo' ? 'DUPLICATE_PHONE' : 'DUPLICATE_EMAIL',
          message: `${field === 'phoneNo' ? 'Phone' : 'Email'} already registered`,
          field
        }, 409);
      } else {
        next(error);
      }
    }
  }

  // Custom method to get users by role
  async getUsersByRole(req: Request, res: Response, next: NextFunction) {
    try {
      const { roleId } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [users, total] = await Promise.all([
        UserMaster.find({ roleId, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('roleId unitId')
          .select('-password -refreshToken'),
        UserMaster.countDocuments({ roleId, isActive: true })
      ]);

      this.sendPaginatedResponse(res, users, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Custom method to get users by unit
  async getUsersByUnit(req: Request, res: Response, next: NextFunction) {
    try {
      const { unitId } = req.params;
      const pagination = this.parsePagination(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      const [users, total] = await Promise.all([
        UserMaster.find({ unitId, isActive: true })
          .skip(skip)
          .limit(pagination.limit)
          .sort(pagination.sort)
          .populate('roleId unitId')
          .select('-password -refreshToken'),
        UserMaster.countDocuments({ unitId, isActive: true })
      ]);

      this.sendPaginatedResponse(res, users, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  // Update user password
  async updatePassword(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const { oldPassword, newPassword } = req.body;

      const user = await UserMaster.findById(id).select('+password');
      if (!user) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: 'User not found'
        }, 404);
      }

      // Verify old password
      const isMatch = await bcrypt.compare(oldPassword, user.password!);
      if (!isMatch) {
        return this.sendError(res, {
          code: 'INVALID_PASSWORD',
          message: 'Current password is incorrect'
        }, 401);
      }

      // Hash and update new password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      this.sendSuccess(res, { _id: id }, 'Password updated successfully');
    } catch (error) {
      next(error);
    }
  }

  // Deactivate user (soft delete)
  async deactivateUser(req: Request, res: Response, next: NextFunction) {
    return this.softDelete(req, res, next);
  }
}

export const userMasterController = new UserMasterController();