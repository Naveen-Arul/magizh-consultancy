import mongoose from 'mongoose';

const billItemSchema = new mongoose.Schema({
  medicineId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: true
  },
  medicineName: {
    type: String,
    required: true
  },
  batchNumber: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0
  },
  total: {
    type: Number,
    required: true
  }
});

const billingSchema = new mongoose.Schema({
  billNumber: {
    type: String,
    unique: true
  },
  patientName: {
    type: String,
    required: true,
    trim: true
  },
  patientPhone: {
    type: String,
    trim: true
  },
  items: [billItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0
  },
  tax: {
    type: Number,
    default: 0,
    min: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Other'],
    default: 'Cash'
  },
  status: {
    type: String,
    enum: ['Completed', 'Pending', 'Cancelled'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

// Auto-generate bill number if not provided
billingSchema.pre('save', async function(next) {
  if (!this.billNumber) {
    const count = await mongoose.model('Billing').countDocuments();
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0].replace(/-/g, '');
    this.billNumber = `BILL${dateStr}${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Billing = mongoose.model('Billing', billingSchema);

export default Billing;
