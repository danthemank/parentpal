import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { analyzeSleepPattern, generateSleepTips } from '../utils/sleepAnalyzer.js';

export const addSleepRecord = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { sleepStart, sleepEnd, quality, notes } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO sleep_records (id, baby_id, sleep_start, sleep_end, 
        quality, notes) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, babyId, sleepStart, sleepEnd, quality, notes]
    );

    res.status(201).json({ message: 'Sleep record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSleepRecords = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { startDate, endDate } = req.query;

    const result = await db.execute(
      `SELECT * FROM sleep_records 
       WHERE baby_id = ? 
       AND sleep_start BETWEEN ? AND ?
       ORDER BY sleep_start DESC`,
      [babyId, startDate, endDate]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSleepAnalysis = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { period } = req.query; // 'week' or 'month'

    const records = await db.execute(
      `SELECT * FROM sleep_records 
       WHERE baby_id = ? 
       AND sleep_start >= datetime('now', ?)
       ORDER BY sleep_start DESC`,
      [babyId, period === 'week' ? '-7 days' : '-30 days']
    );

    const analysis = analyzeSleepPattern(records.rows);
    res.json(analysis);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSleepTips = async (req, res) => {
  try {
    const { babyId } = req.params;
    
    const baby = await db.execute(
      'SELECT birth_date FROM babies WHERE id = ?',
      [babyId]
    );

    const recentSleep = await db.execute(
      `SELECT * FROM sleep_records 
       WHERE baby_id = ? 
       AND sleep_start >= datetime('now', '-7 days')
       ORDER BY sleep_start DESC`,
      [babyId]
    );

    const tips = generateSleepTips(baby.rows[0], recentSleep.rows);
    res.json(tips);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
