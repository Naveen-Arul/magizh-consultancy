import mongoose from 'mongoose';

const batchSchema = new mongoose.Schema({
  batchNumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  purchaseDate: {
    type: Date,
    default: Date.now
  },
  purchasePrice: {
    type: Number,
    required: true
  }
});

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  genericName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Antibiotic', 'Painkiller', 'Antacid', 'Antihistamine', 'Vitamin', 'Other']
  },
  manufacturer: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  batches: [batchSchema],
  lowStockThreshold: {
    type: Number,
    default: 10
  },
  description: {
    type: String
  }
}, {
  timestamps: true
});

// Virtual field for total quantity across all batches
medicineSchema.virtual('totalQuantity').get(function() {
  return this.batches.reduce((sum, batch) => sum + batch.quantity, 0);
});

// Virtual field to check if stock is low
medicineSchema.virtual('isLowStock').get(function() {
  return this.totalQuantity <= this.lowStockThreshold;
});

// Virtual field to get nearest expiry date
medicineSchema.virtual('nearestExpiry').get(function() {
  if (this.batches.length === 0) return null;
  return this.batches.reduce((nearest, batch) => 
    batch.expiryDate < nearest ? batch.expiryDate : nearest, 
    this.batches[0].expiryDate
  );
});

// Method to check if any batch is near expiry (within 60 days)
medicineSchema.virtual('isNearExpiry').get(function() {
  if (this.batches.length === 0) return false;
  const sixtyDaysFromNow = new Date();
  sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
  return this.batches.some(batch => batch.expiryDate <= sixtyDaysFromNow);
});

// Ensure virtuals are included in JSON
medicineSchema.set('toJSON', { virtuals: true });
medicineSchema.set('toObject', { virtuals: true });

const Medicine = mongoose.model('Medicine', medicineSchema);

export default Medicine;
