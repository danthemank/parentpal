import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { analyzeSentiment, categorizeFeedback } from '../utils/feedbackAnalyzer.js';
import { notifyAdmins } from '../utils/notifications.js';

export const submitFeedback = async (req, res) => {
  try {
    const {
      type,
      title,
      description,
      category,
      rating,
      attachments = []
    } = req.body;
    
    const id = uuidv4();
    
    // Analyze feedback sentiment
    const sentiment = await analyzeSentiment(description);
    
    // Auto-categorize feedback if category not provided
    const finalCategory = category || await categorizeFeedback(description);

    await db.execute(
      `INSERT INTO feedback (id, user_id, type, title, description, 
        category, rating, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, type, title, description, finalCategory, rating, 'new']
    );

    // Handle attachments
    for (const attachment of attachments) {
      await db.execute(
        `INSERT INTO feedback_attachments (id, feedback_id, url, type) 
         VALUES (?, ?, ?, ?)`,
        [uuidv4(), id, attachment.url, attachment.type]
      );
    }

    // Notify admins for urgent or critical feedback
    if (rating <= 2 || sentiment.score <= -0.5) {
      await notifyAdmins('feedback', {
        id,
        title,
        rating,
        sentiment: sentiment.score
      });
    }

    res.status(201).json({
      message: 'Feedback submitted successfully',
      id,
      category: finalCategory
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getFeedback = async (req, res) => {
  try {
    const { status, category, timeframe } = req.query;
    
    let query = `
      SELECT f.*, u.name as user_name,
      (SELECT COUNT(*) FROM feedback_attachments WHERE feedback_id = f.id) as attachment_count
      FROM feedback f
      JOIN users u ON f.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND f.status = ?';
      params.push(status);
    }

    if (category) {
      query += ' AND f.category = ?';
      params.push(category);
    }

    if (timeframe) {
      query += ' AND f.created_at >= datetime("now", ?)';
      params.push(`-${timeframe} days`);
    }

    query += ' ORDER BY f.created_at DESC';

    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const reportIssue = async (req, res) => {
  try {
    const {
      type,
      severity,
      title,
      description,
      screenName,
      deviceInfo,
      attachments = []
    } = req.body;
    
    const id = uuidv4();

    await db.execute(
      `INSERT INTO issue_reports (id, user_id, type, severity, title, 
        description, screen_name, device_info, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, type, severity, title, description, 
       screenName, JSON.stringify(deviceInfo), 'new']
    );

    // Handle attachments
    for (const attachment of attachments) {
      await db.execute(
        `INSERT INTO feedback_attachments (id, issue_id, url, type) 
         VALUES (?, ?, ?, ?)`,
        [uuidv4(), id, attachment.url, attachment.type]
      );
    }

    // Notify admins for high-severity issues
    if (severity === 'high' || severity === 'critical') {
      await notifyAdmins('issue', {
        id,
        title,
        severity,
        screenName
      });
    }

    res.status(201).json({
      message: 'Issue reported successfully',
      id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getIssueReports = async (req, res) => {
  try {
    const { status, severity, timeframe } = req.query;
    
    let query = `
      SELECT i.*, u.name as user_name,
      (SELECT COUNT(*) FROM feedback_attachments WHERE issue_id = i.id) as attachment_count
      FROM issue_reports i
      JOIN users u ON i.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (status) {
      query += ' AND i.status = ?';
      params.push(status);
    }

    if (severity) {
      query += ' AND i.severity = ?';
      params.push(severity);
    }

    if (timeframe) {
      query += ' AND i.created_at >= datetime("now", ?)';
      params.push(`-${timeframe} days`);
    }

    query += ' ORDER BY i.severity DESC, i.created_at DESC';

    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFeedbackStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.execute(
      `UPDATE feedback 
       SET status = ?, updated_at = datetime('now') 
       WHERE id = ?`,
      [status, id]
    );

    res.json({ message: 'Feedback status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateIssueStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await db.execute(
      `UPDATE issue_reports 
       SET status = ?, updated_at = datetime('now') 
       WHERE id = ?`,
      [status, id]
    );

    res.json({ message: 'Issue status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addAttachment = async (req, res) => {
  try {
    const { feedbackId, issueId, url, type } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO feedback_attachments (id, feedback_id, issue_id, url, type) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, feedbackId, issueId, url, type]
    );

    res.status(201).json({
      message: 'Attachment added successfully',
      id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
