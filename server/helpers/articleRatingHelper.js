let sum = 0;
const getAverageRatings = (ratings, count) => {
  ratings.rows.map((value) => {
    sum += value.stars;
    return sum;
  });
  const average = sum / count;
  return average;
};

export default getAverageRatings;
