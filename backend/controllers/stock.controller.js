import Medicine from '../models/Medicine.model.js';

// Get all medicines with stock info
export const getAllMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().sort({ name: 1 });
    
    // Check if we need flattened batch view (for Stock page)
    if (req.query.flat === 'true') {
      const flattenedStock = [];
      medicines.forEach(med => {
        med.batches.forEach(batch => {
          flattenedStock.push({
            _id: batch._id.toString(),
            medicineId: med._id,
            name: med.name,
            quantity: batch.quantity,
            expiry: batch.expiryDate.toISOString().split('T')[0],
            batch: batch.batchNumber,
            price: med.price
          });
        });
      });
      return res.json(flattenedStock);
    }
    
    // Return regular medicine list with batches (for Billing page)
    const simplifiedMedicines = medicines.map(med => {
      const totalQuantity = med.batches.reduce((sum, batch) => sum + batch.quantity, 0);
      return {
        _id: med._id,
        name: med.name,
        genericName: med.genericName,
        category: med.category,
        manufacturer: med.manufacturer,
        price: med.price,
        quantity: totalQuantity,
        batch: med.batches.length > 0 ? med.batches[0].batchNumber : 'N/A',
        expiry: med.batches.length > 0 ? med.batches[0].expiryDate : null,
        batches: med.batches
      };
    });
    
    res.json(simplifiedMedicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicines', message: error.message });
  }
};

// Get low stock medicines
export const getLowStockMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const lowStockMeds = medicines.filter(med => med.isLowStock);
    res.json(lowStockMeds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock medicines', message: error.message });
  }
};

// Get near expiry medicines (within 60 days)
export const getNearExpiryMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
    
    const nearExpiryMeds = [];
    medicines.forEach(med => {
      med.batches.forEach(batch => {
        if (batch.expiryDate <= sixtyDaysFromNow && batch.quantity > 0) {
          nearExpiryMeds.push({
            _id: med._id,
            name: med.name,
            batchNumber: batch.batchNumber,
            quantity: batch.quantity,
            expiryDate: batch.expiryDate
          });
        }
      });
    });
    
    res.json(nearExpiryMeds);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch near expiry medicines', message: error.message });
  }
};

// Get medicine by ID
export const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json(medicine);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch medicine', message: error.message });
  }
};

// Search medicines by name
export const searchMedicines = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }
    
    const medicines = await Medicine.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { genericName: { $regex: query, $options: 'i' } }
      ]
    }).limit(20);
    
    res.json(medicines);
  } catch (error) {
    res.status(500).json({ error: 'Failed to search medicines', message: error.message });
  }
};

// Add new medicine
export const addMedicine = async (req, res) => {
  try {
    // Check if request is for adding a batch to existing medicine or new medicine
    if (req.body.name && req.body.quantity && req.body.expiry && req.body.batch) {
      // This is a simplified flat add - check if medicine exists
      const existingMedicine = await Medicine.findOne({ 
        name: { $regex: new RegExp(`^${req.body.name}$`, 'i') }
      });
      
      if (existingMedicine) {
        // Add as new batch to existing medicine
        existingMedicine.batches.push({
          batchNumber: req.body.batch,
          quantity: req.body.quantity,
          expiryDate: new Date(req.body.expiry),
          purchasePrice: req.body.price || existingMedicine.price
        });
        await existingMedicine.save();
        return res.status(201).json(existingMedicine);
      }
      
      // Create new medicine with first batch
      const medicine = new Medicine({
        name: req.body.name,
        genericName: req.body.genericName || req.body.name,
        category: req.body.category || 'Other',
        manufacturer: req.body.manufacturer || 'Unknown',
        price: req.body.price || 10,
        lowStockThreshold: 20,
        batches: [{
          batchNumber: req.body.batch,
          quantity: req.body.quantity,
          expiryDate: new Date(req.body.expiry),
          purchasePrice: req.body.price || 10
        }]
      });
      await medicine.save();
      return res.status(201).json(medicine);
    }
    
    // Standard medicine creation
    const medicine = new Medicine(req.body);
    await medicine.save();
    res.status(201).json(medicine);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add medicine', message: error.message });
  }
};

// Update medicine
export const updateMedicine = async (req, res) => {
  try {
    // Check if this is a batch update (flattened view)
    if (req.body.batch && req.body.expiry) {
      // Find medicine containing this batch
      const medicine = await Medicine.findOne({ 'batches._id': req.params.id });
      
      if (!medicine) {
        return res.status(404).json({ error: 'Medicine/Batch not found' });
      }
      
      const batch = medicine.batches.id(req.params.id);
      if (batch) {
        batch.batchNumber = req.body.batch;
        batch.quantity = req.body.quantity;
        batch.expiryDate = new Date(req.body.expiry);
        await medicine.save();
        return res.json(medicine);
      }
    }
    
    // Standard medicine update
    const medicine = await Medicine.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update medicine', message: error.message });
  }
};

// Add batch to existing medicine
export const addBatch = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    medicine.batches.push(req.body);
    await medicine.save();
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ error: 'Failed to add batch', message: error.message });
  }
};

// Update batch quantity (for stock adjustments)
export const updateBatchQuantity = async (req, res) => {
  try {
    const { id, batchId } = req.params;
    const { quantity } = req.body;
    
    const medicine = await Medicine.findById(id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    
    const batch = medicine.batches.id(batchId);
    if (!batch) {
      return res.status(404).json({ error: 'Batch not found' });
    }
    
    batch.quantity = quantity;
    await medicine.save();
    res.json(medicine);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update batch quantity', message: error.message });
  }
};

// Delete medicine
export const deleteMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndDelete(req.params.id);
    if (!medicine) {
      return res.status(404).json({ error: 'Medicine not found' });
    }
    res.json({ message: 'Medicine deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete medicine', message: error.message });
  }
};

// Get dashboard stats
export const getDashboardStats = async (req, res) => {
  try {
    const medicines = await Medicine.find();
    
    const totalMedicines = medicines.length;
    const lowStockCount = medicines.filter(med => med.isLowStock).length;
    
    const sixtyDaysFromNow = new Date();
    sixtyDaysFromNow.setDate(sixtyDaysFromNow.getDate() + 60);
    
    let nearExpiryCount = 0;
    medicines.forEach(med => {
      med.batches.forEach(batch => {
        if (batch.expiryDate <= sixtyDaysFromNow && batch.quantity > 0) {
          nearExpiryCount++;
        }
      });
    });
    
    const totalValue = medicines.reduce((sum, med) => {
      const medValue = med.batches.reduce((bSum, batch) => 
        bSum + (batch.quantity * med.price), 0
      );
      return sum + medValue;
    }, 0);
    
    res.json({
      totalMedicines,
      lowStockCount,
      nearExpiryCount,
      totalValue: Math.round(totalValue * 100) / 100
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch dashboard stats', message: error.message });
  }
};
