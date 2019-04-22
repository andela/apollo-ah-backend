export const urlRegex = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})/;
export const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/;

export const testInput = (input) => {
  const regex = /[a-zA-Z]+.*/;
  return regex.test(input);
};

export const testCategoryId = (input) => {
  const regexNum = /^[0-9]+$/;
  return regexNum.test(input);
};
