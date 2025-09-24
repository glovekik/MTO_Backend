import mongoose, { Schema, Document } from 'mongoose';

export interface IUserMaster extends Document {
  name: string;
  phoneNo: string;
  email: string;
  roleId: mongoose.Types.ObjectId;
  unitId: mongoose.Types.ObjectId;
  badgeNo?: string;
  isIpsOfficer: boolean;
  isActive: boolean;
  password?: string;
  refreshToken?: string;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const UserMasterSchema: Schema = new Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  phoneNo: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    match: [/^[6-9]\d{9}$/, 'Please provide a valid Indian phone number']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  roleId: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    required: [true, 'Role is required']
  },
  unitId: {
    type: Schema.Types.ObjectId,
    ref: 'Unit',
    required: [true, 'Unit is required']
  },
  badgeNo: {
    type: String,
    sparse: true,
    unique: true
  },
  isIpsOfficer: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  password: {
    type: String,
    select: false
  },
  refreshToken: {
    type: String,
    select: false
  },
  lastLogin: Date,
  deletedAt: Date
}, {
  timestamps: true
});

// Indexes
UserMasterSchema.index({ unitId: 1, isActive: 1 });
UserMasterSchema.index({ roleId: 1 });

export default mongoose.model<IUserMaster>('UserMaster', UserMasterSchema);