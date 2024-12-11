import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { calculatePercentiles } from '../utils/growthCalculator.js';

export const getGrowthRecords = async (req, res) => {
  try {
    const { babyId } = req.params;
    const result = await db.execute(
      'SELECT * FROM growth_records WHERE baby_id = ? ORDER BY date DESC',
      [babyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addGrowthRecord = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { date, weight, height, headCircumference, notes } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO growth_records (id, baby_id, date, weight, height, 
        head_circumference, notes) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, babyId, date, weight, height, headCircumference, notes]
    );

    res.status(201).json({ message: 'Growth record added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getGrowthChartData = async (req, res) => {
  try {
    const { babyId } = req.params;
    const records = await db.execute(
      'SELECT * FROM growth_records WHERE baby_id = ? ORDER BY date ASC',
      [babyId]
    );

    const baby = await db.execute(
      'SELECT birth_date, gender FROM babies WHERE id = ?',
      [babyId]
    );

    const chartData = calculatePercentiles(
      records.rows,
      baby.rows[0].birth_date,
      baby.rows[0].gender
    );

    res.json(chartData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
