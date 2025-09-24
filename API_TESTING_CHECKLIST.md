# API Testing Checklist - MTO Fleet Management System

## 🔴 Priority 1: Core Authentication & Authorization
These endpoints must work perfectly as they're required for all other operations.

### Authentication Service
- [ ] **POST /api/auth/login**
  - Test valid credentials
  - Test invalid username
  - Test invalid password
  - Test SQL injection attempts
  - Test rate limiting (max 10 attempts/15 min)
  - Verify JWT token generation
  - Verify refresh token generation

- [ ] **POST /api/auth/logout**
  - Test with valid token
  - Test without token
  - Test with expired token
  - Verify token blacklisting (if implemented)

- [ ] **POST /api/auth/refresh**
  - Test with valid refresh token
  - Test with expired refresh token
  - Test with invalid refresh token
  - Verify new token generation

## 🟠 Priority 2: Driver Operations
Critical for daily operations - drivers need these to perform their duties.

### Driver Check-in/Check-out Flow
- [ ] **POST /api/driver/checkin**
  - Test with valid vehicle assignment
  - Test without vehicle assignment
  - Test duplicate check-in
  - Validate odometer reading
  - Validate location data
  - Test with invalid vehicle ID

- [ ] **POST /api/driver/checkout**
  - Test normal checkout
  - Test checkout without prior checkin
  - Validate odometer (must be >= checkin odometer)
  - Calculate distance traveled
  - Test with different vehicle than checkin

### Driver Fuel Management
- [ ] **GET /api/driver/fuel/quota**
  - Test quota retrieval for valid driver
  - Test remaining quota calculation
  - Test monthly reset logic

- [ ] **POST /api/driver/fuel/request**
  - Test within quota limits
  - Test exceeding quota
  - Test emergency request
  - Validate amount boundaries
  - Test request with no vehicle assigned

### Driver Assignments
- [ ] **GET /api/driver/assignments**
  - Test filtering by status (active/pending/completed)
  - Test pagination
  - Test date range filtering
  - Verify only driver's own assignments are returned

### Odometer Readings
- [ ] **POST /api/driver/odometer/start**
  - Test valid reading
  - Test reading less than vehicle's current odometer
  - Test without active assignment

- [ ] **POST /api/driver/odometer/end**
  - Test valid reading
  - Test reading less than start reading
  - Calculate distance and fuel efficiency

## 🟡 Priority 3: Officer & MTO Operations
Management functions for supervisors and administrators.

