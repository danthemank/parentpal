import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const getTips = async (req, res) => {
  try {
    const result = await db.execute('SELECT * FROM tips ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTipsByAgeRange = async (req, res) => {
  try {
    const { range } = req.params;
    const result = await db.execute(
      'SELECT * FROM tips WHERE age_range = ? ORDER BY created_at DESC',
      [range]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createTip = async (req, res) => {
  try {
    const { title, content, category, ageRange } = req.body;
    const id = uuidv4();
    
    await db.execute(
      'INSERT INTO tips (id, title, content, category, age_range) VALUES (?, ?, ?, ?, ?)',
      [id, title, content, category, ageRange]
    );
    
    res.status(201).json({ message: 'Tip created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
