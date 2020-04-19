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
  TextField,
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
  mergeDeep,
} from "../model/utils";
import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { checkAnswer, languages } from "../model/utils";
import { createDistractorOrtho } from "../model/distractor_ortho";
import AnswerCard from "./AnswerCard";
import { estimateAbilityEAP } from "../model/irt";

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
    width: "100%",
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
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

  const { values, setValues } = props;
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
          type: [],
          possibleAnswers: [],
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
  const handleFocus = () => {
    setAnswer("");
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

  const updateResults = () => {
    setResults({
      ...results,
      question: [...results.question, exercise.sentence],
      goodAnswers: [...results.goodAnswers, exercise.goodAnswer],
      answers: [...results.answers, answer],
      score: checkAnswer(exercise, answer) ? ++results.score : results.score,
      type: [...results.type, exercise.type],
      possibleAnswers: [...results.possibleAnswers, exercise.possibleAnswers],
    });
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
      if (checkAnswer(exercise, answer)) {
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
          type={results.type[i]}
          possibleAnswers={results.possibleAnswers[i]}
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
    return (
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
        ))}
      </RadioGroup>
    );
  };

  const generateVoltaireSentence = () => {
    return exercise.sentence.split(/ /gi).map(function (text, i) {
      if (text.includes("_____")) {
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

  const generateFillAnswers = () => {
    return (
      <TextField
        label="Answer"
        value={answer}
        onChange={handleChange}
        onFocus={handleFocus}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleValidate();
          }
        }}
      />
    );
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
        b:
          (Math.log10(
            results.question[i].length *
              (results.type[i] === "MCQ" ? 1 : 3) *
              results.goodAnswers[i].length
          ) -
            2) /
          2,
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
    let cpt = 0;
    let acc = 0;
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        cpt++;
        acc += data[key].theta;
      }
    }
    return acc / cpt;
  };

  const uploadData = () => {
    db.collection("users")
      .doc(firebase.auth().currentUser.email)
      .get()
      .then((snap) => {
        const newUser = mergeDeep(snap.data(), {
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
                  theta: computeSubjectTheta(
                    snap.data().progress[subject].chapters
                  ),
                },
              }
            }
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
    <div className={classes.frame}>
      <Typography color="secondary" variant="h2" className={classes.chap}>
        {chapter}
      </Typography>
      {results.result ? (
        <div className={classes.result}>
          <Typography
            variant="h3"
            color="secondary"
            style={{ marginLeft: "7.5%" }}
          >
            Results
          </Typography>
          <Typography
            variant="h4"
            color="secondary"
            style={{ marginLeft: "7.5%" }}
          >
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
              {exercise.type !== "Voltaire"
                ? generateMCQSentence()
                : generateVoltaireSentence()}
            </Typography>
            {exercise.type !== "Voltaire" && (
              <FormControl className={classes.form}>
                {exercise.type === "MCQ"
                  ? generateMCQAnswers()
                  : generateFillAnswers()}
              </FormControl>
            )}
            {(exercise.type === "Voltaire" || answered) && (
              <Typography variant="h3">
                {!answered
                  ? answer !== "_____"
                    ? answer
                    : "Select the word with an error"
                  : checkAnswer(exercise, answer)
                  ? "Well Done !"
                  : "Wrong"}
              </Typography>
            )}
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
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={handleValidate}
              style={{ margin: 20 }}
            >
              {answered ? "Next" : "Confirm"}
            </Button>
          </div>
        </Fade>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
}
