import mongoose, { Schema, Document } from 'mongoose';

export interface IVehicleMaster extends Document {
  vehRegNo: string;
  makeType: string;
  vehicleModel: string;
  year: number;
  fuelType: 'PETROL' | 'DIESEL' | 'CNG' | 'ELECTRIC';
  tankCapacity: number;
  seatingCapacity: number;
  status: 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'RETIRED';
  unitId: mongoose.Types.ObjectId;
  currentDriverId?: mongoose.Types.ObjectId;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  totalKm?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const VehicleMasterSchema: Schema = new Schema({
  vehRegNo: {
    type: String,
    required: [true, 'Vehicle registration number is required'],
    unique: true,
    uppercase: true,
    match: [/^[A-Z]{2}-\d{2}-[A-Z]{1,2}-\d{4}$/, 'Invalid vehicle registration format']
  },
  makeType: {
    type: String,
    required: [true, 'Make type is required'],
    trim: true
  },
  vehicleModel: {
    type: String,
    required: [true, 'Vehicle model is required'],
    trim: true
  },
  year: {
    type: Number,
    required: [true, 'Year is required'],
    min: [1900, 'Year must be after 1900'],
    max: [new Date().getFullYear() + 1, 'Invalid year']
  },
  fuelType: {
    type: String,
    required: [true, 'Fuel type is required'],
    enum: ['PETROL', 'DIESEL', 'CNG', 'ELECTRIC']
  },
  tankCapacity: {
    type: Number,
    required: [true, 'Tank capacity is required'],
    min: [0, 'Tank capacity must be positive']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: [1, 'Seating capacity must be at least 1']
  },
  status: {
    type: String,
    required: true,
    enum: ['AVAILABLE', 'IN_USE', 'MAINTENANCE', 'RETIRED'],
    default: 'AVAILABLE'
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit is required']
  },
  currentDriverId: {
    type: Schema.Types.ObjectId,
    ref: 'DriverMaster'
  },
  lastServiceDate: Date,
  nextServiceDue: Date,
  totalKm: {
    type: Number,
    default: 0,
    min: [0, 'Total KM cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
VehicleMasterSchema.index({ status: 1, unitId: 1 });
VehicleMasterSchema.index({ unitId: 1, isActive: 1 });

export default mongoose.model<IVehicleMaster>('VehicleMaster', VehicleMasterSchema);