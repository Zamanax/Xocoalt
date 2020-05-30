import React from "react";
import { useHistory } from "react-router-dom";

import { Typography, Button, makeStyles } from "@material-ui/core";
import { checkAnswer } from "../model/utils";
import { estimateAbilityEAP } from "../model/irt";

import * as firebase from "firebase/app";
import "firebase/firestore";

import PublishIcon from "@material-ui/icons/Publish";

import AnswerCard from "./AnswerCard";

const merge = require("deepmerge");

const useStyles = makeStyles((theme) => ({
  result: {
    width: "100%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
  },
}));

export default function ExerciseResult({
  results,
  listOfExercises,
  subject,
  values,
  setValues,
  sourceLang,
  destLang,
  chapter,
  prevTheta,
}) {
  const db = firebase.firestore();
  const history = useHistory();
  const classes = useStyles();

  const estimateDelta = (question, type, goodAnswers) => {
    return (
      (Math.log10(
        question.length * (type === "MCQ" ? 1 : 3) * goodAnswers.length
      ) -
        2) /
      2
    );
  };

  const showAnswersResult = () => {
    let toReturn = [];
    for (let i = 0; i < results.question.length; i++) {
      toReturn.push(
        <AnswerCard
          question={results.question[i]}
          goodAnswer={results.goodAnswers[i]}
          answer={results.answers[i]}
          type={results.type[i]}
          possibleAnswers={results.possibleAnswers[i]}
          key={i}
        />
      );
    }
    return toReturn;
  };

  const countGoodBadAnswers = () => {
    const counted = [];
    const words = listOfExercises
      .filter((exercise) => {
        if (counted.includes(exercise.word)) {
          return false;
        } else {
          counted.push(exercise.word);
          return true;
        }
      })
      .map((exercise) => exercise.word);
    let toReturn = {};
    words.forEach((word) => {
      toReturn = {
        ...toReturn,
        [word]: {
          good: 3,
          wrong:
            results.goodAnswers.filter((answer) => answer === word).length - 3,
        },
      };
    });
    return toReturn;
  };

  const computeChapterTheta = () => {
    const estimatedZeta = [];
    const formatedAnswers = [];
    for (let i = 0; i < results.question.length; i++) {
      estimatedZeta.push({
        a: 1.7,
        b: estimateDelta(
          results.question[i],
          results.type[i],
          results.goodAnswers[i]
        ),
        c: 0,
      });
      formatedAnswers.push(
        checkAnswer(
          {
            type: results.type[i],
            possibleAnswers: results.possibleAnswers[i],
            goodAnswer: results.goodAnswers[i],
          },
          results.answers[i]
        )
          ? 1
          : 0
      );
    }
    return estimateAbilityEAP(formatedAnswers, estimatedZeta);
  };

  const computeSubjectTheta = (data) => {
    try {
      let cpt = 0;
      let acc = 0;
      for (const key in data.progress[subject].chapters) {
        if (data.hasOwnProperty(key)) {
          cpt++;
          acc += data[key].theta;
        }
      }
      return acc / cpt;
    } catch (error) {
      return computeChapterTheta();
    }
  };

  const uploadData = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        const val = snap.data();
        const newUser = merge(val, {
          progress: {
            [sourceLang]: {
              [destLang]: {
                [subject]: {
                  chapters: {
                    [chapter]: {
                      words: countGoodBadAnswers(),
                      theta: computeChapterTheta(),
                    },
                  },
                  theta: [...prevTheta, computeSubjectTheta(val)],
                },
              },
            },
          },
        });
        db.collection("users")
          .doc(firebase.auth().currentUser.email)
          .set(newUser, { merge: true })
          .then(() => {
            setValues({ ...values, user: newUser });
            localStorage.removeItem("results");
            localStorage.removeItem("listOfExercises");
            history.push("/");
          });
      });
  };

  return (
    <div className={classes.result}>
      <Typography variant="h3" color="secondary" style={{ marginLeft: "7.5%" }}>
        Results
      </Typography>
      <Typography variant="h4" color="secondary" style={{ marginLeft: "7.5%" }}>
        Score:
        <span>
          {results.score}/{results.question.length}
        </span>
      </Typography>
      <div className={classes.cardContainer}>
        {showAnswersResult()}

        <Button
          variant="contained"
          color="secondary"
          style={{ marginBottom: 20, width: 200 }}
          startIcon={<PublishIcon />}
          onClick={uploadData}
        >
          Well Done !
        </Button>
      </div>
    </div>
  );
}
