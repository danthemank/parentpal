import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { getRecommendedVaccines } from '../utils/vaccineScheduler.js';

export const addAppointment = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { title, doctorName, date, notes, type } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO appointments (id, baby_id, title, doctor_name, date, 
        notes, type, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, babyId, title, doctorName, date, notes, type, 'scheduled']
    );

    res.status(201).json({ message: 'Appointment scheduled successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { status } = req.query;

    let query = 'SELECT * FROM appointments WHERE baby_id = ?';
    const params = [babyId];

    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    query += ' ORDER BY date ASC';
    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    await db.execute(
      'UPDATE appointments SET status = ?, notes = ? WHERE id = ?',
      [status, notes, id]
    );

    res.json({ message: 'Appointment updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addVaccine = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { vaccineName, date, dueDate, notes } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO vaccines (id, baby_id, vaccine_name, date, due_date, 
        notes, status) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, babyId, vaccineName, date, dueDate, notes, 'scheduled']
    );

    res.status(201).json({ message: 'Vaccine record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getVaccineSchedule = async (req, res) => {
  try {
    const { babyId } = req.params;
    
    // Get baby's birth date
    const baby = await db.execute(
      'SELECT birth_date FROM babies WHERE id = ?',
      [babyId]
    );

    // Get existing vaccines
    const vaccines = await db.execute(
      'SELECT * FROM vaccines WHERE baby_id = ? ORDER BY due_date ASC',
      [babyId]
    );

    // Get recommended vaccines based on age
    const recommended = getRecommendedVaccines(
      baby.rows[0].birth_date,
      vaccines.rows
    );

    res.json({
      completed: vaccines.rows.filter(v => v.status === 'completed'),
      upcoming: vaccines.rows.filter(v => v.status === 'scheduled'),
      recommended
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateVaccineStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, date, notes } = req.body;

    await db.execute(
      'UPDATE vaccines SET status = ?, date = ?, notes = ? WHERE id = ?',
      [status, date, notes, id]
    );

    res.json({ message: 'Vaccine status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
