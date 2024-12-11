import { db } from '../models/schema.js';
import { v4 as uuidv4 } from 'uuid';

export const getProduct = async (req, res) => {
  try {
    const { barcode } = req.params;
    const result = await db.execute(
      'SELECT * FROM products WHERE barcode = ?',
      [barcode]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const scanProduct = async (req, res) => {
  try {
    const { barcode, name, description, ingredients } = req.body;
    const id = uuidv4();
    
    // Calculate safety rating based on ingredients analysis
    const safetyRating = await analyzeSafetyRating(ingredients);
    
    await db.execute(
      'INSERT INTO products (id, barcode, name, description, ingredients, safety_rating) VALUES (?, ?, ?, ?, ?, ?)',
      [id, barcode, name, description, ingredients, safetyRating]
    );
    
    res.status(201).json({
      message: 'Product scanned and saved successfully',
      safetyRating
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Simple safety rating calculator (to be enhanced with ML)
async function analyzeSafetyRating(ingredients) {
  const harmfulIngredients = [
    'paraben',
    'phthalates',
    'formaldehyde',
    'sodium lauryl sulfate'
  ];
  
  let rating = 10;
  const ingredientsList = ingredients.toLowerCase().split(',');
  
  harmfulIngredients.forEach(harmful => {
    if (ingredientsList.some(ingredient => ingredient.includes(harmful))) {
      rating -= 2;
    }
  });
  
  return Math.max(1, rating);
}
