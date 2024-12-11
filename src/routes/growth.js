import express from 'express';
import {
  getGrowthRecords,
  addGrowthRecord,
  getGrowthChartData
} from '../controllers/growth.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:babyId', authenticateToken, getGrowthRecords);
router.post('/:babyId', authenticateToken, addGrowthRecord);
router.get('/:babyId/chart', authenticateToken, getGrowthChartData);

export default router;
