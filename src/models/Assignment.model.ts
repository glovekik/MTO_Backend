import mongoose, { Document, Schema } from 'mongoose';

export interface IAssignment extends Document {
  driverId: mongoose.Types.ObjectId;
  vehicleId: mongoose.Types.ObjectId;
  officerId: mongoose.Types.ObjectId;
  unit: string;
  purpose: string;
  startLocation: string;
  endLocation: string;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  startOdometer?: number;
  endOdometer?: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  remarks?: string;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
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
    officerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    unit: {
      type: String,
      required: true
    },
    purpose: {
      type: String,
      required: true
    },
    startLocation: {
      type: String,
      required: true
    },
    endLocation: {
      type: String,
      required: true
    },
    scheduledStartTime: {
      type: Date,
      required: true
    },
    scheduledEndTime: {
      type: Date,
      required: true
    },
    actualStartTime: Date,
    actualEndTime: Date,
    startOdometer: Number,
    endOdometer: Number,
    status: {
      type: String,
      enum: ['pending', 'active', 'completed', 'cancelled'],
      default: 'pending'
    },
    remarks: String
  },
  {
    timestamps: true
  }
);

AssignmentSchema.index({ driverId: 1, status: 1 });
AssignmentSchema.index({ vehicleId: 1, status: 1 });
AssignmentSchema.index({ officerId: 1 });
AssignmentSchema.index({ unit: 1 });
AssignmentSchema.index({ status: 1 });

export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);