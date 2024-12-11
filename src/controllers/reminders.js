import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const getReminders = async (req, res) => {
  try {
    const result = await db.execute(
      'SELECT * FROM reminders WHERE user_id = ? ORDER BY due_date ASC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createReminder = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;
    const id = uuidv4();
    
    await db.execute(
      'INSERT INTO reminders (id, user_id, title, description, due_date) VALUES (?, ?, ?, ?, ?)',
      [id, req.user.id, title, description, dueDate]
    );
    
    res.status(201).json({ message: 'Reminder created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, completed } = req.body;
    
    await db.execute(
      'UPDATE reminders SET title = ?, description = ?, due_date = ?, completed = ? WHERE id = ? AND user_id = ?',
      [title, description, dueDate, completed, id, req.user.id]
    );
    
    res.json({ message: 'Reminder updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteReminder = async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.execute(
      'DELETE FROM reminders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );
    
    res.json({ message: 'Reminder deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
