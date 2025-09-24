import mongoose, { Schema, Document } from 'mongoose';

export interface IUnit extends Document {
  unitName: string;
  unitCode: string;
  unitType: 'POLICE_STATION' | 'HEADQUARTERS' | 'SPECIAL_UNIT' | 'DISTRICT_OFFICE';
  address: string;
  district: string;
  state: string;
  pincode: string;
  contactNo: string;
  headOfficerId?: mongoose.Types.ObjectId;
  parentUnitId?: mongoose.Types.ObjectId;
  vehicleCount?: number;
  personnelCount?: number;
  monthlyFuelQuota?: {
    petrol: number;
    diesel: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const UnitSchema: Schema = new Schema({
  unitName: {
    type: String,
    required: [true, 'Unit name is required'],
    trim: true
  },
  unitCode: {
    type: String,
    required: [true, 'Unit code is required'],
    unique: true,
    uppercase: true
  },
  unitType: {
    type: String,
    required: [true, 'Unit type is required'],
    enum: ['POLICE_STATION', 'HEADQUARTERS', 'SPECIAL_UNIT', 'DISTRICT_OFFICE']
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  district: {
    type: String,
    required: [true, 'District is required'],
    trim: true
  },
  state: {
    type: String,
    required: [true, 'State is required'],
    trim: true
  },
  pincode: {
    type: String,
    required: [true, 'Pincode is required'],
    match: [/^\d{6}$/, 'Invalid pincode format']
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required'],
    match: [/^[6-9]\d{9}$/, 'Please provide a valid phone number']
  },
  headOfficerId: {
    type: Schema.Types.ObjectId,
    ref: 'UserMaster'
  },
  parentUnitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit'
  },
  vehicleCount: {
    type: Number,
    default: 0,
    min: [0, 'Vehicle count cannot be negative']
  },
  personnelCount: {
    type: Number,
    default: 0,
    min: [0, 'Personnel count cannot be negative']
  },
  monthlyFuelQuota: {
    petrol: {
      type: Number,
      default: 0,
      min: [0, 'Quota cannot be negative']
    },
    diesel: {
      type: Number,
      default: 0,
      min: [0, 'Quota cannot be negative']
    }
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
UnitSchema.index({ district: 1, isActive: 1 });
UnitSchema.index({ unitType: 1 });
UnitSchema.index({ parentUnitId: 1 });

export default mongoose.model<IUnit>('Unit', UnitSchema);