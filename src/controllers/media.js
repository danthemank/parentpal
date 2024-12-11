import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';
import { analyzeImage, generateHighlightReel } from '../utils/mediaProcessor.js';

export const createAlbum = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { title, description } = req.body;
    const id = uuidv4();

    await db.execute(
      `INSERT INTO media_albums (id, baby_id, title, description) 
       VALUES (?, ?, ?, ?)`,
      [id, babyId, title, description]
    );

    res.status(201).json({ message: 'Album created successfully', id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getAlbums = async (req, res) => {
  try {
    const { babyId } = req.params;
    const result = await db.execute(
      `SELECT a.*, 
        (SELECT COUNT(*) FROM media_items WHERE album_id = a.id) as item_count
       FROM media_albums a
       WHERE a.baby_id = ?
       ORDER BY a.created_at DESC`,
      [babyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const uploadMedia = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { mediaType, url, caption, tags } = req.body;
    const id = uuidv4();

    // Analyze image/video using AI
    const aiLabels = await analyzeImage(url);

    // Create thumbnail for videos
    const thumbnailUrl = mediaType === 'video' 
      ? await generateThumbnail(url)
      : null;

    await db.execute(
      `INSERT INTO media_items (id, album_id, media_type, url, thumbnail_url,
        caption, tags, ai_labels) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, albumId, mediaType, url, thumbnailUrl, caption, 
       JSON.stringify(tags), JSON.stringify(aiLabels)]
    );

    res.status(201).json({ 
      message: 'Media uploaded successfully',
      aiLabels
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMediaItems = async (req, res) => {
  try {
    const { albumId } = req.params;
    const { tag } = req.query;

    let query = 'SELECT * FROM media_items WHERE album_id = ?';
    const params = [albumId];

    if (tag) {
      query += ' AND tags LIKE ?';
      params.push(`%${tag}%`);
    }

    query += ' ORDER BY created_at DESC';
    const result = await db.execute(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const generateHighlight = async (req, res) => {
  try {
    const { babyId } = req.params;
    const { title, description, mediaItems } = req.body;
    const id = uuidv4();

    // Create highlight reel
    await db.execute(
      `INSERT INTO highlight_reels (id, baby_id, title, description, status) 
       VALUES (?, ?, ?, ?, ?)`,
      [id, babyId, title, description, 'processing']
    );

    // Generate highlight reel asynchronously
    generateHighlightReel(id, mediaItems).then(async (result) => {
      await db.execute(
        `UPDATE highlight_reels 
         SET status = ?, thumbnail_url = ?, duration = ? 
         WHERE id = ?`,
        ['completed', result.thumbnailUrl, result.duration, id]
      );
    }).catch(async (error) => {
      await db.execute(
        'UPDATE highlight_reels SET status = ? WHERE id = ?',
        ['failed', id]
      );
    });

    res.status(202).json({ 
      message: 'Highlight reel generation started',
      id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHighlightReels = async (req, res) => {
  try {
    const { babyId } = req.params;
    const result = await db.execute(
      `SELECT * FROM highlight_reels 
       WHERE baby_id = ? 
       ORDER BY created_at DESC`,
      [babyId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
