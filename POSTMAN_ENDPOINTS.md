# Complete MTO Backend API Endpoints for Postman Testing

## Base Configuration
```
BASE_URL: http://localhost:5000
Content-Type: application/json
Authorization: Bearer {token}
```

## 1. USER MASTER ENDPOINTS

### Create User
```
POST {{BASE_URL}}/api/users
Body:
{
  "name": "Rajesh Kumar",
  "phoneNo": "9876543210",
  "email": "rajesh.kumar@police.in",
  "roleId": "64abf20e45c8a9e123456789",
  "unitId": "64abf20e45c8a9e987654321",
  "badgeNo": "AP001234",
  "isIpsOfficer": false,
  "password": "Test@123"
}
```

### Get All Users (Paginated)
```
GET {{BASE_URL}}/api/users?page=1&limit=20&sort=-createdAt
```

### Get User by ID
```
GET {{BASE_URL}}/api/users/64ac1234ef567890abcdef12
```

### Update User
```
PUT {{BASE_URL}}/api/users/64ac1234ef567890abcdef12
Body:
{
  "email": "updated.email@police.in",
  "phoneNo": "9876543211"
}
```

### Delete User
```
DELETE {{BASE_URL}}/api/users/64ac1234ef567890abcdef12
```

### Deactivate User (Soft Delete)
```
PATCH {{BASE_URL}}/api/users/64ac1234ef567890abcdef12/deactivate
```

### Update User Password
```
PATCH {{BASE_URL}}/api/users/64ac1234ef567890abcdef12/password
Body:
{
  "oldPassword": "Test@123",
  "newPassword": "NewTest@456"
}
```

### Get Users by Role
```
GET {{BASE_URL}}/api/users/role/64abf20e45c8a9e123456789?page=1&limit=20
```

### Get Users by Unit
```
GET {{BASE_URL}}/api/users/unit/64abf20e45c8a9e987654321?page=1&limit=20
```

## 2. VEHICLE MASTER ENDPOINTS

### Add Vehicle
```
POST {{BASE_URL}}/api/vehicles
Body:
{
  "vehRegNo": "AP-09-ZZ-1234",
  "makeType": "Mahindra",
  "vehicleModel": "Bolero",
  "year": 2022,
  "fuelType": "DIESEL",
  "tankCapacity": 60,
  "seatingCapacity": 7,
  "status": "AVAILABLE",
  "unitId": "64abf20e45c8a9e123456789"
}
```

### Get All Vehicles (Paginated)
```
GET {{BASE_URL}}/api/vehicles?page=1&limit=20&status=AVAILABLE
```

### Get Vehicle by ID
```
GET {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321
```

### Update Vehicle
```
PUT {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321
Body:
{
  "status": "MAINTENANCE",
  "totalKm": 45000
}
```

### Delete Vehicle
```
DELETE {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321
```

### Get Vehicle by Registration Number
```
GET {{BASE_URL}}/api/vehicles/regno/AP-09-ZZ-1234
```

### Get Available Vehicles
```
GET {{BASE_URL}}/api/vehicles/available?unitId=64abf20e45c8a9e123456789&page=1&limit=20
```

### Update Vehicle Status
```
PATCH {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321/status
Body:
{
  "status": "IN_USE",
  "currentDriverId": "64abf20e45c8a9e111111111"
}
```

### Update Vehicle Odometer
```
PATCH {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321/odometer
Body:
{
  "totalKm": 46500
}
```

### Get Vehicles by Unit
```
GET {{BASE_URL}}/api/vehicles/unit/64abf20e45c8a9e123456789?page=1&limit=20
```

### Schedule Vehicle Maintenance
```
PATCH {{BASE_URL}}/api/vehicles/64abf20e45c8a9e987654321/maintenance
Body:
{
  "nextServiceDue": "2025-10-15T00:00:00Z"
}
```

## 3. DRIVER MASTER ENDPOINTS

