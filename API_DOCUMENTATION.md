# MTO Backend API Documentation

## Overview
The MTO Backend has been revamped with comprehensive CRUD operations for all entities based on the provided samples.

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

## Main Entities

### 1. User Master (`/api/users`)
- **POST** `/api/users` - Create new user
- **GET** `/api/users` - List all users (paginated)
- **GET** `/api/users/:id` - Get user by ID
- **PUT** `/api/users/:id` - Update user
- **DELETE** `/api/users/:id` - Delete user
- **PATCH** `/api/users/:id/deactivate` - Soft delete user
- **PATCH** `/api/users/:id/password` - Update password
- **GET** `/api/users/role/:roleId` - Get users by role
- **GET** `/api/users/unit/:unitId` - Get users by unit

### 2. Vehicle Master (`/api/vehicles`)
- **POST** `/api/vehicles` - Add new vehicle
- **GET** `/api/vehicles` - List all vehicles (paginated)
- **GET** `/api/vehicles/:id` - Get vehicle by ID
- **PUT** `/api/vehicles/:id` - Update vehicle
- **DELETE** `/api/vehicles/:id` - Delete vehicle
- **GET** `/api/vehicles/regno/:vehRegNo` - Get by registration number
- **GET** `/api/vehicles/available` - Get available vehicles
- **PATCH** `/api/vehicles/:id/status` - Update vehicle status
- **PATCH** `/api/vehicles/:id/odometer` - Update odometer reading
- **GET** `/api/vehicles/unit/:unitId` - Get vehicles by unit
- **PATCH** `/api/vehicles/:id/maintenance` - Schedule maintenance

### 3. Driver Master (`/api/drivers`)
- **POST** `/api/drivers` - Add new driver
- **GET** `/api/drivers` - List all drivers (paginated)
- **GET** `/api/drivers/:id` - Get driver by ID
- **PUT** `/api/drivers/:id` - Update driver
- **DELETE** `/api/drivers/:id` - Delete driver
- **GET** `/api/drivers/available` - Get available drivers
- **PATCH** `/api/drivers/:id/assign` - Assign to vehicle
- **PATCH** `/api/drivers/:id/release` - Release from vehicle
- **PATCH** `/api/drivers/:id/status` - Update status
- **GET** `/api/drivers/expiring-licenses` - Get drivers with expiring licenses
- **PATCH** `/api/drivers/:id/rating` - Update driver rating

### 4. Fuel Station (`/api/fuel-stations`)
- **POST** `/api/fuel-stations` - Add new station
- **GET** `/api/fuel-stations` - List all stations (paginated)
- **GET** `/api/fuel-stations/:id` - Get station by ID
- **PUT** `/api/fuel-stations/:id` - Update station
- **DELETE** `/api/fuel-stations/:id` - Delete station
- **GET** `/api/fuel-stations/code/:stationCode` - Get by station code
- **GET** `/api/fuel-stations/active` - Get active stations
- **PATCH** `/api/fuel-stations/:id/stock` - Update stock levels
- **PATCH** `/api/fuel-stations/:id/prices` - Update fuel prices
- **GET** `/api/fuel-stations/low-stock` - Get low stock stations
- **GET** `/api/fuel-stations/expiring-contracts` - Get expiring contracts
- **PATCH** `/api/fuel-stations/:id/renew` - Renew contract

### 5. Fuel Log (`/api/fuel-logs`)
- **POST** `/api/fuel-logs` - Create fuel entry
- **GET** `/api/fuel-logs` - List all logs (paginated)
- **GET** `/api/fuel-logs/:id` - Get log by ID
- **PUT** `/api/fuel-logs/:id` - Update log
- **DELETE** `/api/fuel-logs/:id` - Delete log
- **GET** `/api/fuel-logs/vehicle/:vehicleId` - Get logs by vehicle
- **GET** `/api/fuel-logs/driver/:driverId` - Get logs by driver
- **GET** `/api/fuel-logs/pending` - Get pending approvals
- **PATCH** `/api/fuel-logs/:id/approve` - Approve fuel log
- **PATCH** `/api/fuel-logs/:id/reject` - Reject fuel log
- **GET** `/api/fuel-logs/report/consumption` - Get consumption report

### 6. Unit (`/api/units`)
- **POST** `/api/units` - Create new unit
- **GET** `/api/units` - List all units (paginated)
- **GET** `/api/units/:id` - Get unit by ID
- **PUT** `/api/units/:id` - Update unit
- **DELETE** `/api/units/:id` - Delete unit
- **GET** `/api/units/code/:unitCode` - Get by unit code
- **GET** `/api/units/type/:unitType` - Get by type
- **GET** `/api/units/:id/sub-units` - Get sub-units
- **GET** `/api/units/:id/hierarchy` - Get unit hierarchy
- **PATCH** `/api/units/:id/head` - Update unit head
- **PATCH** `/api/units/:id/fuel-quota` - Update fuel quota
- **GET** `/api/units/:id/statistics` - Get unit statistics
- **GET** `/api/units/district/:district` - Get units by district

## Common Query Parameters

### Pagination
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20, max: 100)
- `sort` - Sort field and order (e.g., `-createdAt` for descending)

### Filtering
- Most list endpoints support filtering by entity fields
- Date ranges: Use `fieldName_gte` and `fieldName_lte`
- Text search: Use `search` parameter where supported

## Response Format

### Success Response
```json
{
  "success": true,
  "data": {...},
  "message": "Operation successful"
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "pages": 5
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "field": "fieldName",
    "timestamp": "2025-09-14T10:30:00Z"
  }
}
```

## Error Codes
- `VALIDATION_ERROR` - Input validation failed
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Unique constraint violation
- `UNAUTHORIZED` - Authentication required
- `FORBIDDEN` - Insufficient permissions
- `INSUFFICIENT_STOCK` - Not enough fuel stock
- `INVALID_ODOMETER` - Odometer reading error

## Features

### Base CRUD Controller
All entities inherit from a base CRUD controller providing:
- Standard CRUD operations (Create, Read, Update, Delete)
- Soft delete support
- Bulk operations
- Advanced filtering and search
- Pagination and sorting
- Population of related documents
- Consistent error handling

### Validation
- Input validation using express-validator
- Custom validation rules for Indian phone numbers, vehicle registration, GST numbers, etc.
- Type checking and format validation
- Business logic validation

### Transaction Support
- Atomic operations for complex workflows
- Automatic rollback on errors
- Stock management with transactions

### Reporting
- Fuel consumption reports
- Vehicle efficiency calculations
- Unit-wise statistics
- Driver performance metrics

## Testing

Test the APIs using tools like Postman or curl:

```bash
# Health check
curl http://localhost:5000/api/health

# Create a user (requires auth)
curl -X POST http://localhost:5000/api/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Test User",
    "phoneNo": "9876543210",
    "email": "test@example.com",
    "roleId": "...",
    "unitId": "..."
  }'
```

## Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```