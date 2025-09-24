import { Request, Response } from 'express';
import { validationResult } from 'express-validator';

export class BaseController {
  protected handleValidationErrors(req: Request, res: Response): boolean {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: errors.array()
      });
      return true;
    }
    return false;
  }

  protected sendSuccess(res: Response, data: any, message: string = 'Success', statusCode: number = 200) {
    res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  protected sendError(res: Response, message: string, statusCode: number = 400, errors?: any) {
    res.status(statusCode).json({
      success: false,
      message,
      ...(errors && { errors })
    });
  }

  protected handlePagination(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;
    const sort = query.sort || '-createdAt';

    return { page, limit, skip, sort };
  }
}