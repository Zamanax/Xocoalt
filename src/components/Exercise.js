import React from "react";
import { useParams } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  makeStyles,
  withStyles,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button,
  useTheme,
  LinearProgress,
} from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";
import PublishIcon from "@material-ui/icons/Publish";
import {
  getChapter,
  choice,
  shuffle,
  capitalizeFirstLetter,
} from "../model/utils";
import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { languages } from "../model/utils";
import AnswerCard from "./AnswerCard";

const useStyles = makeStyles((theme) => ({
  frame: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    margin: "0% 7.5% 0% 7.5%",
  },
  center: {
    textAlign: "center",
    margin: 10,
  },
  exercise: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  form: {
    maxHeight: 200,
  },
  result: {
    display: "flex",
    minHeight: "calc(100% - 110)",
    flexDirection: "column",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
  chap: {
    margin: "0% 7.5% 0% 7.5%",
  },
  wording: {
    margin: 40,
  },
}));

export default function Exercise(props) {
  const classes = useStyles();
  const db = firebase.firestore();

  // const { user } = props;
  const { lang, subject, chapter } = useParams();

  const theme = useTheme();
  const SecondaryRadio = withStyles({
    root: {
      color: theme.palette.secondary.main,
    },
  })((props) => <Radio {...props} />);

  const [listOfExercises, setListOfExercises] = React.useState([]);
  const [exercise, setExercise] = React.useState({
    fetching: false,
    title: "",
    sentence: "",
    possibleAnswers: [],
    goodAnswer: "",
  });
  const [results, setResults] = React.useState(
    localStorage.results !== undefined
      ? JSON.parse(localStorage.results)
      : {
          result: false,
          question: [],
          goodAnswers: [],
          answers: [],
          score: 0,
        }
  );
  const [fetching, setFecthing] = React.useState(true);
  const [answered, setAnswered] = React.useState(false);
  const [answer, setAnswer] = React.useState("_____");

  const sourceLang = languages[lang.slice(0, 2)];
  const destLang = languages[lang.slice(2)];

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };

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

  const chooseExercise = (exerciseArray, fetchedData) => {
    const chosenExercise = choice(
      exerciseArray.filter((exercise) => !exercise.done)
    );
    setExercise({
      fetching: true,
      title: fetchedData.title,
      sentence: capitalizeFirstLetter(chosenExercise.sentence),
      possibleAnswers: shuffle(Object.values(fetchedData.words)),
      goodAnswer: chosenExercise.word,
    });
  };

  const updateResults = () => {
    setResults({
      ...results,
      question: [...results.question, exercise.sentence],
      goodAnswers: [...results.goodAnswers, exercise.goodAnswer],
      answers: [...results.answers, answer],
      score: exercise.goodAnswer === answer ? ++results.score : results.score,
    });
  };

  const handleValidate = () => {
    if (answered) {
      localStorage.results = JSON.stringify(results);
      setFecthing(true);
      setAnswered(false);
      setAnswer("_____")
    } else {
      setAnswered(true);
      updateResults();
      if (exercise.goodAnswer === answer) {
        setListOfExercises(listOfExercises.map(question => (
          { ...question, done: (capitalizeFirstLetter(question.sentence) === exercise.sentence) || question.done}
        )));
      }
    }
    // Also IRT
  };

  const showAnswersResult = () => {
    let toReturn = [];
    for (let i = 0; i < results.question.length; i++) {
      toReturn.push(
        <AnswerCard
          question={results.question[i]}
          goodAnswer={results.goodAnswers[i]}
          answer={results.answers[i]}
          key={i}
        />
      );
    }
    return toReturn;
  };

  const generateExercise = () => {
    setFecthing(false);
    db.collection("sources")
      .doc(sourceLang)
      .collection("exercises")
      .doc(destLang)
      .get()
      .then((snap) => {
        const fetchedData = getChapter(snap.data()[subject], chapter);
        if (listOfExercises.length === 0) {
          const toPush = [];
          Object.values(fetchedData.words).forEach((word) => {
            for (let i = 0; i < 3; i++) {
              toPush.push({
                sentence: choice(fetchedData.sentences[word]),
                word: word,
                done: false,
              });
            }
          });
          setListOfExercises(toPush);
          chooseExercise(toPush, fetchedData);
        } else if (isEveryExerciseDone()) {
          localStorage.results = JSON.stringify({ ...results, result: true });
          setResults({ ...results, result: true });
        } else {
          chooseExercise(listOfExercises, fetchedData);
        }
      });
  };
  if (fetching && !results.result) {
    generateExercise();
  }

  return (
    <div className={classes.frame}>
      <Typography color="secondary" variant="h2" className={classes.chap}>
        {exercise.title}
      </Typography>
      {results.result ? (
        <div className={classes.frame}>
          <Typography className={classes.center} variant="h3" color="secondary">
            Results
          </Typography>
          <Typography variant="h4" color="secondary">
            Score:
            <span>
              {results.score}/{results.question.length}
            </span>
          </Typography>
          <div className={classes.result}>{showAnswersResult()}</div>
          <Button
            variant="contained"
            color="secondary"
            style={{ margin: 10, width: 200 }}
            startIcon={<PublishIcon />}
          >
            Well Done !
          </Button>
        </div>
      ) : exercise.fetching ? (
        <Fade bottom cascade>
          <div className={classes.exercise}>
            <LinearProgress
              style={{ width: "25%" }}
              variant="determinate"
              value={(results.answers.length / listOfExercises.length) * 100}
            />
            <Typography
              color="secondary"
              variant="h3"
              className={classes.wording}
            >
              {exercise.sentence.split(/_____/gi).map(
                (text, i) =>
                  (text =
                    i !== exercise.sentence.split(/_____/gi).length - 1 ? (
                      <span key={i}>
                        {text + " "}
                        <span
                          style={{
                            fontStyle: "oblique 40deg",
                            fontWeight: "bold",
                            textDecoration: "underline",
                          }}
                        >
                          {answer}
                        </span>
                      </span>
                    ) : (
                      <span key={i}>{text}</span>
                    ))
              )}
            </Typography>
            <FormControl className={classes.form}>
              <RadioGroup value={answer} onChange={handleChange}>
                {exercise.possibleAnswers.map((word, i) => (
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                    }}
                    key={i}
                  >
                    {answered && word === exercise.goodAnswer && (
                      <CheckRoundedIcon style={{ color: "green" }} />
                    )}
                    {answered &&
                      word === answer &&
                      exercise.goodAnswer !== answer && (
                        <CloseRoundedIcon style={{ color: "red" }} />
                      )}
                    <FormControlLabel
                      value={word}
                      control={<SecondaryRadio />}
                      disabled={answered}
                      label={
                        <span
                          style={{
                            display: "inline-block",
                            fontSize: 35,
                            color: theme.palette.secondary.main,
                            width: 200,
                          }}
                        >
                          {word}
                        </span>
                      }
                      key={i}
                    />
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={handleValidate}
              style={{ margin: 20 }}
            >
              Confirm
            </Button>
          </div>
        </Fade>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
}
