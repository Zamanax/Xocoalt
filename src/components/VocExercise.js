import React from "react";

import {
  RadioGroup,
  FormControlLabel,
  withStyles,
  Radio,
  useTheme,
  LinearProgress,
  TextField,
  FormControl,
  Typography,
  Button,
    makeStyles,
  CircularProgress
} from "@material-ui/core";
import { Fade } from "react-reveal";

import { capitalizeFirstLetter, checkAnswer } from "../model/utils";

import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

const useStyles = makeStyles((theme) => ({
  exercise: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
  },
  form: {
    maxHeight: 200,
  },
  wording: {
    margin: 40,
  },
}));

export default function VocExercise({
  exercise,
  answered,
  answer,
  setAnswer,
  listOfExercises,
  setListOfExercises,
  results,
  setResults,
  setFecthing,
  setAnswered,
}) {
  const theme = useTheme();
  const classes = useStyles();

  const SecondaryRadio = withStyles({
    root: {
      color: theme.palette.secondary.main,
    },
  })((props) => <Radio {...props} />);

  

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

  const handleChange = (event) => {
    setAnswer(event.target.value);
  };
  const handleFocus = () => {
    setAnswer("");
  };

  return exercise.fetching ? (
    <Fade bottom cascade>
      <div className={classes.exercise}>
        <LinearProgress
          style={{ width: "25%" }}
          variant="determinate"
          value={(results.score / listOfExercises.length) * 100}
        />
        <Typography color="secondary" variant="h3" className={classes.wording}>
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
  );
}