### Add Driver
```
POST {{BASE_URL}}/api/drivers
Body:
{
  "name": "Suresh Kumar",
  "phoneNo": "8765432109",
  "licenseNo": "AP20200012345",
  "licenseExpiry": "2026-12-31T00:00:00Z",
  "unitId": "64abf20e45c8a9e123456789",
  "experience": 5,
  "status": "AVAILABLE"
}
```

### Get All Drivers (Paginated)
```
GET {{BASE_URL}}/api/drivers?page=1&limit=20&status=AVAILABLE
```

### Get Driver by ID
```
GET {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222
```

### Update Driver
```
PUT {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222
Body:
{
  "phoneNo": "8765432110",
  "experience": 6
}
```

### Delete Driver
```
DELETE {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222
```

### Get Available Drivers
```
GET {{BASE_URL}}/api/drivers/available?unitId=64abf20e45c8a9e123456789&page=1&limit=20
```

### Assign Driver to Vehicle
```
PATCH {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222/assign
Body:
{
  "vehicleId": "64abf20e45c8a9e987654321"
}
```

### Release Driver from Vehicle
```
PATCH {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222/release
```

### Update Driver Status
```
PATCH {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222/status
Body:
{
  "status": "ON_DUTY"
}
```

### Get Drivers with Expiring Licenses
```
GET {{BASE_URL}}/api/drivers/expiring-licenses?days=30
```

### Update Driver Rating
```
PATCH {{BASE_URL}}/api/drivers/64abf20e45c8a9e222222222/rating
Body:
{
  "rating": 4.5
}
```

## 4. FUEL STATION ENDPOINTS

### Add Fuel Station
```
POST {{BASE_URL}}/api/fuel-stations
Body:
{
  "stationName": "Bharat Petroleum - Main Road",
  "stationCode": "BP001",
  "address": "Main Road, Near Police Station",
  "district": "Hyderabad",
  "state": "Telangana",
  "pincode": "500001",
  "contactNo": "9876543210",
  "ownerName": "Ramesh Enterprises",
  "gstNo": "36AABCU9603R1ZM",
  "contractStartDate": "2025-01-01T00:00:00Z",
  "contractEndDate": "2025-12-31T00:00:00Z",
  "fuelTypes": ["PETROL", "DIESEL"],
  "pricePerLiter": {
    "petrol": 106.50,
    "diesel": 94.25
  }
}
```

### Get All Fuel Stations (Paginated)
```
GET {{BASE_URL}}/api/fuel-stations?page=1&limit=20&district=Hyderabad
```

### Get Fuel Station by ID
```
GET {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333
```

### Update Fuel Station
```
PUT {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333
Body:
{
  "contactNo": "9876543211",
  "ownerName": "Updated Enterprises"
}
```

### Delete Fuel Station
```
DELETE {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333
```

### Get Fuel Station by Code
```
GET {{BASE_URL}}/api/fuel-stations/code/BP001
```

### Get Active Fuel Stations
```
GET {{BASE_URL}}/api/fuel-stations/active?district=Hyderabad&fuelType=DIESEL&page=1&limit=20
```

### Update Fuel Stock
```
PATCH {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333/stock
Body:
{
  "petrolStock": 5000,
  "dieselStock": 8000,
  "operation": "set"
}
```

### Update Fuel Prices
```
PATCH {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333/prices
Body:
{
  "petrolPrice": 107.00,
  "dieselPrice": 95.00
}
```

### Get Low Stock Stations
```
GET {{BASE_URL}}/api/fuel-stations/low-stock?threshold=1000
```

### Get Stations with Expiring Contracts
```
GET {{BASE_URL}}/api/fuel-stations/expiring-contracts?days=30
```

### Renew Station Contract
```
PATCH {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333/renew
Body:
{
  "contractEndDate": "2026-12-31T00:00:00Z",
  "monthlyQuota": {
    "petrol": 10000,
    "diesel": 15000
  }
}
```

## 5. FUEL LOG ENDPOINTS

