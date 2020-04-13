import React from "react";

import { makeStyles, Typography } from "@material-ui/core";
import CheckRoundedIcon from "@material-ui/icons/CheckRounded";
import CloseRoundedIcon from "@material-ui/icons/CloseRounded";

const useStyles = makeStyles((theme) => ({
  rectangle: {
    borderRadius: 5,
    width: "50%,",
    display: "flex",
    flexDirection: "column",
    background: theme.palette.type === "light" ? "#E6E6E6" : "#3D3D3D",
    padding: 10,
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
    <div className={classes.rectangle}>
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
    </div>
  );
}
