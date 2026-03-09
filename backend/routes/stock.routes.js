import express from 'express';
import {
  getAllMedicines,
  getLowStockMedicines,
  getNearExpiryMedicines,
  getMedicineById,
  searchMedicines,
  addMedicine,
  updateMedicine,
  addBatch,
  updateBatchQuantity,
  deleteMedicine,
  getDashboardStats
} from '../controllers/stock.controller.js';

const router = express.Router();

// Dashboard stats
router.get('/stats', getDashboardStats);

// Get medicines
router.get('/', getAllMedicines);
router.get('/low-stock', getLowStockMedicines);
router.get('/near-expiry', getNearExpiryMedicines);
router.get('/search', searchMedicines);
router.get('/:id', getMedicineById);

// Add/Update medicines
router.post('/', addMedicine);
router.put('/:id', updateMedicine);
router.delete('/:id', deleteMedicine);

// Batch operations
router.post('/:id/batch', addBatch);
router.put('/:id/batch/:batchId', updateBatchQuantity);

export default router;
