import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { moderateContent } from '../utils/contentModerator.js';

export const createPost = async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    
    // Moderate content before posting
    const moderationResult = await moderateContent(content);
    if (!moderationResult.isAppropriate) {
      return res.status(400).json({ 
        error: 'Content violates community guidelines' 
      });
    }

    const id = uuidv4();
    await db.execute(
      `INSERT INTO forum_posts (id, user_id, title, content, category, tags) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [id, req.user.id, title, content, category, JSON.stringify(tags)]
    );

    res.status(201).json({ message: 'Post created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const { category, tag, sort = 'recent' } = req.query;
    let query = `
      SELECT p.*, u.name as author_name, 
      (SELECT COUNT(*) FROM forum_comments WHERE post_id = p.id) as comment_count 
      FROM forum_posts p
      JOIN users u ON p.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (category) {
      query += ' AND p.category = ?';
      params.push(category);
    }

    if (tag) {
      query += ' AND p.tags LIKE ?';
      params.push(`%${tag}%`);
    }

    query += sort === 'popular' 
      ? ' ORDER BY p.likes DESC, p.created_at DESC'
      : ' ORDER BY p.created_at DESC';

    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await db.execute(
      `SELECT p.*, u.name as author_name 
       FROM forum_posts p
       JOIN users u ON p.user_id = u.id
       WHERE p.id = ?`,
      [id]
    );

    const comments = await db.execute(
      `SELECT c.*, u.name as author_name 
       FROM forum_comments c
       JOIN users u ON c.user_id = u.id
       WHERE c.post_id = ?
       ORDER BY c.created_at ASC`,
      [id]
    );

    res.json({
      post: post.rows[0],
      comments: comments.rows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { id: postId } = req.params;
    const { content } = req.body;

    const moderationResult = await moderateContent(content);
    if (!moderationResult.isAppropriate) {
      return res.status(400).json({ 
        error: 'Content violates community guidelines' 
      });
    }

    const id = uuidv4();
    await db.execute(
      `INSERT INTO forum_comments (id, post_id, user_id, content) 
       VALUES (?, ?, ?, ?)`,
      [id, postId, req.user.id, content]
    );

    res.status(201).json({ message: 'Comment added successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      'UPDATE forum_posts SET likes = likes + 1 WHERE id = ?',
      [id]
    );
    res.json({ message: 'Post liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const likeComment = async (req, res) => {
  try {
    const { id } = req.params;
    await db.execute(
      'UPDATE forum_comments SET likes = likes + 1 WHERE id = ?',
      [id]
    );
    res.json({ message: 'Comment liked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
