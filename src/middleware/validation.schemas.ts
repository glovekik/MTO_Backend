import { body, param, query } from 'express-validator';

// Common validation chains
export const idParamValidation = [
  param('id').isMongoId().withMessage('Invalid ID format')
];

export const paginationValidation = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('sort').optional().isString().withMessage('Sort must be a string')
];

// User Master validations
export const createUserValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phoneNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('roleId').isMongoId().withMessage('Invalid role ID'),
  body('unitId').isMongoId().withMessage('Invalid unit ID'),
  body('badgeNo').optional().trim(),
  body('isIpsOfficer').optional().isBoolean(),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
];

export const updateUserValidation = [
  ...idParamValidation,
  body('name').optional().trim(),
  body('phoneNo').optional().matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('email').optional().isEmail().normalizeEmail().withMessage('Invalid email address'),
  body('roleId').optional().isMongoId().withMessage('Invalid role ID'),
  body('unitId').optional().isMongoId().withMessage('Invalid unit ID')
];

export const updatePasswordValidation = [
  ...idParamValidation,
  body('oldPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters')
];

// Vehicle Master validations
export const createVehicleValidation = [
  body('vehRegNo').matches(/^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/).withMessage('Invalid vehicle registration format'),
  body('makeType').notEmpty().trim().withMessage('Make type is required'),
  body('model').notEmpty().trim().withMessage('Model is required'),
  body('year').isInt({ min: 1900, max: new Date().getFullYear() + 1 }).withMessage('Invalid year'),
  body('fuelType').isIn(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC']).withMessage('Invalid fuel type'),
  body('tankCapacity').isFloat({ min: 0 }).withMessage('Tank capacity must be positive'),
  body('seatingCapacity').isInt({ min: 1 }).withMessage('Seating capacity must be at least 1'),
  body('status').optional().isIn(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED']),
  body('unitId').isMongoId().withMessage('Invalid unit ID')
];

export const updateVehicleValidation = [
  ...idParamValidation,
  body('makeType').optional().trim(),
  body('model').optional().trim(),
  body('year').optional().isInt({ min: 1900, max: new Date().getFullYear() + 1 }),
  body('fuelType').optional().isIn(['PETROL', 'DIESEL', 'CNG', 'ELECTRIC']),
  body('tankCapacity').optional().isFloat({ min: 0 }),
  body('seatingCapacity').optional().isInt({ min: 1 })
];

export const updateVehicleStatusValidation = [
  ...idParamValidation,
  body('status').isIn(['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED']).withMessage('Invalid status'),
  body('currentDriverId').optional().isMongoId().withMessage('Invalid driver ID')
];

export const updateOdometerValidation = [
  ...idParamValidation,
  body('totalKm').isFloat({ min: 0 }).withMessage('Total KM must be positive')
];

// Driver Master validations
export const createDriverValidation = [
  body('name').notEmpty().trim().withMessage('Name is required'),
  body('phoneNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid Indian phone number'),
  body('licenseNo').notEmpty().trim().withMessage('License number is required'),
  body('licenseExpiry').isISO8601().withMessage('Invalid date format')
    .custom((value) => new Date(value) > new Date()).withMessage('License has expired'),
  body('unitId').isMongoId().withMessage('Invalid unit ID'),
  body('experience').isInt({ min: 0 }).withMessage('Experience must be non-negative'),
  body('status').optional().isIn(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'ON_LEAVE'])
];

export const updateDriverValidation = [
  ...idParamValidation,
  body('name').optional().trim(),
  body('phoneNo').optional().matches(/^[6-9]\d{9}$/),
  body('licenseNo').optional().trim(),
  body('licenseExpiry').optional().isISO8601()
    .custom((value) => new Date(value) > new Date()).withMessage('License has expired'),
  body('experience').optional().isInt({ min: 0 })
];

export const assignDriverValidation = [
  ...idParamValidation,
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID')
];

export const updateDriverStatusValidation = [
  ...idParamValidation,
  body('status').isIn(['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'ON_LEAVE']).withMessage('Invalid status')
];

export const updateDriverRatingValidation = [
  ...idParamValidation,
  body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5')
];

// Fuel Station validations
export const createFuelStationValidation = [
  body('stationName').notEmpty().trim().withMessage('Station name is required'),
  body('stationCode').notEmpty().trim().withMessage('Station code is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('district').notEmpty().trim().withMessage('District is required'),
  body('state').notEmpty().trim().withMessage('State is required'),
  body('pincode').matches(/^\d{6}$/).withMessage('Invalid pincode'),
  body('contactNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('ownerName').notEmpty().trim().withMessage('Owner name is required'),
  body('gstNo').optional().matches(/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/)
    .withMessage('Invalid GST number'),
  body('contractStartDate').isISO8601().withMessage('Invalid start date'),
  body('contractEndDate').isISO8601().withMessage('Invalid end date')
    .custom((value, { req }) => new Date(value) > new Date(req.body.contractStartDate))
    .withMessage('End date must be after start date'),
  body('fuelTypes').isArray({ min: 1 }).withMessage('At least one fuel type is required'),
  body('pricePerLiter.petrol').isFloat({ min: 0 }).withMessage('Petrol price must be positive'),
  body('pricePerLiter.diesel').isFloat({ min: 0 }).withMessage('Diesel price must be positive')
];

export const updateStockValidation = [
  ...idParamValidation,
  body('petrolStock').optional().isFloat({ min: 0 }),
  body('dieselStock').optional().isFloat({ min: 0 }),
  body('operation').optional().isIn(['set', 'add', 'subtract'])
];

export const updatePricesValidation = [
  ...idParamValidation,
  body('petrolPrice').optional().isFloat({ min: 0 }).withMessage('Petrol price must be positive'),
  body('dieselPrice').optional().isFloat({ min: 0 }).withMessage('Diesel price must be positive')
];

// Fuel Log validations
export const createFuelLogValidation = [
  body('vehicleId').isMongoId().withMessage('Invalid vehicle ID'),
  body('driverId').isMongoId().withMessage('Invalid driver ID'),
  body('stationId').isMongoId().withMessage('Invalid station ID'),
  body('unitId').isMongoId().withMessage('Invalid unit ID'),
  body('fuelType').isIn(['PETROL', 'DIESEL', 'CNG']).withMessage('Invalid fuel type'),
  body('quantity').isFloat({ min: 0.1 }).withMessage('Quantity must be greater than 0'),
  body('pricePerLiter').isFloat({ min: 0 }).withMessage('Price must be positive'),
  body('odometerReading').isFloat({ min: 0 }).withMessage('Odometer reading must be positive'),
  body('receiptNo').notEmpty().trim().withMessage('Receipt number is required'),
  body('fillDate').optional().isISO8601().withMessage('Invalid date format')
];

export const approveFuelLogValidation = [
  ...idParamValidation,
  body('approvedBy').isMongoId().withMessage('Invalid approver ID'),
  body('approvalRemarks').optional().trim()
];

export const rejectFuelLogValidation = [
  ...idParamValidation,
  body('approvedBy').isMongoId().withMessage('Invalid approver ID'),
  body('approvalRemarks').notEmpty().trim().withMessage('Remarks are required for rejection')
];

// Unit validations
export const createUnitValidation = [
  body('unitName').notEmpty().trim().withMessage('Unit name is required'),
  body('unitCode').notEmpty().trim().withMessage('Unit code is required'),
  body('unitType').isIn(['POLICE_STATION', 'HEADQUARTERS', 'SPECIAL_UNIT', 'DISTRICT_OFFICE'])
    .withMessage('Invalid unit type'),
  body('address').notEmpty().withMessage('Address is required'),
  body('district').notEmpty().trim().withMessage('District is required'),
  body('state').notEmpty().trim().withMessage('State is required'),
  body('pincode').matches(/^\d{6}$/).withMessage('Invalid pincode'),
  body('contactNo').matches(/^[6-9]\d{9}$/).withMessage('Invalid phone number'),
  body('headOfficerId').optional().isMongoId().withMessage('Invalid officer ID'),
  body('parentUnitId').optional().isMongoId().withMessage('Invalid parent unit ID')
];

export const updateUnitValidation = [
  ...idParamValidation,
  body('unitName').optional().trim(),
  body('unitType').optional().isIn(['POLICE_STATION', 'HEADQUARTERS', 'SPECIAL_UNIT', 'DISTRICT_OFFICE']),
  body('address').optional(),
  body('district').optional().trim(),
  body('state').optional().trim(),
  body('pincode').optional().matches(/^\d{6}$/),
  body('contactNo').optional().matches(/^[6-9]\d{9}$/)
];

export const updateUnitHeadValidation = [
  ...idParamValidation,
  body('headOfficerId').isMongoId().withMessage('Invalid officer ID')
];

export const updateFuelQuotaValidation = [
  ...idParamValidation,
  body('petrolQuota').optional().isFloat({ min: 0 }).withMessage('Petrol quota must be positive'),
  body('dieselQuota').optional().isFloat({ min: 0 }).withMessage('Diesel quota must be positive')
];