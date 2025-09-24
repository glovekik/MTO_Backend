import mongoose, { Schema, Document } from 'mongoose';

export interface IDriverMaster extends Document {
  name: string;
  phoneNo: string;
  licenseNo: string;
  licenseExpiry: Date;
  unitId: mongoose.Types.ObjectId;
  assignedVehicleId?: mongoose.Types.ObjectId;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF_DUTY' | 'ON_LEAVE';
  experience: number;
  rating?: number;
  totalTrips?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const DriverMasterSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Driver name is required'],
    trim: true
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  licenseNo: {
    type: String,
    required: [true, 'License number is required'],
    unique: true,
    uppercase: true
  },
  licenseExpiry: {
    type: Date,
    required: [true, 'License expiry date is required'],
    validate: {
      validator: function(value: Date) {
        return value > new Date();
      },
      message: 'License has expired'
    }
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit is required']
  },
  assignedVehicleId: {
    type: Schema.Types.ObjectId,
    ref: 'VehicleMaster'
  },
  status: {
    type: String,
    required: true,
    enum: ['AVAILABLE', 'ON_DUTY', 'OFF_DUTY', 'ON_LEAVE'],
    default: 'AVAILABLE'
  },
  experience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: [0, 'Experience cannot be negative']
  },
  rating: {
    type: Number,
    min: [0, 'Rating cannot be negative'],
    max: [5, 'Rating cannot exceed 5']
  },
  totalTrips: {
    type: Number,
    default: 0,
    min: [0, 'Total trips cannot be negative']
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
DriverMasterSchema.index({ status: 1, unitId: 1 });
DriverMasterSchema.index({ unitId: 1, isActive: 1 });

export default mongoose.model<IDriverMaster>('DriverMaster', DriverMasterSchema);