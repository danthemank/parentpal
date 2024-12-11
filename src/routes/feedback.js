import express from 'express';
import {
  submitFeedback,
  getFeedback,
  reportIssue,
  getIssueReports,
  updateFeedbackStatus,
  updateIssueStatus,
  addAttachment
} from '../controllers/feedback.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Feedback routes
router.post('/submit', authenticateToken, submitFeedback);
router.get('/list', authenticateToken, getFeedback);
router.put('/:id/status', authenticateToken, updateFeedbackStatus);

// Issue reporting routes
router.post('/issues/report', authenticateToken, reportIssue);
router.get('/issues/list', authenticateToken, getIssueReports);
router.put('/issues/:id/status', authenticateToken, updateIssueStatus);

// Attachments
router.post('/attachments', authenticateToken, addAttachment);

export default router;
