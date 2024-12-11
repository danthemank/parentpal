import express from 'express';
import { getTips, createTip, getTipsByAgeRange } from '../controllers/tips.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getTips);
router.get('/age/:range', authenticateToken, getTipsByAgeRange);
router.post('/', authenticateToken, createTip);

export default router;
