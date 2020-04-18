import React from "react";

import { makeStyles, Typography, Paper } from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

import { checkAnswer } from "../model/utils";

const useStyles = makeStyles((theme) => ({
  rectangle: {
    width: "75%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    margin: 20,
  },
  title: {
    textTransform: "uppercase",
  },
  head: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  answer: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default function AnswerCard(props) {
  const classes = useStyles();
  const { question, goodAnswer, type, possibleAnswers } = props;
  let { answer } = props;

  return (
    <Paper elevation={3} className={classes.rectangle}>
      <div className={classes.head}>
        <Typography className={classes.title}>{goodAnswer}</Typography>
        <Typography className={classes.title}>{type}</Typography>
      </div>
      <Typography className={classes.question}>{question}</Typography>
      <div className={classes.answer}>
        {checkAnswer(
          {
            type: type,
            goodAnswer: goodAnswer,
            possibleAnswers: possibleAnswers,
          },
          answer
        ) ? (
          <CheckRoundedIcon style={{ color: "green" }} />
        ) : (
          <CloseRoundedIcon style={{ color: "red" }} />
        )}
        <Typography>
          {type === "Voltaire"
            ? answer === "_____" && possibleAnswers === goodAnswer
              ? `${goodAnswer}: ${answer}`
              : `${goodAnswer}: There was no mistake`
            : answer}
        </Typography>
      </div>
    </Paper>
  );
}
