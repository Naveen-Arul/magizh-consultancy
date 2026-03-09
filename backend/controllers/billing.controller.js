import Billing from '../models/Billing.model.js';
import Medicine from '../models/Medicine.model.js';

// Get all bills
export const getAllBills = async (req, res) => {
  try {
    const bills = await Billing.find()
      .sort({ createdAt: -1 })
      .populate('items.medicineId', 'name');
    res.json(bills);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bills', message: error.message });
  }
};

// Get bill by ID
export const getBillById = async (req, res) => {
  try {
    const bill = await Billing.findById(req.params.id)
      .populate('items.medicineId', 'name');
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bill', message: error.message });
  }
};

// Get bill by bill number
export const getBillByNumber = async (req, res) => {
  try {
    const bill = await Billing.findOne({ billNumber: req.params.billNumber })
      .populate('items.medicineId', 'name');
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bill', message: error.message });
  }
};

// Create new bill
export const createBill = async (req, res) => {
  try {
    const { items, total, date, patientName, patientPhone, paymentType, discount } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }
    
    // Validate stock availability first
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      
      if (!medicine) {
        return res.status(404).json({ 
          error: `Medicine not found: ${item.medicine}` 
        });
      }
      
      // Find the first available batch with sufficient quantity (FIFO)
      let availableBatch = null;
      for (const batch of medicine.batches) {
        if (batch.quantity >= item.quantity) {
          availableBatch = batch;
          break;
        }
      }
      
      if (!availableBatch) {
        return res.status(400).json({ 
          error: `Insufficient stock for ${medicine.name}. Available: ${medicine.totalQuantity}, Requested: ${item.quantity}` 
        });
      }
    }
    
    // Prepare bill items
    const billItems = [];
    let subtotal = 0;
    
    for (const item of items) {
      const medicine = await Medicine.findById(item.medicineId);
      const batch = medicine.batches.find(b => b.quantity >= item.quantity);
      
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      billItems.push({
        medicineId: item.medicineId,
        medicineName: item.medicine || medicine.name,
        batchNumber: batch.batchNumber,
        quantity: item.quantity,
        unitPrice: item.price,
        total: itemTotal
      });
    }
    
    // Create bill
    const discountAmount = discount ? (subtotal * discount) / 100 : 0;
    const grandTotal = total || (subtotal - discountAmount);
    
    const bill = new Billing({
      patientName: patientName || 'Walk-in Customer',
      patientPhone: patientPhone || '',
      items: billItems,
      subtotal,
      discount: discount || 0,
      tax: 0,
      grandTotal,
      paymentMethod: paymentType || 'Cash',
      status: 'Completed'
    });
    
    await bill.save();
    
    // Deduct stock quantities
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const billItem = billItems[i];
      
      const medicine = await Medicine.findById(item.medicineId);
      const batch = medicine.batches.find(b => b.batchNumber === billItem.batchNumber);
      
      if (batch) {
        batch.quantity -= item.quantity;
        await medicine.save();
      }
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Bill created successfully',
      bill,
      billNumber: bill.billNumber
    });
  } catch (error) {
    console.error('Billing error:', error);
    res.status(400).json({ error: 'Failed to create bill', message: error.message });
  }
};

// Update bill status
export const updateBillStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    const bill = await Billing.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json(bill);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update bill status', message: error.message });
  }
};

// Get billing statistics
export const getBillingStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    
    const bills = await Billing.find(query);
    
    const totalSales = bills.reduce((sum, bill) => 
      bill.status === 'Completed' ? sum + bill.grandTotal : sum, 0
    );
    
    const totalBills = bills.length;
    const completedBills = bills.filter(b => b.status === 'Completed').length;
    
    res.json({
      totalSales: Math.round(totalSales * 100) / 100,
      totalBills,
      completedBills,
      averageOrderValue: totalBills > 0 ? Math.round((totalSales / completedBills) * 100) / 100 : 0
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch billing stats', message: error.message });
  }
};

// Delete bill
export const deleteBill = async (req, res) => {
  try {
    const bill = await Billing.findByIdAndDelete(req.params.id);
    
    if (!bill) {
      return res.status(404).json({ error: 'Bill not found' });
    }
    
    res.json({ message: 'Bill deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bill', message: error.message });
  }
};