### Officer Assignment Management
- [ ] **GET /api/officer/assignments**
  - Test filtering by unit
  - Test filtering by date
  - Test filtering by driver
  - Verify authorization (only officer's unit)

- [ ] **POST /api/officer/assignment/create**
  - Test with available driver and vehicle
  - Test with unavailable driver
  - Test with vehicle in maintenance
  - Test overlapping assignments
  - Validate date/time logic

- [ ] **PUT /api/officer/assignment/:assignmentId/reassign**
  - Test reassigning to different driver
  - Test reassigning to different vehicle
  - Test reassigning active assignment
  - Verify notification to original driver

### MTO Administration
- [ ] **GET /api/mto/drivers/available**
  - Test real-time availability
  - Test filtering by unit
  - Test filtering by license type
  - Exclude drivers on leave/break

- [ ] **GET /api/mto/vehicles/available**
  - Test real-time availability
  - Test filtering by type
  - Test filtering by fuel type
  - Exclude vehicles in maintenance

- [ ] **POST /api/mto/assignment/create**
  - Test cross-unit assignments
  - Test priority assignments
  - Test bulk assignments
  - Validate business rules

## 🟢 Priority 4: Fuel Management System
Critical for tracking fuel consumption and preventing fraud.

### Fuel Request Flow
- [ ] **GET /api/fuel/requests**
  - Test filtering by status
  - Test filtering by date range
  - Test pagination
  - Test sorting options

- [ ] **POST /api/fuel/requests/:requestId/approve**
  - Test approval within limits
  - Test partial approval
  - Test approval with conditions
  - Verify quota deduction

- [ ] **POST /api/fuel/requests/:requestId/deny**
  - Test denial with reason
  - Verify notification sent
  - Verify quota not affected

### Fuel Quota Management
- [ ] **GET /api/fuel/quota/:userId**
  - Test individual quota retrieval
  - Test quota history
  - Test quota utilization percentage

- [ ] **PUT /api/fuel/quota/:userId**
  - Test quota increase
  - Test quota decrease
  - Test temporary quota
  - Verify authorization levels

## 🔵 Priority 5: Vehicle Management
Essential for fleet tracking and maintenance.

### Vehicle Operations
- [ ] **GET /api/vehicles**
  - Test filtering by status
  - Test filtering by type
  - Test search by registration number
  - Test pagination

- [ ] **GET /api/vehicles/:vehicleId**
  - Test detailed vehicle info
  - Test current assignment status
  - Test maintenance history

- [ ] **GET /api/vehicles/:vehicleId/status**
  - Test real-time status
  - Test location if GPS equipped
  - Test current driver info

- [ ] **POST /api/vehicles/:vehicleId/maintenance**
  - Test scheduling maintenance
  - Test emergency maintenance
  - Verify vehicle marked unavailable

## ⚪ Priority 6: Reporting & Analytics
Important for management decisions and auditing.

### Reports
- [ ] **GET /api/reports/daily**
  - Test date parameter
  - Test data completeness
  - Test performance with large datasets

- [ ] **GET /api/reports/fuel/usage**
  - Test date range
  - Test grouping by driver/vehicle/unit
  - Test anomaly detection

- [ ] **GET /api/reports/export/csv**
  - Test file generation
  - Test data formatting
  - Test large export handling

## 📋 Testing Scenarios by User Flow

### 1. Complete Driver Day Flow
1. Login → 2. View assignments → 3. Check-in → 4. Start odometer → 5. Request fuel → 6. End odometer → 7. Check-out → 8. Submit trip report

### 2. Complete Fuel Request Flow
1. Driver requests fuel → 2. Officer reviews → 3. Officer approves → 4. Driver receives notification → 5. Bunk dispenses fuel → 6. Transaction recorded

### 3. Assignment Creation Flow
1. MTO checks available resources → 2. Creates assignment → 3. Driver notified → 4. Driver accepts → 5. Assignment activated

## 🔒 Security Testing (All Endpoints)

### Authentication & Authorization
- [ ] Test endpoints without token (should return 401)
- [ ] Test with expired token (should return 401)
- [ ] Test with invalid token (should return 401)
- [ ] Test role-based access (drivers can't access officer endpoints)
- [ ] Test cross-tenant access prevention

### Input Validation
- [ ] Test SQL injection on all text inputs
- [ ] Test XSS attacks on all text inputs
- [ ] Test with missing required fields
- [ ] Test with invalid data types
- [ ] Test boundary values (min/max)
- [ ] Test special characters

### Rate Limiting
- [ ] Test general rate limit (100 requests/15 min)
- [ ] Test auth rate limit (10 login attempts/15 min)
- [ ] Test rate limit headers

## 🚦 Performance Testing

### Load Testing Targets
- [ ] **/api/auth/login** - 100 concurrent users
- [ ] **/api/driver/assignments** - 500 requests/minute
- [ ] **/api/vehicles** - 1000 requests/minute
- [ ] **/api/reports/daily** - 50 concurrent requests

### Response Time Targets
- Authentication endpoints: < 200ms
- Read operations: < 100ms
- Write operations: < 300ms
- Report generation: < 2000ms

## 🧪 Test Data Requirements

### Minimum Test Data Set
- 3 User roles (Driver, Officer, MTO)
- 10 Drivers
- 5 Officers
- 2 MTOs
- 15 Vehicles (various types)
- 20 Assignments (various statuses)
- 50 Fuel requests
- 100 Trip records

## 📊 Testing Tools Recommendations

### API Testing
- **Postman** - Create collections for each service
- **Insomnia** - Alternative to Postman
- **Thunder Client** (VS Code) - Quick testing

### Load Testing
- **Apache JMeter** - Comprehensive load testing
- **K6** - Modern load testing tool
- **Artillery** - Simple load testing

### Automated Testing
```bash
# Install testing dependencies
npm install --save-dev jest supertest @types/jest @types/supertest

# Example test file: tests/auth.test.ts
```

## 📝 Test Documentation Template

For each endpoint test, document:
```
Endpoint: [METHOD] /api/path
Test Case: [Description]
Input: [Request body/params]
Expected Output: [Response status and body]
Actual Output: [What actually happened]
Pass/Fail: [Status]
Notes: [Any observations]
```

## 🎯 Success Criteria

An endpoint is considered fully tested when:
1. ✅ All happy path scenarios pass
2. ✅ All error scenarios return appropriate errors
3. ✅ Authorization is properly enforced
4. ✅ Input validation works correctly
5. ✅ Rate limiting is applied
6. ✅ Response time is within target
7. ✅ Load testing passes

## 🚀 Quick Test Commands

```bash
# Health check
curl http://localhost:5000/api/health

# Login test
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"driver1","password":"password123"}'

# Get endpoints list
curl http://localhost:5000/api/endpoints
```

## Priority Testing Order

1. **Day 1**: Authentication (must work first)
2. **Day 2**: Driver core operations
3. **Day 3**: Fuel management flow
4. **Day 4**: Vehicle and assignment management
5. **Day 5**: Reports and analytics
6. **Day 6**: Security and performance testing

---

**Remember**: Always test in this order:
1. 🟢 Positive scenarios (happy path)
2. 🔴 Negative scenarios (error cases)
3. 🟡 Edge cases (boundaries)
4. 🔒 Security scenarios
5. ⚡ Performance scenarios