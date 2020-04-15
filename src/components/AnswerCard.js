import React from "react";

import { makeStyles, Typography, Paper } from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

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
  answer: {
    display: "flex",
    flexDirection: "row",
  },
}));

export default function AnswerCard(props) {
  const classes = useStyles();
  const { question, goodAnswer, answer } = props;

  return (
    <Paper elevation={3} className={classes.rectangle} >
      <Typography className={classes.title}>{goodAnswer}</Typography>
      <Typography className={classes.question}>{question}</Typography>
      <div className={classes.answer}>
        {goodAnswer === answer ? (
          <CheckRoundedIcon style={{ color: "green" }} />
        ) : (
          <CloseRoundedIcon style={{ color: "red" }} />
        )}
        <Typography>{answer}</Typography>
      </div>
    </Paper>
  );
}
