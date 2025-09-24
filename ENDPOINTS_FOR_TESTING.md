# API Endpoints for Testing

## Base URL
```
http://localhost:5000/api
```

## Authentication Headers
```
Authorization: Bearer {token}
```

---

## 🔐 Authentication Endpoints

```
POST   /auth/login
POST   /auth/logout
POST   /auth/refresh
```

## 👤 Driver Endpoints

```
GET    /driver/assignments
POST   /driver/checkin
POST   /driver/checkout
POST   /driver/odometer/start
POST   /driver/odometer/end
GET    /driver/fuel/quota
POST   /driver/fuel/request
POST   /driver/quota/additional
POST   /driver/break/request
GET    /driver/break/requests
POST   /driver/trip/report
```

## 👮 Officer Endpoints

```
GET    /officer/assignments
GET    /officer/vehicles
POST   /officer/assignment/create
PUT    /officer/assignment/{assignmentId}/reassign
GET    /officer/break/requests
PUT    /officer/break/{breakId}/approve
POST   /officer/proxy/add
```

## 🚗 MTO Endpoints

```
GET    /mto/assignments
GET    /mto/drivers/available
GET    /mto/vehicles/available
POST   /mto/assignment/create
GET    /mto/reassignment/requests
PUT    /mto/reassignment/{requestId}/approve
POST   /mto/proxy/assign
GET    /mto/reports/fuel
GET    /mto/reports/assignments
```

## ⛽ Bunk Management Endpoints

```
GET    /bunk/stations
GET    /bunk/{stationId}/inventory
POST   /bunk/fuel/dispense
POST   /bunk/refill/request
GET    /bunk/reports/daily
```

## 👥 Unit Officer Endpoints

```
GET    /unit/fuel/refill/requests
PUT    /unit/fuel/refill/{requestId}/approve
GET    /unit/quota/requests
PUT    /unit/quota/{requestId}/approve
```

## 🔄 Proxy Endpoints

```
GET    /proxy/permissions
GET    /proxy/fuel/pending
PUT    /proxy/fuel/{requestId}/approve
```

## 📱 Common/Shared Endpoints

```
GET    /notifications
PUT    /notifications/{notificationId}/read
GET    /profile
PUT    /profile
```

## 📷 QR Code Endpoints

```
POST   /qr/generate
POST   /qr/verify
```

## 🚙 Vehicle Management Endpoints

```
GET    /vehicles
GET    /vehicles/{vehicleId}
GET    /vehicles/{vehicleId}/history
GET    /vehicles/{vehicleId}/status
GET    /vehicles/{vehicleId}/maintenance
POST   /vehicles/{vehicleId}/maintenance
```

## 👥 User Management Endpoints

```
GET    /users
GET    /users/{userId}
PUT    /users/{userId}
GET    /users/drivers
GET    /users/officers
GET    /users/proxies
```

## 📋 Assignment Management Endpoints

```
GET    /assignments
GET    /assignments/{assignmentId}
PUT    /assignments/{assignmentId}
DELETE /assignments/{assignmentId}
GET    /assignments/{assignmentId}/history
GET    /assignments/active
GET    /assignments/pending
GET    /assignments/completed
```

## ⛽ Fuel Management Endpoints

```
GET    /fuel/requests
GET    /fuel/requests/{requestId}
PUT    /fuel/requests/{requestId}/approve
PUT    /fuel/requests/{requestId}/deny
GET    /fuel/quota
GET    /fuel/quota/{userId}
PUT    /fuel/quota/{userId}
GET    /fuel/stations
GET    /fuel/stations/{stationId}
GET    /fuel/transactions
GET    /fuel/transactions/{transactionId}
```

## ☕ Break Management Endpoints

```
GET    /breaks/requests
GET    /breaks/requests/{requestId}
PUT    /breaks/requests/{requestId}/approve
PUT    /breaks/requests/{requestId}/deny
GET    /breaks/active
GET    /breaks/history
```

## 📊 Reporting Endpoints

```
GET    /reports/daily
GET    /reports/weekly
GET    /reports/monthly
GET    /reports/fuel/usage
GET    /reports/fuel/efficiency
GET    /reports/assignments/summary
GET    /reports/drivers/performance
GET    /reports/vehicles/utilization
GET    /reports/export/csv
GET    /reports/export/pdf
```

## 📦 Inventory Management Endpoints

```
GET    /inventory/tanks
GET    /inventory/tanks/{tankId}
GET    /inventory/tanks/{tankId}/readings
POST   /inventory/tanks/{tankId}/readings
GET    /inventory/pumps
GET    /inventory/pumps/{pumpId}
GET    /inventory/pumps/{pumpId}/readings
POST   /inventory/pumps/{pumpId}/readings
```

## 📍 Location/GPS Endpoints

```
GET    /locations/current
GET    /locations/history
POST   /locations/track
GET    /locations/geofence
GET    /locations/geofence/alerts
```

## ⚙️ Settings & Configuration Endpoints

```
GET    /settings/system
PUT    /settings/system
GET    /settings/user
PUT    /settings/user
GET    /settings/notifications
PUT    /settings/notifications
```

## 🔧 Maintenance & Support Endpoints

```
GET    /maintenance/schedule
POST   /maintenance/schedule
GET    /maintenance/history
GET    /maintenance/alerts
GET    /support/tickets
POST   /support/tickets
GET    /support/tickets/{ticketId}
PUT    /support/tickets/{ticketId}
```

## 📈 Analytics & Dashboard Endpoints

```
GET    /analytics/dashboard
GET    /analytics/fuel/trends
GET    /analytics/assignment/metrics
GET    /analytics/driver/stats
GET    /analytics/vehicle/performance
GET    /analytics/efficiency/reports
```

## 📁 File Upload/Download Endpoints

```
POST   /upload/profile-picture
POST   /upload/documents
POST   /upload/vehicle-images
GET    /download/reports/{reportId}
GET    /download/documents/{documentId}
```

## ❤️ Health Check & System Endpoints (No Auth Required)

```
GET    /health
GET    /health/database
GET    /health/services
GET    /version
GET    /status
```

## 🔍 Special Endpoint (No Auth Required)

```
GET    /endpoints     # Lists all available endpoints
```

---

## Sample Request Bodies

### Login
```json
POST /auth/login
{
  "username": "driver1",
  "password": "password123"
}
```

### Driver Check-in
```json
POST /driver/checkin
{
  "vehicleId": "vehicle123",
  "location": "Main Office",
  "odometer": 45000
}
```

### Fuel Request
```json
POST /driver/fuel/request
{
  "amount": 50,
  "reason": "Daily route",
  "vehicleId": "vehicle123"
}
```

### Create Assignment
```json
POST /officer/assignment/create
{
  "driverId": "driver123",
  "vehicleId": "vehicle456",
  "purpose": "Official duty",
  "startLocation": "Office",
  "endLocation": "Airport",
  "scheduledStartTime": "2024-01-15T09:00:00Z",
  "scheduledEndTime": "2024-01-15T18:00:00Z"
}
```

### Update Profile
```json
PUT /profile
{
  "name": "John Doe",
  "phoneNumber": "+1234567890",
  "email": "john.doe@example.com"
}
```

### Track Location
```json
POST /locations/track
{
  "latitude": 12.9716,
  "longitude": 77.5946,
  "timestamp": "2024-01-15T10:30:00Z",
  "vehicleId": "vehicle123"
}
```

---

## Total: 139 Endpoints