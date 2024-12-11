import express from 'express';
import { getProduct, scanProduct } from '../controllers/products.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:barcode', authenticateToken, getProduct);
router.post('/scan', authenticateToken, scanProduct);

export default router;
