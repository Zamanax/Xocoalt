import React from "react";
import { useParams, useHistory } from "react-router-dom";
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
  randomMinMax,
} from "../model/utils";
import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { languages } from "../model/utils";
import { createDistractorOrtho } from "../model/distractor_ortho";
import AnswerCard from "./AnswerCard";

const useStyles = makeStyles((theme) => ({
  frame: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%",
    width: "100%",
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
    width: "calc(100% - 57px)",
    padding: "0% 7.5% 0% 7.5%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  chap: {
    margin: "0% 7.5% 0% 7.5%",
  },
  wording: {
    margin: 40,
  },
}));

const availableTypesOfExercises = ["MCQ", "Voltaire", "Fill"];

export default function Exercise(props) {
  const classes = useStyles();
  const db = firebase.firestore();
  const history = useHistory();

  // const { user } = props;
  const { lang, subject, chapter } = useParams();

  const theme = useTheme();
  const SecondaryRadio = withStyles({
    root: {
      color: theme.palette.secondary.main,
    },
  })((props) => <Radio {...props} />);

  const [listOfExercises, setListOfExercises] = React.useState(
    localStorage.listOfExercises !== undefined
      ? JSON.parse(localStorage.listOfExercises)
      : []
  );
  const [exercise, setExercise] = React.useState({
    fetching: false,
    title: "",
    sentence: "",
    possibleAnswers: [],
    goodAnswer: "",
    type: "",
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
    // const typeOfExercise = availableTypesOfExercises[randomMinMax(0, 3)];
    const typeOfExercise = "Voltaire";
    let possibleAnswers;
    switch (typeOfExercise) {
      case "Voltaire":
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

  const updateResults = () => {
    setResults({
      ...results,
      question: [...results.question, exercise.sentence],
      goodAnswers: [...results.goodAnswers, exercise.goodAnswer],
      answers: [...results.answers, answer],
      score: checkAnswer() ? ++results.score : results.score,
    });
  };

  const checkAnswer = () => {
    return (
      (exercise.type === "MCQ" && exercise.goodAnswer === answer) ||
      (exercise.type === "Voltaire" &&
        ((answer === "_____" &&
          exercise.possibleAnswers === exercise.goodAnswer) ||
          exercise.possibleAnswers === answer))
    );
  };

  const handleValidate = () => {
    if (answered) {
      localStorage.results = JSON.stringify(results);
      setFecthing(true);
      setAnswered(false);
      setAnswer("_____");
    } else {
      setAnswered(true);
      updateResults();
      if (checkAnswer()) {
        localStorage.listOfExercises = JSON.stringify(
          listOfExercises.map((question) => ({
            ...question,
            done:
              capitalizeFirstLetter(question.sentence) === exercise.sentence ||
              question.done,
          }))
        );
        setListOfExercises(
          listOfExercises.map((question) => ({
            ...question,
            done:
              capitalizeFirstLetter(question.sentence) === exercise.sentence ||
              question.done,
          }))
        );
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

  const generateMCQSentence = () => {
    return exercise.sentence.split(/_____/gi).map(
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
    );
  };

  const generateMCQAnswers = () => {
    return exercise.possibleAnswers.map((word, i) => (
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
        {answered && word === answer && exercise.goodAnswer !== answer && (
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
    ));
  };

  const generateVoltaireSentence = () => {
    return exercise.sentence.split(/ /gi).map(function (text, i) {
      if (text.includes("_____") && exercise.possibleAnswers === undefined) {
        text =
          Math.random() < 0.75
            ? createDistractorOrtho(exercise.goodAnswer)
            : exercise.goodAnswer;
        setExercise({ ...exercise, possibleAnswers: text });
      } else if (text.includes("_____")) {
        text = exercise.possibleAnswers;
      }
      return (
        <span
          key={i}
          onClick={() => {
            setAnswer(text);
          }}
        >
          {text + " "}
        </span>
      );
    });
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
        <div className={classes.result}>
          <Typography variant="h3" color="secondary">
            Results
          </Typography>
          <Typography variant="h4" color="secondary">
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
              onClick={() => {
                localStorage.removeItem("results");
                localStorage.removeItem("listOfExercises");
                history.push("/");
              }}
            >
              Well Done !
            </Button>
          </div>
        </div>
      ) : exercise.fetching ? (
        <Fade bottom cascade>
          <div className={classes.exercise}>
            <LinearProgress
              style={{ width: "25%" }}
              variant="determinate"
              value={(results.score / listOfExercises.length) * 100}
            />
            <Typography
              color="secondary"
              variant="h3"
              className={classes.wording}
            >
              {exercise.type === "MCQ"
                ? generateMCQSentence()
                : generateVoltaireSentence()}
            </Typography>
            <FormControl className={classes.form}>
              <RadioGroup value={answer} onChange={handleChange}>
                {exercise.type === "MCQ" ? generateMCQAnswers() : ""}
              </RadioGroup>
            </FormControl>
            {((exercise.type === "Voltaire" && answer !== "_____") ||
              answered) && (
              <Typography variant="h3">
                {!answered ? answer : checkAnswer() ? "Well Done !" : "Wrong"}
              </Typography>
            )}
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={handleValidate}
              style={{ margin: 20 }}
            >
              {answered ? "Next" : "Confirm"}
            </Button>
            {exercise.type === "Voltaire" && !answered && (
              <Button
                color="secondary"
                size="large"
                variant="contained"
                onClick={() => {
                  setAnswer("_____");
                  handleValidate();
                }}
                style={{ margin: 20 }}
              >
                There is no Error
              </Button>
            )}
          </div>
        </Fade>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
}
