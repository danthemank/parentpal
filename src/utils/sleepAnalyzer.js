export const analyzeSleepPattern = (sleepRecords) => {
  const analysis = {
    totalSleepTime: 0,
    avgSleepDuration: 0,
    nightWakings: 0,
    longestStretch: 0,
    sleepQuality: 0,
    patterns: {
      bedtimes: [],
      wakeupTimes: []
    }
  };

  sleepRecords.forEach(record => {
    const start = new Date(record.sleep_start);
    const end = new Date(record.sleep_end);
    const duration = (end - start) / (1000 * 60 * 60); // hours

    analysis.totalSleepTime += duration;
    analysis.patterns.bedtimes.push(start.getHours());
    analysis.patterns.wakeupTimes.push(end.getHours());

    if (duration > analysis.longestStretch) {
      analysis.longestStretch = duration;
    }
  });

  if (sleepRecords.length > 0) {
    analysis.avgSleepDuration = analysis.totalSleepTime / sleepRecords.length;
    analysis.nightWakings = calculateNightWakings(sleepRecords);
    analysis.sleepQuality = calculateSleepQuality(analysis);
  }

  return analysis;
};

export const generateSleepTips = (baby, recentSleep) => {
  const ageInMonths = calculateAgeInMonths(baby.birth_date);
  const analysis = analyzeSleepPattern(recentSleep);
  
  const tips = [];

  // Age-appropriate sleep recommendations
  const recommendedSleep = getSleepRecommendations(ageInMonths);
  
  if (analysis.avgSleepDuration < recommendedSleep.min) {
    tips.push({
      priority: 'high',
      tip: 'Your baby might need more sleep. Try earlier bedtime.',
      reason: 'Current sleep duration is below recommended range.'
    });
  }

  if (analysis.nightWakings > recommendedSleep.expectedWakings) {
    tips.push({
      priority: 'medium',
      tip: 'Consider sleep training methods to reduce night wakings.',
      reason: 'More frequent night wakings than typical for age.'
    });
  }

  // Add bedtime consistency tip if needed
  const bedtimeVariance = calculateVariance(analysis.patterns.bedtimes);
  if (bedtimeVariance > 1.5) {
    tips.push({
      priority: 'medium',
      tip: 'Try to maintain a more consistent bedtime.',
      reason: 'Bedtime varies significantly night to night.'
    });
  }

  return tips;
};

function calculateNightWakings(sleepRecords) {
  let nightWakings = 0;
  const nightHours = { start: 19, end: 7 }; // 7 PM to 7 AM

  sleepRecords.forEach(record => {
    const start = new Date(record.sleep_start);
    const end = new Date(record.sleep_end);
    
    if (start.getHours() >= nightHours.start || end.getHours() <= nightHours.end) {
      nightWakings++;
    }
  });

  return Math.max(0, nightWakings - 1); // Subtract initial waking
}

function calculateSleepQuality(analysis) {
  // Score from 0-100 based on various factors
  let score = 100;

  // Deduct points for frequent night wakings
  score -= analysis.nightWakings * 5;

  // Deduct points for inconsistent bedtimes
  const bedtimeVariance = calculateVariance(analysis.patterns.bedtimes);
  score -= bedtimeVariance * 10;

  // Ensure score stays within 0-100 range
  return Math.max(0, Math.min(100, score));
}

function calculateVariance(numbers) {
  const mean = numbers.reduce((a, b) => a + b) / numbers.length;
  const variance = numbers.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / numbers.length;
  return Math.sqrt(variance);
}

function calculateAgeInMonths(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + 
         (now.getMonth() - birth.getMonth());
}

function getSleepRecommendations(ageInMonths) {
  if (ageInMonths <= 3) {
    return { min: 14, max: 17, expectedWakings: 3 };
  } else if (ageInMonths <= 6) {
    return { min: 12, max: 15, expectedWakings: 2 };
  } else if (ageInMonths <= 12) {
    return { min: 11, max: 14, expectedWakings: 1 };
  } else {
    return { min: 10, max: 13, expectedWakings: 0 };
  }
}
