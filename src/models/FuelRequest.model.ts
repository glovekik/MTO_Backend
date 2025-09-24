import mongoose, { Document, Schema } from 'mongoose';

export interface IFuelRequest extends Document {
  driverId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  assignmentId?: mongoose.Types.ObjectId;
  requestType: 'regular' | 'additional' | 'emergency';
  amount: number;
  reason: string;
  currentOdometer: number;
  lastRefuelOdometer?: number;
  status: 'pending' | 'approved' | 'denied' | 'dispensed';
  approvedBy?: mongoose.Types.ObjectId;
  approvedAt?: Date;
  deniedBy?: mongoose.Types.ObjectId;
  deniedAt?: Date;
  denialReason?: string;
  dispensedAt?: Date;
  dispensedAmount?: number;
  stationId?: string;
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const FuelRequestSchema = new Schema<IFuelRequest>(
  {
    driverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    vehicleId: {
      type: Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: true
    },
    assignmentId: {
      type: Schema.Types.ObjectId,
      ref: 'Assignment'
    },
    requestType: {
      type: String,
      enum: ['regular', 'additional', 'emergency'],
      default: 'regular'
    },
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    reason: {
      type: String,
      required: true
    },
    currentOdometer: {
      type: Number,
      required: true
    },
    lastRefuelOdometer: Number,
    status: {
      type: String,
      enum: ['pending', 'approved', 'denied', 'dispensed'],
      default: 'pending'
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date,
    deniedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    deniedAt: Date,
    denialReason: String,
    dispensedAt: Date,
    dispensedAmount: Number,
    stationId: String,
    remarks: String
  },
  {
    timestamps: true
  }
);

FuelRequestSchema.index({ driverId: 1, status: 1 });
FuelRequestSchema.index({ vehicleId: 1 });
FuelRequestSchema.index({ status: 1 });
FuelRequestSchema.index({ createdAt: -1 });

export default mongoose.model<IFuelRequest>('FuelRequest', FuelRequestSchema);