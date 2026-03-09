import express from 'express';
import {
  getAllBills,
  getBillById,
  getBillByNumber,
  createBill,
  updateBillStatus,
  getBillingStats,
  deleteBill
} from '../controllers/billing.controller.js';

const router = express.Router();

// Statistics
router.get('/stats', getBillingStats);

// CRUD operations
router.get('/', getAllBills);
router.get('/:id', getBillById);
router.get('/number/:billNumber', getBillByNumber);
router.post('/', createBill);
router.put('/:id/status', updateBillStatus);
router.delete('/:id', deleteBill);

export default router;
