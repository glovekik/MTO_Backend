// Microservices Architecture Configuration
export const MICROSERVICES_CONFIG = {
  services: {
    auth: {
      name: 'Authentication Service',
      description: 'Handles user authentication, authorization, and JWT management',
      port: process.env.AUTH_SERVICE_PORT || 5001,
      health: '/health',
      dependencies: ['database']
    },
    fleet: {
      name: 'Fleet Management Service',
      description: 'Manages vehicles, assignments, and fleet operations',
      port: process.env.FLEET_SERVICE_PORT || 5002,
      health: '/health',
      dependencies: ['database', 'auth']
    },
    fuel: {
      name: 'Fuel Management Service',
      description: 'Handles fuel requests, quotas, and dispensing',
      port: process.env.FUEL_SERVICE_PORT || 5003,
      health: '/health',
      dependencies: ['database', 'auth', 'fleet']
    },
    reporting: {
      name: 'Reporting Service',
      description: 'Generates reports and analytics',
      port: process.env.REPORTING_SERVICE_PORT || 5004,
      health: '/health',
      dependencies: ['database', 'auth', 'fleet', 'fuel']
    },
    notification: {
      name: 'Notification Service',
      description: 'Handles push notifications and alerts',
      port: process.env.NOTIFICATION_SERVICE_PORT || 5005,
      health: '/health',
      dependencies: ['database', 'auth']
    }
  },

  apiGateway: {
    port: process.env.API_GATEWAY_PORT || 5000,
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true
    },
    rateLimit: {
      windowMs: 15 * 60 * 1000,
      max: 100
    }
  },

  database: {
    mongodb: {
      uri: process.env.MONGODB_URI,
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD
    }
  },

  messaging: {
    rabbitmq: {
      url: process.env.RABBITMQ_URL || 'amqp://localhost',
      exchanges: {
        events: 'fleet_events',
        commands: 'fleet_commands'
      },
      queues: {
        notifications: 'notification_queue',
        reports: 'report_queue',
        fuel: 'fuel_queue'
      }
    }
  },

  monitoring: {
    logging: {
      level: process.env.LOG_LEVEL || 'info',
      format: 'json',
      transports: ['console', 'file']
    },
    metrics: {
      enabled: process.env.METRICS_ENABLED === 'true',
      port: process.env.METRICS_PORT || 9090
    },
    tracing: {
      enabled: process.env.TRACING_ENABLED === 'true',
      serviceName: 'mto-fleet-management',
      jaegerEndpoint: process.env.JAEGER_ENDPOINT
    }
  },

  security: {
    jwt: {
      secret: process.env.JWT_SECRET,
      expiresIn: process.env.JWT_EXPIRE || '7d',
      refreshExpiresIn: '30d'
    },
    encryption: {
      algorithm: 'aes-256-gcm',
      key: process.env.ENCRYPTION_KEY
    },
    headers: {
      helmet: true,
      cors: true,
      compression: true
    }
  },

  deployment: {
    environment: process.env.NODE_ENV || 'development',
    cluster: {
      enabled: process.env.CLUSTER_ENABLED === 'true',
      workers: parseInt(process.env.CLUSTER_WORKERS || '4')
    },
    healthCheck: {
      interval: 30000,
      timeout: 5000,
      retries: 3
    }
  }
};

// Service Discovery
export const SERVICE_REGISTRY = {
  register: (serviceName: string, serviceUrl: string) => {
    console.log(`Registering service: ${serviceName} at ${serviceUrl}`);
  },

  discover: (serviceName: string): string => {
    const service = MICROSERVICES_CONFIG.services[serviceName as keyof typeof MICROSERVICES_CONFIG.services];
    if (service) {
      return `http://localhost:${service.port}`;
    }
    throw new Error(`Service ${serviceName} not found`);
  },

  health: async (serviceName: string): Promise<boolean> => {
    try {
      const serviceUrl = SERVICE_REGISTRY.discover(serviceName);
      const service = MICROSERVICES_CONFIG.services[serviceName as keyof typeof MICROSERVICES_CONFIG.services];
      // In production, make actual HTTP request to health endpoint
      console.log(`Health check for ${serviceName} at ${serviceUrl}${service.health}`);
      return true;
    } catch (error) {
      return false;
    }
  }
};

// Circuit Breaker Pattern
export class CircuitBreaker {
  private failures = 0;
  private lastFailTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';

  constructor(
    private threshold = 5,
    private timeout = 60000
  ) {}

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      if (this.state === 'HALF_OPEN') {
        this.state = 'CLOSED';
        this.failures = 0;
      }
      return result;
    } catch (error) {
      this.failures++;
      this.lastFailTime = Date.now();

      if (this.failures >= this.threshold) {
        this.state = 'OPEN';
      }
      throw error;
    }
  }
}

// Message Queue Interface
export interface IMessageQueue {
  publish(exchange: string, routingKey: string, message: any): Promise<void>;
  subscribe(queue: string, handler: (message: any) => Promise<void>): Promise<void>;
}

// Event Bus
export class EventBus {
  private events: Map<string, Function[]> = new Map();

  on(event: string, handler: Function): void {
    if (!this.events.has(event)) {
      this.events.set(event, []);
    }
    this.events.get(event)!.push(handler);
  }

  emit(event: string, data: any): void {
    const handlers = this.events.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// Load Balancer Strategy
export type LoadBalancerStrategy = 'round-robin' | 'least-connections' | 'random';

export class LoadBalancer {
  private currentIndex = 0;

  constructor(
    private servers: string[],
    private strategy: LoadBalancerStrategy = 'round-robin'
  ) {}

  getServer(): string {
    switch (this.strategy) {
      case 'round-robin':
        const server = this.servers[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.servers.length;
        return server;

      case 'random':
        return this.servers[Math.floor(Math.random() * this.servers.length)];

      case 'least-connections':
        // In production, track active connections per server
        return this.servers[0];

      default:
        return this.servers[0];
    }
  }
}