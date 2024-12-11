import express from 'express';
import {
  addSleepRecord,
  getSleepRecords,
  getSleepAnalysis,
  getSleepTips
} from '../controllers/sleep.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/:babyId', authenticateToken, addSleepRecord);
router.get('/:babyId', authenticateToken, getSleepRecords);
router.get('/:babyId/analysis', authenticateToken, getSleepAnalysis);
router.get('/:babyId/tips', authenticateToken, getSleepTips);

export default router;
