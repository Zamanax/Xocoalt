import React from "react"
import LessonCard from "../components/LessonCard";
import * as firebase from "firebase/app";
import "firebase/firestore";

function capitalizeFirstLetter(s) {
    return s[0].toUpperCase() + s.slice(1);
}

const createSubjects = (user, cards, setCards) => {
    const db = firebase.firestore();
    setCards({ ...cards, fetching: true });
    const defaultSourceLanguage =
      user.languages !== undefined ? Object.keys(user.languages)[0] : "english";
    const defaultDestLanguage =
      user.languages !== undefined
        ? Object.keys(user.languages[defaultSourceLanguage])[0]
        : "french";

    db.collection("sources")
      .doc("VlH9IVRhALoGTy0upjD6")
      .get()
      .then(snap => {
        const val = snap.data()[defaultSourceLanguage][defaultDestLanguage];
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
        setCards({ ...cards, list: cards });
      });
  };


export {capitalizeFirstLetter, createSubjects}