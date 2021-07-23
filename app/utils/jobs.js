exports.newJobMatchesCriteria = ({ title, city }, { keywords, cities }) => {
  // Could probably map over the arrays to make them case insensitive that way but whatever
  const includesKeyword = keywords.some(word => title.toLowerCase().includes(word.toLowerCase()));
  const includesCity = cities.find(jobCity => city.toLowerCase() === jobCity.toLowerCase());
  return Boolean(includesKeyword || includesCity);
};
