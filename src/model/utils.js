import React from "react";

import { useLocation } from "react-router-dom";

import LessonCard from "../components/LessonCard";
import * as firebase from "firebase/app";
import "firebase/firestore";

const capitalizeFirstLetter = (s) => {
  return s[0].toUpperCase() + s.slice(1);
}

const createSubjects = (user, cards, setCards) => {
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
    .get()
    .then(snap => {
      const val = snap.data()[defaultDestLanguage];
      let cards = [];
      let i = 0;
      for (const subject of Object.keys(val)) {
        cards.push(
          <LessonCard
            type={subject}
            user={user}
            chapters={val[subject]}
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
    if(subject[chapter].title===title){return subject[chapter]}
  }
  return undefined;
};

const choice = (arr) => {
  return arr[Math.floor(Math.random() *arr.length)]
}

const languages = {
  en: "english",
  fr: "french"
};


const linearGradient = (theme) => "linear-gradient(45deg," +
  theme.palette.secondary.main +
  " 30%," +
  theme.palette.primary.main +
  " 90%)";

const reverseGradient = (theme) => "linear-gradient(45deg," +
  theme.palette.primary.main +
  " 30%," +
  theme.palette.secondary.main +
  " 90%)";

export { capitalizeFirstLetter, createSubjects, useQuery, getChapter, choice, languages, linearGradient, reverseGradient };
