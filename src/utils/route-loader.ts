import { Router, RequestHandler } from 'express';
import { ENDPOINTS_CONFIG } from '../config/endpoints.config';
import { protect } from '../middleware/auth.middleware';
import { asyncHandler } from '../middleware/async.middleware';
import rateLimit from 'express-rate-limit';

export interface RouteController {
  [key: string]: RequestHandler;
}

export class RouteLoader {
  constructor() {
  }

  public loadService(
    serviceName: string,
    controller: RouteController,
    middleware: RequestHandler[] = []
  ): Router {
    const serviceConfig = ENDPOINTS_CONFIG[serviceName];

    if (!serviceConfig) {
      throw new Error(`Service ${serviceName} not found in configuration`);
    }

    const serviceRouter = Router();

    Object.entries(serviceConfig.endpoints).forEach(([endpointName, config]) => {
      const handlers: RequestHandler[] = [];

      // Add rate limiting if specified
      if (config.rateLimit) {
        handlers.push(rateLimit({
          windowMs: config.rateLimit.windowMs,
          max: config.rateLimit.max,
          message: 'Too many requests, please try again later.'
        }));
      }

      // Add authentication middleware if required
      if (config.authRequired) {
        handlers.push(protect);
      }

      // Add custom middleware
      handlers.push(...middleware);

      // Add validation if specified
      if (config.validation) {
        handlers.push(...config.validation);
      }

      // Add the controller handler
      const controllerHandler = controller[endpointName];
      if (!controllerHandler) {
        console.warn(`Handler for ${serviceName}.${endpointName} not implemented`);
        handlers.push((_req, res) => {
          res.status(501).json({
            success: false,
            message: `${serviceName}.${endpointName} not implemented yet`
          });
        });
      } else {
        handlers.push(asyncHandler(controllerHandler));
      }

      // Register the route
      const method = config.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete' | 'patch';
      (serviceRouter as any)[method](config.path, handlers);
    });

    return serviceRouter;
  }

  public loadAllServices(controllers: Record<string, RouteController>): Router {
    const mainRouter = Router();

    Object.keys(ENDPOINTS_CONFIG).forEach(serviceName => {
      const serviceConfig = ENDPOINTS_CONFIG[serviceName];
      const controller = controllers[serviceName] || {};

      const serviceRouter = this.loadService(serviceName, controller);
      mainRouter.use(serviceConfig.basePath, serviceRouter);
    });

    return mainRouter;
  }

  public getRegisteredRoutes(): Array<{
    service: string;
    endpoint: string;
    path: string;
    method: string;
    authRequired: boolean;
  }> {
    const routes: any[] = [];

    Object.entries(ENDPOINTS_CONFIG).forEach(([serviceName, serviceConfig]) => {
      Object.entries(serviceConfig.endpoints).forEach(([endpointName, config]) => {
        routes.push({
          service: serviceName,
          endpoint: endpointName,
          path: `${serviceConfig.basePath}${config.path}`,
          method: config.method,
          authRequired: config.authRequired
        });
      });
    });

    return routes;
  }
}