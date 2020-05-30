import React from "react";
import { useParams } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";
import {
  getChapter,
  choice,
  shuffle,
  capitalizeFirstLetter,
  randomMinMax,
  languages,
} from "../model/utils";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { createDistractorOrtho } from "../model/distractor_ortho";
import { IRT } from "../model/irt";

import VocExercise from "./VocExercise";
import ExerciseIntro from "./ExerciseIntro";
import ExerciseResult from "./ExerciseResult";

const useStyles = makeStyles((theme) => ({
  frame: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
  },
  chap: {
    margin: "0% 7.5% 0% 7.5%",
  },
}));

const availableTypesOfExercises = ["MCQ", "Voltaire", "Fill"];

export default function ExerciseHub({ values, setValues }) {
  const classes = useStyles();
  const db = firebase.firestore();

  const { lang, subject, chapter } = useParams();

  const [exercise, setExercise] = React.useState({
    fetching: false,
    title: "",
    sentence: "",
    possibleAnswers: [],
    goodAnswer: "",
    type: "",
  });
  const [listOfExercises, setListOfExercises] = React.useState(
    localStorage.listOfExercises !== undefined
      ? JSON.parse(localStorage.listOfExercises)
      : []
  );
  const [results, setResults] = React.useState(
    localStorage.results !== undefined
      ? JSON.parse(localStorage.results)
      : {
          result: false,
          question: [],
          goodAnswers: [],
          answers: [],
          score: 0,
          type: [],
          possibleAnswers: [],
        }
  );
  const [fetching, setFecthing] = React.useState(true);
  const [intro, setIntro] = React.useState(true);
  const [answered, setAnswered] = React.useState(false);
  const [answer, setAnswer] = React.useState("_____");

  const [chapterWords, setChapterWords] = React.useState({});

  const sourceLang = languages[lang.slice(0, 2)];
  const destLang = languages[lang.slice(2)];

  let prevTheta = [];

  const isEveryExerciseDone = () => {
    if (listOfExercises.length === 0) {
      return false;
    }
    for (const exercise of listOfExercises) {
      if (!exercise.done) {
        return false;
      }
    }
    return true;
  };

  const selectExerciseFromIRT = (arr, previouslySelected, word) => {
    const copy = [...arr];
    previouslySelected.forEach((exercise) => {
      copy.splice(copy.indexOf(exercise.sentence), 1);
    });
    let selected = copy[0];
    const theta = prevTheta.length !== 0 ? prevTheta[prevTheta.length - 1] : 0;
    let best = Math.abs(
      IRT(estimateDelta(selected[0], "MCQ", word), theta) - 0.75
    );
    copy.forEach((sentence) => {
      const current = Math.abs(
        IRT(estimateDelta(sentence, "MCQ", word), theta) - 0.75
      );
      if (current < best) {
        selected = sentence;
        best = current;
      }
    });
    return selected;
  };

  const chooseExercise = (exerciseArray, fetchedData) => {
    const chosenExercise = choice(
      exerciseArray.filter((exercise) => !exercise.done)
    );
    const typeOfExercise = availableTypesOfExercises[randomMinMax(0, 2.99)];
    let possibleAnswers;
    switch (typeOfExercise) {
      case "Voltaire":
        possibleAnswers =
          Math.random() < 0.75
            ? createDistractorOrtho(chosenExercise.word)
            : chosenExercise.word;
        break;

      case "Fill":
        break;
      default:
        possibleAnswers = shuffle(
          Object.values(fetchedData.words).slice(0, randomMinMax(0, 4))
        );
        if (!possibleAnswers.includes(chosenExercise.word)) {
          possibleAnswers[randomMinMax(0, possibleAnswers.length)] =
            chosenExercise.word;
        }
        for (let i = 0; i < 4 - possibleAnswers.length; i++) {
          possibleAnswers.splice(
            randomMinMax(0, possibleAnswers.length),
            0,
            createDistractorOrtho(choice(possibleAnswers))
          );
        }
        break;
    }
    setExercise({
      fetching: true,
      title: fetchedData.title,
      sentence: capitalizeFirstLetter(chosenExercise.sentence),
      possibleAnswers: possibleAnswers,
      goodAnswer: chosenExercise.word,
      type: typeOfExercise,
    });
  };

  if (fetching && !results.result) {
    setFecthing(false);
    db.collection("sources")
      .doc(sourceLang)
      .collection("exercises")
      .doc(destLang)
      .get()
      .then((snap) => {
        const val = snap.data();
        const fetchedData = getChapter(val[subject], chapter);
        setChapterWords(fetchedData.words);
        if (listOfExercises.length === 0) {
          try {
            prevTheta = val.progress[sourceLang][destLang][subject].theta;
          } catch (e) {}
          const toPush = [];
          Object.values(fetchedData.words).forEach((word) => {
            for (let i = 0; i < 3; i++) {
              toPush.push({
                sentence: selectExerciseFromIRT(
                  fetchedData.sentences[word],
                  toPush,
                  word
                ),
                word: word,
                done: false,
              });
            }
          });
          localStorage.listOfExercises = JSON.stringify(toPush);
          setListOfExercises(toPush);
          chooseExercise(toPush, fetchedData);
        } else if (isEveryExerciseDone()) {
          localStorage.results = JSON.stringify({ ...results, result: true });
          setResults({ ...results, result: true });
        } else {
          chooseExercise(listOfExercises, fetchedData);
        }
      });
  }

  const estimateDelta = (question, type, goodAnswers) => {
    return (
      (Math.log10(
        question.length * (type === "MCQ" ? 1 : 3) * goodAnswers.length
      ) -
        2) /
      2
    );
  };
  return (
    <div className={classes.frame}>
      <Typography color="secondary" variant="h2" className={classes.chap}>
        {chapter}
      </Typography>
      {results.result ? (
        <ExerciseResult
          results={results}
          listOfExercises={listOfExercises}
          subject={subject}
          values={values}
          setValues={setValues}
          sourceLang={sourceLang}
          destLang={destLang}
          chapter={chapter}
          prevTheta={prevTheta}
        />
      ) : intro ? (
        <ExerciseIntro chapterWords={chapterWords} setIntro={setIntro} />
      ) : (
        <VocExercise
          exercise={exercise}
          answered={answered}
          answer={answer}
          setAnswer={setAnswer}
          listOfExercises={listOfExercises}
          setListOfExercises={setListOfExercises}
          results={results}
          setResults={setResults}
          setFecthing={setFecthing}
          setAnswered={setAnswered}
        />
      )}
    </div>
  );
}
