import mongoose, { Schema, Document } from 'mongoose';

export interface IFuelLog extends Document {
  vehicleId: mongoose.Types.ObjectId;
  driverId: mongoose.Types.ObjectId;
  stationId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG';
  quantity: number;
  pricePerLiter: number;
  totalAmount: number;
  odometerReading: number;
  receiptNo: string;
  approvedBy?: mongoose.Types.ObjectId;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvalRemarks?: string;
  fillDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const FuelLogSchema: Schema = new Schema({
  vehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleMaster',
    required: [true, 'Vehicle is required']
  },
  driverId: {
    type: Schema.Types.ObjectId,
    ref: 'DriverMaster',
    required: [true, 'Driver is required']
  },
  stationId: {
    type: Schema.Types.ObjectId,
    ref: 'FuelStation',
    required: [true, 'Fuel station is required']
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit is required']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['PETROL', 'DIESEL', 'CNG']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0.1, 'Quantity must be greater than 0']
  },
  pricePerLiter: {
    type: Number,
    required: [true, 'Price per liter is required'],
    min: [0, 'Price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Amount cannot be negative']
  },
  odometerReading: {
    type: Number,
    required: [true, 'Odometer reading is required'],
    min: [0, 'Odometer reading cannot be negative']
  },
  receiptNo: {
    type: String,
    required: [true, 'Receipt number is required'],
    unique: true
  },
  approvedBy: {
    type: Schema.Types.ObjectId,
    ref: 'UserMaster'
  },
  approvalStatus: {
    type: String,
    required: true,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  },
  approvalRemarks: String,
  fillDate: {
    type: Date,
    required: [true, 'Fill date is required'],
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
FuelLogSchema.index({ vehicleId: 1, fillDate: -1 });
FuelLogSchema.index({ driverId: 1, fillDate: -1 });
FuelLogSchema.index({ stationId: 1, fillDate: -1 });
FuelLogSchema.index({ unitId: 1, approvalStatus: 1 });

export default mongoose.model<IFuelLog>('FuelLog', FuelLogSchema);