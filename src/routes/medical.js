import express from 'express';
import {
  addAppointment,
  getAppointments,
  updateAppointment,
  addVaccine,
  getVaccineSchedule,
  updateVaccineStatus
} from '../controllers/medical.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Appointments
router.post('/appointments/:babyId', authenticateToken, addAppointment);
router.get('/appointments/:babyId', authenticateToken, getAppointments);
router.put('/appointments/:id', authenticateToken, updateAppointment);

// Vaccines
router.post('/vaccines/:babyId', authenticateToken, addVaccine);
router.get('/vaccines/:babyId', authenticateToken, getVaccineSchedule);
router.put('/vaccines/:id', authenticateToken, updateVaccineStatus);

export default router;