### Create Fuel Log
```
POST {{BASE_URL}}/api/fuel-logs
Body:
{
  "vehicleId": "64abf20e45c8a9e987654321",
  "driverId": "64abf20e45c8a9e222222222",
  "stationId": "64abf20e45c8a9e333333333",
  "unitId": "64abf20e45c8a9e123456789",
  "fuelType": "DIESEL",
  "quantity": 40,
  "pricePerLiter": 94.25,
  "odometerReading": 47000,
  "receiptNo": "BP001-2025-001234",
  "fillDate": "2025-09-14T10:30:00Z"
}
```

### Get All Fuel Logs (Paginated)
```
GET {{BASE_URL}}/api/fuel-logs?page=1&limit=20&approvalStatus=PENDING
```

### Get Fuel Log by ID
```
GET {{BASE_URL}}/api/fuel-logs/64abf20e45c8a9e444444444
```

### Update Fuel Log
```
PUT {{BASE_URL}}/api/fuel-logs/64abf20e45c8a9e444444444
Body:
{
  "quantity": 45,
  "totalAmount": 4241.25
}
```

### Delete Fuel Log
```
DELETE {{BASE_URL}}/api/fuel-logs/64abf20e45c8a9e444444444
```

### Get Fuel Logs by Vehicle
```
GET {{BASE_URL}}/api/fuel-logs/vehicle/64abf20e45c8a9e987654321?startDate=2025-01-01&endDate=2025-12-31&page=1&limit=20
```

### Get Fuel Logs by Driver
```
GET {{BASE_URL}}/api/fuel-logs/driver/64abf20e45c8a9e222222222?startDate=2025-01-01&endDate=2025-12-31&page=1&limit=20
```

### Get Pending Fuel Approvals
```
GET {{BASE_URL}}/api/fuel-logs/pending?unitId=64abf20e45c8a9e123456789&page=1&limit=20
```

### Approve Fuel Log
```
PATCH {{BASE_URL}}/api/fuel-logs/64abf20e45c8a9e444444444/approve
Body:
{
  "approvedBy": "64ac1234ef567890abcdef12",
  "approvalRemarks": "Verified and approved"
}
```

### Reject Fuel Log
```
PATCH {{BASE_URL}}/api/fuel-logs/64abf20e45c8a9e444444444/reject
Body:
{
  "approvedBy": "64ac1234ef567890abcdef12",
  "approvalRemarks": "Receipt number mismatch"
}
```

### Get Fuel Consumption Report
```
GET {{BASE_URL}}/api/fuel-logs/report/consumption?unitId=64abf20e45c8a9e123456789&startDate=2025-01-01&endDate=2025-12-31
```

## 6. UNIT ENDPOINTS

### Create Unit
```
POST {{BASE_URL}}/api/units
Body:
{
  "unitName": "Hyderabad City Police Station",
  "unitCode": "HYD-PS-001",
  "unitType": "POLICE_STATION",
  "address": "Main Road, Hyderabad",
  "district": "Hyderabad",
  "state": "Telangana",
  "pincode": "500001",
  "contactNo": "9876543210",
  "monthlyFuelQuota": {
    "petrol": 5000,
    "diesel": 8000
  }
}
```

### Get All Units (Paginated)
```
GET {{BASE_URL}}/api/units?page=1&limit=20&unitType=POLICE_STATION
```

### Get Unit by ID
```
GET {{BASE_URL}}/api/units/64abf20e45c8a9e555555555
```

### Update Unit
```
PUT {{BASE_URL}}/api/units/64abf20e45c8a9e555555555
Body:
{
  "contactNo": "9876543211",
  "vehicleCount": 25,
  "personnelCount": 150
}
```

### Delete Unit
```
DELETE {{BASE_URL}}/api/units/64abf20e45c8a9e555555555
```

### Get Unit by Code
```
GET {{BASE_URL}}/api/units/code/HYD-PS-001
```

### Get Units by Type
```
GET {{BASE_URL}}/api/units/type/POLICE_STATION?page=1&limit=20
```

