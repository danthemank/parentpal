import express from 'express';
import {
  getMilestones,
  addMilestoneAchievement,
  getBabyMilestones
} from '../controllers/milestones.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/list/:ageRange', authenticateToken, getMilestones);
router.get('/baby/:babyId', authenticateToken, getBabyMilestones);
router.post('/achievement/:babyId', authenticateToken, addMilestoneAchievement);

export default router;
