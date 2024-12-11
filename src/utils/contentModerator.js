const INAPPROPRIATE_WORDS = [
  // List of inappropriate words to filter
];

export const moderateContent = async (content) => {
  const lowerContent = content.toLowerCase();
  
  // Check for inappropriate words
  const hasInappropriateWords = INAPPROPRIATE_WORDS.some(word => 
    lowerContent.includes(word.toLowerCase())
  );

  // Check content length and other criteria
  const isAppropriate = !hasInappropriateWords && 
    content.length >= 2 &&
    content.length <= 5000;

  return {
    isAppropriate,
    reason: hasInappropriateWords ? 'Inappropriate content detected' : null
  };
};
