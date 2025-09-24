export interface EndpointConfig {
  path: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  authRequired: boolean;
  rateLimit?: {
    windowMs: number;
    max: number;
  };
  validation?: any[];
  description?: string;
}

export interface ServiceEndpoints {
  basePath: string;
  endpoints: Record<string, EndpointConfig>;
}

export const ENDPOINTS_CONFIG: Record<string, ServiceEndpoints> = {
  auth: {
    basePath: '/api/auth',
    endpoints: {
      login: { path: '/login', method: 'POST', authRequired: false },
      logout: { path: '/logout', method: 'POST', authRequired: true },
      refresh: { path: '/refresh', method: 'POST', authRequired: false }
    }
  },

  driver: {
    basePath: '/api/driver',
    endpoints: {
      assignments: { path: '/assignments', method: 'GET', authRequired: true },
      checkin: { path: '/checkin', method: 'POST', authRequired: true },
      checkout: { path: '/checkout', method: 'POST', authRequired: true },
      odometerStart: { path: '/odometer/start', method: 'POST', authRequired: true },
      odometerEnd: { path: '/odometer/end', method: 'POST', authRequired: true },
      fuelQuota: { path: '/fuel/quota', method: 'GET', authRequired: true },
      fuelRequest: { path: '/fuel/request', method: 'POST', authRequired: true },
      quotaAdditional: { path: '/quota/additional', method: 'POST', authRequired: true },
      breakRequest: { path: '/break/request', method: 'POST', authRequired: true },
      breakRequests: { path: '/break/requests', method: 'GET', authRequired: true },
      tripReport: { path: '/trip/report', method: 'POST', authRequired: true }
    }
  },

  officer: {
    basePath: '/api/officer',
    endpoints: {
      assignments: { path: '/assignments', method: 'GET', authRequired: true },
      vehicles: { path: '/vehicles', method: 'GET', authRequired: true },
      createAssignment: { path: '/assignment/create', method: 'POST', authRequired: true },
      reassignAssignment: { path: '/assignment/:assignmentId/reassign', method: 'PUT', authRequired: true },
      breakRequests: { path: '/break/requests', method: 'GET', authRequired: true },
      approveBreak: { path: '/break/:breakId/approve', method: 'PUT', authRequired: true },
      addProxy: { path: '/proxy/add', method: 'POST', authRequired: true }
    }
  },

  mto: {
    basePath: '/api/mto',
    endpoints: {
      assignments: { path: '/assignments', method: 'GET', authRequired: true },
      driversAvailable: { path: '/drivers/available', method: 'GET', authRequired: true },
      vehiclesAvailable: { path: '/vehicles/available', method: 'GET', authRequired: true },
      createAssignment: { path: '/assignment/create', method: 'POST', authRequired: true },
      reassignmentRequests: { path: '/reassignment/requests', method: 'GET', authRequired: true },
      approveReassignment: { path: '/reassignment/:requestId/approve', method: 'PUT', authRequired: true },
      assignProxy: { path: '/proxy/assign', method: 'POST', authRequired: true },
      fuelReports: { path: '/reports/fuel', method: 'GET', authRequired: true },
      assignmentReports: { path: '/reports/assignments', method: 'GET', authRequired: true }
    }
  },

  bunk: {
    basePath: '/api/bunk',
    endpoints: {
      stations: { path: '/stations', method: 'GET', authRequired: true },
      stationInventory: { path: '/:stationId/inventory', method: 'GET', authRequired: true },
      fuelDispense: { path: '/fuel/dispense', method: 'POST', authRequired: true },
      refillRequest: { path: '/refill/request', method: 'POST', authRequired: true },
      dailyReports: { path: '/reports/daily', method: 'GET', authRequired: true }
    }
  },

  unit: {
    basePath: '/api/unit',
    endpoints: {
      fuelRefillRequests: { path: '/fuel/refill/requests', method: 'GET', authRequired: true },
      approveFuelRefill: { path: '/fuel/refill/:requestId/approve', method: 'PUT', authRequired: true },
      quotaRequests: { path: '/quota/requests', method: 'GET', authRequired: true },
      approveQuota: { path: '/quota/:requestId/approve', method: 'PUT', authRequired: true }
    }
  },

  proxy: {
    basePath: '/api/proxy',
    endpoints: {
      permissions: { path: '/permissions', method: 'GET', authRequired: true },
      fuelPending: { path: '/fuel/pending', method: 'GET', authRequired: true },
      approveFuel: { path: '/fuel/:requestId/approve', method: 'PUT', authRequired: true }
    }
  },

  common: {
    basePath: '/api',
    endpoints: {
      notifications: { path: '/notifications', method: 'GET', authRequired: true },
      readNotification: { path: '/notifications/:notificationId/read', method: 'PUT', authRequired: true },
      profile: { path: '/profile', method: 'GET', authRequired: true },
      updateProfile: { path: '/profile', method: 'PUT', authRequired: true }
    }
  },

  qr: {
    basePath: '/api/qr',
    endpoints: {
      generate: { path: '/generate', method: 'POST', authRequired: true },
      verify: { path: '/verify', method: 'POST', authRequired: true }
    }
  },

  vehicles: {
    basePath: '/api/vehicles',
    endpoints: {
      list: { path: '/', method: 'GET', authRequired: true },
      get: { path: '/:vehicleId', method: 'GET', authRequired: true },
      history: { path: '/:vehicleId/history', method: 'GET', authRequired: true },
      status: { path: '/:vehicleId/status', method: 'GET', authRequired: true },
      getMaintenance: { path: '/:vehicleId/maintenance', method: 'GET', authRequired: true },
      createMaintenance: { path: '/:vehicleId/maintenance', method: 'POST', authRequired: true }
    }
  },

  users: {
    basePath: '/api/users',
    endpoints: {
      list: { path: '/', method: 'GET', authRequired: true },
      get: { path: '/:userId', method: 'GET', authRequired: true },
      update: { path: '/:userId', method: 'PUT', authRequired: true },
      drivers: { path: '/drivers', method: 'GET', authRequired: true },
      officers: { path: '/officers', method: 'GET', authRequired: true },
      proxies: { path: '/proxies', method: 'GET', authRequired: true }
    }
  },

  assignments: {
    basePath: '/api/assignments',
    endpoints: {
      list: { path: '/', method: 'GET', authRequired: true },
      get: { path: '/:assignmentId', method: 'GET', authRequired: true },
      update: { path: '/:assignmentId', method: 'PUT', authRequired: true },
      delete: { path: '/:assignmentId', method: 'DELETE', authRequired: true },
      history: { path: '/:assignmentId/history', method: 'GET', authRequired: true },
      active: { path: '/active', method: 'GET', authRequired: true },
      pending: { path: '/pending', method: 'GET', authRequired: true },
      completed: { path: '/completed', method: 'GET', authRequired: true }
    }
  },

  fuel: {
    basePath: '/api/fuel',
    endpoints: {
      requests: { path: '/requests', method: 'GET', authRequired: true },
      getRequest: { path: '/requests/:requestId', method: 'GET', authRequired: true },
      approveRequest: { path: '/requests/:requestId/approve', method: 'PUT', authRequired: true },
      denyRequest: { path: '/requests/:requestId/deny', method: 'PUT', authRequired: true },
      quota: { path: '/quota', method: 'GET', authRequired: true },
      getUserQuota: { path: '/quota/:userId', method: 'GET', authRequired: true },
      updateUserQuota: { path: '/quota/:userId', method: 'PUT', authRequired: true },
      stations: { path: '/stations', method: 'GET', authRequired: true },
      getStation: { path: '/stations/:stationId', method: 'GET', authRequired: true },
      transactions: { path: '/transactions', method: 'GET', authRequired: true },
      getTransaction: { path: '/transactions/:transactionId', method: 'GET', authRequired: true }
    }
  },

  breaks: {
    basePath: '/api/breaks',
    endpoints: {
      requests: { path: '/requests', method: 'GET', authRequired: true },
      getRequest: { path: '/requests/:requestId', method: 'GET', authRequired: true },
      approveRequest: { path: '/requests/:requestId/approve', method: 'PUT', authRequired: true },
      denyRequest: { path: '/requests/:requestId/deny', method: 'PUT', authRequired: true },
      active: { path: '/active', method: 'GET', authRequired: true },
      history: { path: '/history', method: 'GET', authRequired: true }
    }
  },

  reports: {
    basePath: '/api/reports',
    endpoints: {
      daily: { path: '/daily', method: 'GET', authRequired: true },
      weekly: { path: '/weekly', method: 'GET', authRequired: true },
      monthly: { path: '/monthly', method: 'GET', authRequired: true },
      fuelUsage: { path: '/fuel/usage', method: 'GET', authRequired: true },
      fuelEfficiency: { path: '/fuel/efficiency', method: 'GET', authRequired: true },
      assignmentsSummary: { path: '/assignments/summary', method: 'GET', authRequired: true },
      driversPerformance: { path: '/drivers/performance', method: 'GET', authRequired: true },
      vehiclesUtilization: { path: '/vehicles/utilization', method: 'GET', authRequired: true },
      exportCsv: { path: '/export/csv', method: 'GET', authRequired: true },
      exportPdf: { path: '/export/pdf', method: 'GET', authRequired: true }
    }
  },

  inventory: {
    basePath: '/api/inventory',
    endpoints: {
      tanks: { path: '/tanks', method: 'GET', authRequired: true },
      getTank: { path: '/tanks/:tankId', method: 'GET', authRequired: true },
      tankReadings: { path: '/tanks/:tankId/readings', method: 'GET', authRequired: true },
      addTankReading: { path: '/tanks/:tankId/readings', method: 'POST', authRequired: true },
      pumps: { path: '/pumps', method: 'GET', authRequired: true },
      getPump: { path: '/pumps/:pumpId', method: 'GET', authRequired: true },
      pumpReadings: { path: '/pumps/:pumpId/readings', method: 'GET', authRequired: true },
      addPumpReading: { path: '/pumps/:pumpId/readings', method: 'POST', authRequired: true }
    }
  },

  locations: {
    basePath: '/api/locations',
    endpoints: {
      current: { path: '/current', method: 'GET', authRequired: true },
      history: { path: '/history', method: 'GET', authRequired: true },
      track: { path: '/track', method: 'POST', authRequired: true },
      geofence: { path: '/geofence', method: 'GET', authRequired: true },
      geofenceAlerts: { path: '/geofence/alerts', method: 'GET', authRequired: true }
    }
  },

  settings: {
    basePath: '/api/settings',
    endpoints: {
      getSystem: { path: '/system', method: 'GET', authRequired: true },
      updateSystem: { path: '/system', method: 'PUT', authRequired: true },
      getUser: { path: '/user', method: 'GET', authRequired: true },
      updateUser: { path: '/user', method: 'PUT', authRequired: true },
      getNotifications: { path: '/notifications', method: 'GET', authRequired: true },
      updateNotifications: { path: '/notifications', method: 'PUT', authRequired: true }
    }
  },

  maintenance: {
    basePath: '/api/maintenance',
    endpoints: {
      getSchedule: { path: '/schedule', method: 'GET', authRequired: true },
      createSchedule: { path: '/schedule', method: 'POST', authRequired: true },
      history: { path: '/history', method: 'GET', authRequired: true },
      alerts: { path: '/alerts', method: 'GET', authRequired: true }
    }
  },

  support: {
    basePath: '/api/support',
    endpoints: {
      tickets: { path: '/tickets', method: 'GET', authRequired: true },
      createTicket: { path: '/tickets', method: 'POST', authRequired: true },
      getTicket: { path: '/tickets/:ticketId', method: 'GET', authRequired: true },
      updateTicket: { path: '/tickets/:ticketId', method: 'PUT', authRequired: true }
    }
  },

  analytics: {
    basePath: '/api/analytics',
    endpoints: {
      dashboard: { path: '/dashboard', method: 'GET', authRequired: true },
      fuelTrends: { path: '/fuel/trends', method: 'GET', authRequired: true },
      assignmentMetrics: { path: '/assignment/metrics', method: 'GET', authRequired: true },
      driverStats: { path: '/driver/stats', method: 'GET', authRequired: true },
      vehiclePerformance: { path: '/vehicle/performance', method: 'GET', authRequired: true },
      efficiencyReports: { path: '/efficiency/reports', method: 'GET', authRequired: true }
    }
  },

  upload: {
    basePath: '/api/upload',
    endpoints: {
      profilePicture: { path: '/profile-picture', method: 'POST', authRequired: true },
      documents: { path: '/documents', method: 'POST', authRequired: true },
      vehicleImages: { path: '/vehicle-images', method: 'POST', authRequired: true }
    }
  },

  download: {
    basePath: '/api/download',
    endpoints: {
      report: { path: '/reports/:reportId', method: 'GET', authRequired: true },
      document: { path: '/documents/:documentId', method: 'GET', authRequired: true }
    }
  },

  health: {
    basePath: '/api',
    endpoints: {
      health: { path: '/health', method: 'GET', authRequired: false },
      healthDatabase: { path: '/health/database', method: 'GET', authRequired: true },
      healthServices: { path: '/health/services', method: 'GET', authRequired: true },
      version: { path: '/version', method: 'GET', authRequired: false },
      status: { path: '/status', method: 'GET', authRequired: false }
    }
  }
};

export const getRateLimitConfig = (service: string, endpoint: string) => {
  const config = ENDPOINTS_CONFIG[service]?.endpoints[endpoint];
  return config?.rateLimit || { windowMs: 15 * 60 * 1000, max: 100 };
};

export const getEndpointPath = (service: string, endpoint: string): string => {
  const serviceConfig = ENDPOINTS_CONFIG[service];
  const endpointConfig = serviceConfig?.endpoints[endpoint];
  return serviceConfig && endpointConfig
    ? `${serviceConfig.basePath}${endpointConfig.path}`
    : '';
};