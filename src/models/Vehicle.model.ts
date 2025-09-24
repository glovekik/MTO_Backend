import mongoose, { Document, Schema } from 'mongoose';

export interface IVehicle extends Document {
  registrationNumber: string;
  make: string;
  vehicleModel: string;
  year: number;
  type: 'sedan' | 'suv' | 'truck' | 'van' | 'bus' | 'other';
  fuelType: 'petrol' | 'diesel' | 'electric' | 'hybrid';
  capacity: number;
  currentOdometer: number;
  status: 'available' | 'in-use' | 'maintenance' | 'retired';
  currentDriverId?: mongoose.Types.ObjectId;
  unit: string;
  lastServiceDate?: Date;
  nextServiceDue?: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VehicleSchema = new Schema<IVehicle>(
  {
    registrationNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    make: {
      type: String,
      required: true
    },
    vehicleModel: {
      type: String,
      required: true
    },
    year: {
      type: Number,
      required: true
    },
    type: {
      type: String,
      enum: ['sedan', 'suv', 'truck', 'van', 'bus', 'other'],
      default: 'sedan'
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid'],
      default: 'petrol'
    },
    capacity: {
      type: Number,
      required: true
    },
    currentOdometer: {
      type: Number,
      default: 0
    },
    status: {
      type: String,
      enum: ['available', 'in-use', 'maintenance', 'retired'],
      default: 'available'
    },
    currentDriverId: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    unit: {
      type: String,
      required: true
    },
    lastServiceDate: Date,
    nextServiceDue: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

VehicleSchema.index({ registrationNumber: 1 });
VehicleSchema.index({ status: 1 });
VehicleSchema.index({ unit: 1 });

export default mongoose.model<IVehicle>('Vehicle', VehicleSchema);