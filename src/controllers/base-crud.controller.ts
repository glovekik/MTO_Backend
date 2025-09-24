import { Request, Response, NextFunction } from 'express';
import { Model, Document, FilterQuery } from 'mongoose';
import { validationResult } from 'express-validator';

export interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  populate?: string | string[];
}

export interface QueryOptions {
  filters?: FilterQuery<any>;
  pagination?: PaginationOptions;
  select?: string;
}

export abstract class BaseCRUDController<T extends Document> {
  protected model: Model<T>;
  protected entityName: string;

  constructor(model: Model<T>, entityName: string) {
    this.model = model;
    this.entityName = entityName;
  }

  protected handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Validation failed',
          details: errors.array(),
          timestamp: new Date().toISOString()
        }
      });
      return true;
    }
    return false;
  }

  protected sendSuccess(res: Response, data: any, message?: string, statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      ...(message && { message }),
      data
    });
  }

  protected sendError(res: Response, error: any, statusCode: number = 400) {
    const errorResponse = {
      success: false,
      error: {
        code: error.code || 'UNKNOWN_ERROR',
        message: error.message || 'An error occurred',
        ...(error.field && { field: error.field }),
        timestamp: new Date().toISOString()
      }
    };

    res.status(statusCode).json(errorResponse);
  }

  protected sendPaginatedResponse(res: Response, data: any[], pagination: any) {
    res.json({
      success: true,
      data,
      pagination
    });
  }

  protected parsePagination(query: any): PaginationOptions {
    const page = Math.max(1, parseInt(query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 20));
    const sort = query.sort || '-createdAt';
    const populate = query.populate;

    return { page, limit, sort, populate };
  }

  protected buildQuery(query: any): FilterQuery<T> {
    const filters: FilterQuery<T> = {};

    // Remove pagination and system params
    const { page, limit, sort, populate, ...searchParams } = query;

    // Build filters from remaining params
    Object.keys(searchParams).forEach(key => {
      if (searchParams[key] !== undefined && searchParams[key] !== '') {
        // Handle special cases
        if (key.endsWith('_gte') || key.endsWith('_lte') || key.endsWith('_gt') || key.endsWith('_lt')) {
          const field = key.substring(0, key.lastIndexOf('_'));
          const operator = key.substring(key.lastIndexOf('_') + 1);
          (filters as any)[field] = (filters as any)[field] || {};
          (filters as any)[field][`$${operator}`] = searchParams[key];
        } else if (key === 'search' && searchParams[key]) {
          // Handle text search
          filters['$text'] = { $search: searchParams[key] };
        } else {
          (filters as any)[key] = searchParams[key];
        }
      }
    });

    return filters;
  }

  // Generic CRUD operations
  async create(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const entity = new this.model(req.body);
      const saved = await entity.save();

      this.sendSuccess(res, saved, `${this.entityName} created successfully`, 201);
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        this.sendError(res, {
          code: 'DUPLICATE_ENTRY',
          message: `${field} already exists`,
          field
        }, 409);
      } else {
        next(error);
      }
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const populate = req.query.populate as string;

      let query = this.model.findById(id);
      if (populate) {
        query = query.populate(populate);
      }

      const entity = await query.exec();

      if (!entity) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: `${this.entityName} not found`
        }, 404);
      }

      this.sendSuccess(res, entity);
    } catch (error) {
      next(error);
    }
  }

  async findAll(req: Request, res: Response, next: NextFunction) {
    try {
      const pagination = this.parsePagination(req.query);
      const filters = this.buildQuery(req.query);

      const skip = (pagination.page - 1) * pagination.limit;

      let query = this.model.find(filters)
        .skip(skip)
        .limit(pagination.limit)
        .sort(pagination.sort);

      if (pagination.populate) {
        query = query.populate(pagination.populate);
      }

      const [data, total] = await Promise.all([
        query.exec(),
        this.model.countDocuments(filters)
      ]);

      this.sendPaginatedResponse(res, data, {
        page: pagination.page,
        limit: pagination.limit,
        total,
        pages: Math.ceil(total / pagination.limit)
      });
    } catch (error) {
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const { id } = req.params;
      const updates = req.body;

      const entity = await this.model.findByIdAndUpdate(
        id,
        { ...updates, updatedAt: new Date() },
        { new: true, runValidators: true }
      );

      if (!entity) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: `${this.entityName} not found`
        }, 404);
      }

      this.sendSuccess(res, entity, `${this.entityName} updated successfully`);
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        this.sendError(res, {
          code: 'DUPLICATE_ENTRY',
          message: `${field} already exists`,
          field
        }, 409);
      } else {
        next(error);
      }
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const entity = await this.model.findByIdAndDelete(id);

      if (!entity) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: `${this.entityName} not found`
        }, 404);
      }

      this.sendSuccess(res, { _id: id }, `${this.entityName} deleted successfully`);
    } catch (error) {
      next(error);
    }
  }

  async softDelete(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const entity = await this.model.findByIdAndUpdate(
        id,
        { isActive: false, deletedAt: new Date() },
        { new: true }
      );

      if (!entity) {
        return this.sendError(res, {
          code: 'NOT_FOUND',
          message: `${this.entityName} not found`
        }, 404);
      }

      this.sendSuccess(res, { _id: id, isActive: false }, `${this.entityName} deactivated successfully`);
    } catch (error) {
      next(error);
    }
  }

  async bulkCreate(req: Request, res: Response, next: NextFunction) {
    try {
      if (this.handleValidationErrors(req, res)) return;

      const entities = req.body.data;
      if (!Array.isArray(entities)) {
        return this.sendError(res, {
          code: 'INVALID_INPUT',
          message: 'Data must be an array'
        }, 400);
      }

      const created = await this.model.insertMany(entities, { ordered: false });

      this.sendSuccess(res, {
        created: created.length,
        data: created
      }, `${created.length} ${this.entityName}s created successfully`, 201);
    } catch (error: any) {
      if (error.writeErrors) {
        const errors = error.writeErrors.map((e: any) => ({
          index: e.index,
          error: e.errmsg
        }));
        this.sendError(res, {
          code: 'BULK_CREATE_ERROR',
          message: 'Some entities failed to create',
          errors
        }, 400);
      } else {
        next(error);
      }
    }
  }

  async count(req: Request, res: Response, next: NextFunction) {
    try {
      const filters = this.buildQuery(req.query);
      const count = await this.model.countDocuments(filters);

      this.sendSuccess(res, { count });
    } catch (error) {
      next(error);
    }
  }
}