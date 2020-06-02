import React from "react";
import {
  Typography,
  makeStyles,
  Paper,
} from "@material-ui/core";

import { useHistory } from "react-router-dom";

import {
  capitalizeFirstLetter,
} from "../model/utils";

import * as firebase from "firebase/app";
import "firebase/auth";

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
  }
}));

export default function LessonCard(props) {
  const classes = useStyles();
  const history = useHistory();

  const setOpenDialog = props.setOpenDialog;

  const user = firebase.auth().currentUser

  const defaultLanguage =
    user.languages !== undefined
      ? Object.keys(user.languages)[0]
      : "french";

  let currentChap = undefined;
  try {
    currentChap = user.languages[defaultLanguage][props.type].current;
  } catch {}

  const chooseSubject = (chap) => {
    const defaultSourceLanguage =
      user.languages !== undefined
        ? Object.keys(user.languages)[0]
        : "english";
    const defaultDestLanguage =
      user.languages !== undefined
        ? Object.keys(user.languages[defaultSourceLanguage])[0]
        : "french";
    if (localStorage.getItem("results")) {
      localStorage.removeItem("results");
    }
    chap =
      chap !== undefined
        ? chap
        : currentChap !== undefined
        ? currentChap
        : props.chapters[0].title;
    history.push(
      "/" +
        defaultSourceLanguage.slice(0, 2) +
        defaultDestLanguage.slice(0, 2) +
        "/" +
        props.type +
        "/" +
        chap
    );
  };

  const passInfo = (chap) => {
    localStorage.chapToResume = JSON.stringify({
      title: chap,
      type: props.type,
    });
    if (localStorage.results !== undefined) {
      setOpenDialog(true);
    } else {
      chooseSubject(chap);
    }
  };

  return (
    <Paper
      className={classes.card}
      onClick={(e) => {
        passInfo(props.chapters[0].title);
      }}
    >
      <Typography className={classes.title}>{capitalizeFirstLetter(props.type)}</Typography>
    </Paper>
  );
}
