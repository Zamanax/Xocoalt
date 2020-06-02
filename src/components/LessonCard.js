import React from "react";
import { Typography, makeStyles, Paper } from "@material-ui/core";

import { capitalizeFirstLetter } from "../model/utils";

const useStyles = makeStyles((theme) => ({
  card: {
    margin: 15,
    padding: 25,
    transition: "transform .3s",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
  title: {
    fontSize: 25,
  },
}));

export default function LessonCard({ setSubject, subject }) {
  const classes = useStyles();

  return (
    <Paper
      className={classes.card}
      onClick={(e) => {
        setSubject(subject);
      }}
    >
      <Typography className={classes.title}>
        {capitalizeFirstLetter(subject)}
      </Typography>
    </Paper>
  );
}
