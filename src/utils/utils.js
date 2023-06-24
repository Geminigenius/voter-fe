export const formatNumberWithCommas = (num) => {
  let result = "";
  let count = 0;
  while (num) {
    let digit = num % 10;
    num = Math.floor(num / 10);
    result = digit + result.toString();
    count++;
    if (count === 3 && num) {
      result = "," + result;
      count = 0;
    }
  }
  return result || 0;
};

export const GENERIC_ERROR_MESSAGE = "Something went wrong. Please try again.";

export const getBaseUrl = () =>
  process.env.NODE_ENV === "production"
    ? process.env.REACT_APP_DEPLOYED_URL
    : process.env.REACT_APP_LOCAL_URL;

export const getUrl = (urlPath) => `${getBaseUrl()}/${urlPath}`;

export const capitalize = (word) => word[0].toUpperCase() + word.substring(1);

export const toSentenceCase = (str) => {
  let words = str.split("_");
  words = words.map((word) => capitalize(word));

  return words.join(" ");
};

export const getDateObj = (date) => {
  let year = date.getFullYear().toString();

  let day = date.getDate();
  if (day < 10) day = `0${day}`;
  else day = day.toString();

  let month = date.getMonth() + 1;
  if (month < 10) month = `0${month}`;
  else month = month.toString();

  return { year, day, month };
};

export const convertInputDateToDate = (inputDate) => {
  let [year, month, day] = inputDate.split("-");
  return new Date(year, month - 1, day);
};

export const formatDateWithHyphen = ({ year, month, day }) =>
  `${year}-${month}-${day}`;

export const ELECTION_POSTS = {
  PRESIDENTIAL: "Presidential",
  GUBERNATORIAL: "Gubernatorial",
  LGA: "Local Government Chairman",
};

export const ELECTION_POSTS_API = {
  PRESIDENTIAL: "presidential",
  STATE: "state",
  LGA: "lga",
};

export const ELECTION_POSTS_API_TO_SHORT = {
  Presidential: "presidential",
  Gubernatorial: "state",
  "Local Government Chairman": "lga",
};