### Get Sub-Units
```
GET {{BASE_URL}}/api/units/64abf20e45c8a9e555555555/sub-units?page=1&limit=20
```

### Get Unit Hierarchy
```
GET {{BASE_URL}}/api/units/64abf20e45c8a9e555555555/hierarchy
```

### Update Unit Head
```
PATCH {{BASE_URL}}/api/units/64abf20e45c8a9e555555555/head
Body:
{
  "headOfficerId": "64ac1234ef567890abcdef12"
}
```

### Update Unit Fuel Quota
```
PATCH {{BASE_URL}}/api/units/64abf20e45c8a9e555555555/fuel-quota
Body:
{
  "petrolQuota": 6000,
  "dieselQuota": 9000
}
```

### Get Unit Statistics
```
GET {{BASE_URL}}/api/units/64abf20e45c8a9e555555555/statistics
```

### Get Units by District
```
GET {{BASE_URL}}/api/units/district/Hyderabad?page=1&limit=20
```

## 7. HEALTH CHECK ENDPOINT

### API Health Check
```
GET {{BASE_URL}}/api/health
```

## TESTING NOTES

### Sample MongoDB ObjectIds for Testing:
```
User ID: 64ac1234ef567890abcdef12
Role ID: 64abf20e45c8a9e123456789
Unit ID: 64abf20e45c8a9e987654321
Vehicle ID: 64abf20e45c8a9e987654321
Driver ID: 64abf20e45c8a9e222222222
Station ID: 64abf20e45c8a9e333333333
Fuel Log ID: 64abf20e45c8a9e444444444
Unit ID 2: 64abf20e45c8a9e555555555
```

### Query Parameters Available:
- **Pagination**: `page`, `limit`, `sort`
- **Date Filters**: `startDate`, `endDate`, `fieldName_gte`, `fieldName_lte`
- **Search**: `search` (where applicable)
- **Populate**: `populate` (to include related documents)

### Common Status Values:
- **Vehicle Status**: AVAILABLE, IN_USE, MAINTENANCE, RETIRED
- **Driver Status**: AVAILABLE, ON_DUTY, OFF_DUTY, ON_LEAVE
- **Fuel Type**: PETROL, DIESEL, CNG, ELECTRIC
- **Unit Type**: POLICE_STATION, HEADQUARTERS, SPECIAL_UNIT, DISTRICT_OFFICE
- **Approval Status**: PENDING, APPROVED, REJECTED

### Authentication Headers:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

### Bulk Operations:
For bulk create operations, wrap the data array in a `data` field:
```json
{
  "data": [
    { /* entity 1 */ },
    { /* entity 2 */ }
  ]
}
```

## POSTMAN COLLECTION SETUP

1. Create Environment Variables:
```
BASE_URL: http://localhost:5000
TOKEN: (your JWT token)
```

2. Pre-request Script for Authentication:
```javascript
pm.request.headers.add({
    key: 'Authorization',
    value: 'Bearer ' + pm.environment.get('TOKEN')
});
```

3. Test Scripts for Token Storage (on login):
```javascript
if (pm.response.code === 200) {
    var jsonData = pm.response.json();
    pm.environment.set("TOKEN", jsonData.data.token);
}
```

## ERROR TESTING ENDPOINTS

### Test Validation Error:
```
POST {{BASE_URL}}/api/users
Body:
{
  "name": "Test",
  "phoneNo": "123",  // Invalid phone
  "email": "invalid-email"  // Invalid email
}
```

### Test Not Found Error:
```
GET {{BASE_URL}}/api/users/000000000000000000000000
```

### Test Duplicate Entry:
```
POST {{BASE_URL}}/api/users
Body:
{
  "phoneNo": "9876543210"  // Already exists
}
```

### Test Insufficient Stock:
```
PATCH {{BASE_URL}}/api/fuel-stations/64abf20e45c8a9e333333333/stock
Body:
{
  "dieselStock": 10000,
  "operation": "subtract"  // More than available
}
```