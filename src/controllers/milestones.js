import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const getMilestones = async (req, res) => {
  try {
    const { ageRange } = req.params;
    const result = await db.execute(
      'SELECT * FROM milestones WHERE typical_age_range = ? ORDER BY category',
      [ageRange]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBabyMilestones = async (req, res) => {
  try {
    const { babyId } = req.params;
    const result = await db.execute(`
      SELECT m.*, bm.achieved_date, bm.notes, bm.photo_url
      FROM milestones m
      LEFT JOIN baby_milestones bm ON m.id = bm.milestone_id
      WHERE bm.baby_id = ?
      ORDER BY m.typical_age_range, m.category`,
      [babyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addMilestoneAchievement = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { milestoneId, achievedDate, notes, photoUrl } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO baby_milestones (id, baby_id, milestone_id, achieved_date, 
        notes, photo_url) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, babyId, milestoneId, achievedDate, notes, photoUrl]
    );

    res.status(201).json({ message: 'Milestone achievement recorded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
