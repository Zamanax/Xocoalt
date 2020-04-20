import React from "react";

import { useLocation } from "react-router-dom";

import LessonCard from "../components/LessonCard";
import * as firebase from "firebase/app";
import "firebase/firestore";

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

const createSubjects = (
  user,
  cards,
  setCards,
  setOpenDialog,
  setOpenLesson
) => {
  setCards({ ...cards, fetching: true });
  const db = firebase.firestore();
  const defaultSourceLanguage =
    user.languages !== undefined ? Object.keys(user.languages)[0] : "english";
  const defaultDestLanguage =
    user.languages !== undefined
      ? Object.keys(user.languages[defaultSourceLanguage])[0]
      : "french";

  db.collection("sources")
    .doc(defaultSourceLanguage)
    .collection("exercises")
    .doc(defaultDestLanguage)
    .get()
    .then((snap) => {
      const val = snap.data();
      let cards = [];
      let i = 0;
      for (const subject of Object.keys(val)) {
        cards.push(
          <LessonCard
            type={subject}
            user={user}
            chapters={val[subject]}
            setOpenDialog={setOpenDialog}
            setOpenLesson={setOpenLesson}
            key={i++}
          />
        );
      }
      setCards({ ...cards, list: cards, fetching: false });
    });
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
  return { language: language.toUpperCase(), A: progress !== 0 ? progress : 20, fullMark:100 };
}

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

const linearGradient = (theme) =>
  "linear-gradient(45deg," +
  theme.palette.secondary.main +
  " 30%," +
  theme.palette.primary.main +
  " 90%)";

const reverseGradient = (theme) =>
  "linear-gradient(45deg," +
  theme.palette.primary.main +
  " 30%," +
  theme.palette.secondary.main +
  " 90%)";

export {
  capitalizeFirstLetter,
  randomMinMax,
  checkAnswer,
  createSubjects,
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
