const VACCINE_SCHEDULE = {
  birth: [
    { name: 'HepB', dose: 1 }
  ],
  '2_months': [
    { name: 'DTaP', dose: 1 },
    { name: 'Hib', dose: 1 },
    { name: 'IPV', dose: 1 },
    { name: 'PCV13', dose: 1 },
    { name: 'RV', dose: 1 }
  ],
  '4_months': [
    { name: 'DTaP', dose: 2 },
    { name: 'Hib', dose: 2 },
    { name: 'IPV', dose: 2 },
    { name: 'PCV13', dose: 2 },
    { name: 'RV', dose: 2 }
  ],
  // Add more age groups and vaccines
};

export const getRecommendedVaccines = (birthDate, existingVaccines) => {
  const ageInMonths = calculateAgeInMonths(birthDate);
  const recommended = [];

  // Get all vaccines up to current age
  Object.entries(VACCINE_SCHEDULE).forEach(([ageGroup, vaccines]) => {
    const groupMonth = parseAgeGroup(ageGroup);
    if (groupMonth <= ageInMonths) {
      vaccines.forEach(vaccine => {
        if (!isVaccineCompleted(vaccine, existingVaccines)) {
          recommended.push({
            ...vaccine,
            recommended_age: ageGroup,
            status: 'due'
          });
        }
      });
    }
  });

  return recommended;
};

function calculateAgeInMonths(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  return (now.getFullYear() - birth.getFullYear()) * 12 + 
         (now.getMonth() - birth.getMonth());
}

function parseAgeGroup(ageGroup) {
  if (ageGroup === 'birth') return 0;
  return parseInt(ageGroup.split('_')[0]);
}

function isVaccineCompleted(vaccine, existingVaccines) {
  return existingVaccines.some(
    v => v.vaccine_name === vaccine.name && 
         v.status === 'completed'
  );
}
