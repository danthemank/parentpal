// Simple sentiment analysis implementation
export const analyzeSentiment = async (text) => {
  const positiveWords = ['great', 'good', 'excellent', 'amazing', 'love', 'helpful'];
  const negativeWords = ['bad', 'poor', 'terrible', 'hate', 'awful', 'useless'];
  
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positiveWords.includes(word)) score += 1;
    if (negativeWords.includes(word)) score -= 1;
  });
  
  // Normalize score between -1 and 1
  const normalizedScore = score / Math.max(words.length, 1);
  
  return {
    score: normalizedScore,
    sentiment: normalizedScore > 0 ? 'positive' : 
              normalizedScore < 0 ? 'negative' : 'neutral'
  };
};

// Feedback categorization
export const categorizeFeedback = async (text) => {
  const categories = {
    'ui': ['interface', 'design', 'layout', 'screen', 'button', 'menu'],
    'performance': ['slow', 'fast', 'crash', 'freeze', 'loading'],
    'feature': ['feature', 'functionality', 'option', 'capability'],
    'content': ['information', 'article', 'tip', 'advice'],
    'other': []
  };

  const words = text.toLowerCase().split(/\W+/);
  const categoryScores = {};

  Object.entries(categories).forEach(([category, keywords]) => {
    categoryScores[category] = keywords.filter(keyword => 
      words.includes(keyword)
    ).length;
  });

  const topCategory = Object.entries(categoryScores)
    .reduce((a, b) => a[1] > b[1] ? a : b)[0];

  return topCategory;
};
