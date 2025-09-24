import mongoose, { Schema, Document } from 'mongoose';

export interface IFuelStation extends Document {
  stationName: string;
  stationCode: string;
  address: string;
  district: string;
  state: string;
  pincode: string;
  contactNo: string;
  ownerName: string;
  gstNo?: string;
  contractStartDate: Date;
  contractEndDate: Date;
  fuelTypes: string[];
  monthlyQuota: {
    petrol: number;
    diesel: number;
  };
  currentStock: {
    petrol: number;
    diesel: number;
  };
  pricePerLiter: {
    petrol: number;
    diesel: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

const FuelStationSchema: Schema = new Schema({
  stationName: {
    type: String,
    required: [true, 'Station name is required'],
    trim: true
  },
  stationCode: {
    type: String,
    required: [true, 'Station code is required'],
    unique: true,
    uppercase: true
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
  ownerName: {
    type: String,
    required: [true, 'Owner name is required'],
    trim: true
  },
  gstNo: {
    type: String,
    match: [/^\d{2}[A-Z]{5}\d{4}[A-Z]{1}[A-Z\d]{1}[Z]{1}[A-Z\d]{1}$/, 'Invalid GST number format']
  },
  contractStartDate: {
    type: Date,
    required: [true, 'Contract start date is required']
  },
  contractEndDate: {
    type: Date,
    required: [true, 'Contract end date is required'],
    validate: {
      validator: function(this: IFuelStation, value: Date) {
        return value > this.contractStartDate;
      },
      message: 'Contract end date must be after start date'
    }
  },
  fuelTypes: {
    type: [String],
    required: true,
    validate: {
      validator: function(value: string[]) {
        return value.length > 0;
      },
      message: 'At least one fuel type is required'
    }
  },
  monthlyQuota: {
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
  currentStock: {
    petrol: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    },
    diesel: {
      type: Number,
      default: 0,
      min: [0, 'Stock cannot be negative']
    }
  },
  pricePerLiter: {
    petrol: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    diesel: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
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
FuelStationSchema.index({ district: 1, isActive: 1 });
FuelStationSchema.index({ contractEndDate: 1 });

export default mongoose.model<IFuelStation>('FuelStation', FuelStationSchema);