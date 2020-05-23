import { useLocation } from "react-router-dom";

const capitalizeFirstLetter = (s) => {
  return s[0].toUpperCase() + s.slice(1);
};

function randomMinMax(min = 0, max = 1) {
  return Math.floor(Math.random() * max - min);
}

const checkAnswer = (exercise, answer) => {
  return (
    (exercise.type === "Voltaire" &&
      ((answer === "_____" &&
        exercise.possibleAnswers === exercise.goodAnswer) ||
        exercise.possibleAnswers === answer)) ||
    exercise.goodAnswer === answer
  );
};


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const getChapter = (subject, title) => {
  for (const chapter of Object.keys(subject)) {
    if (subject[chapter].title === title) {
      return subject[chapter];
    }
  }
  return undefined;
};

const getLanguageProgress = (user, sourceLang, language) => {
  let progress = 0;
  if (user.progress[sourceLang][language] !== undefined) {
    for (const subject in user.progress[sourceLang][language]) {
      if (user.progress[sourceLang][language].hasOwnProperty(subject)) {
        const element = user.progress[sourceLang][language][subject];
        progress += element.theta[element.theta.length - 1];
      }
    }
    progress *=
      100 / (Object.keys(user.progress[sourceLang][language]).length * 3);
  }
  return {
    language: language.toUpperCase(),
    A: progress !== 0 ? progress : 20,
    fullMark: 100,
  };
};

const choice = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const shuffle = (array) => {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

const isObject = (item) => {
  return item && typeof item === "object" && !Array.isArray(item);
};
const mergeDeep = (target, ...sources) => {
  if (!sources.length) return target;
  const source = sources.shift();

  if (isObject(target) && isObject(source)) {
    for (const key in source) {
      if (isObject(source[key])) {
        if (!target[key]) Object.assign(target, { [key]: {} });
        mergeDeep(target[key], source[key]);
      } else {
        Object.assign(target, { [key]: source[key] });
      }
    }
  }

  return mergeDeep(target, ...sources);
};

const languages = {
  en: "english",
  fr: "french",
};

const linearGradient = (theme, ang) => {
  if (ang === undefined) ang = 45;
  return (
    "linear-gradient(" +
    ang +
    "deg," +
    theme.palette.secondary.main +
    " 30%," +
    theme.palette.primary.main +
    " 90%)"
  );
};

const reverseGradient = (theme, ang) => {
  if (ang === undefined) ang = 45;
  return (
    "linear-gradient(" +
    ang +
    "deg," +
    theme.palette.primary.main +
    " 30%," +
    theme.palette.secondary.main +
    " 90%)"
  );
};

export {
  capitalizeFirstLetter,
  randomMinMax,
  checkAnswer,
  useQuery,
  getChapter,
  getLanguageProgress,
  choice,
  shuffle,
  mergeDeep,
  languages,
  linearGradient,
  reverseGradient,
};
