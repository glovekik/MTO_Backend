import { Request, Response, NextFunction, RequestHandler } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.utils';
import User from '../models/User.model';

export interface AuthRequest extends Request {
  user?: TokenPayload;
}

export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    // Extract token from header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
      return;
    }

    try {
      // Verify token
      const decoded = verifyToken(token);

      // Check if user still exists
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        res.status(401).json({
          success: false,
          message: 'User no longer exists'
        });
        return;
      }

      if (!user.isActive) {
        res.status(401).json({
          success: false,
          message: 'User account is deactivated'
        });
        return;
      }

      // Add user to request
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
    return;
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]): RequestHandler => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
      return;
    }

    next();
  };
};