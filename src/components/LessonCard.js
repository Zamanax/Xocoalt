import React from "react";
import {
  Typography,
  makeStyles,
  useTheme,
  Card,
  CardContent,
} from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import { useHistory } from "react-router-dom";

import {
  capitalizeFirstLetter,
  reverseGradient,
  randomMinMax,
} from "../model/utils";

import * as firebase from "firebase/app";
import "firebase/auth";

const useStyles = makeStyles((theme) => ({
  card: {
    background: reverseGradient(theme, randomMinMax(0, 180)),
    animation: `$animatedGradient ${randomMinMax(10, 15)}s linear infinite`,
    backgroundSize: "400% 400%",
    margin: 15,
    width: 400,
    height: "60%",
    maxHeight: 250,
    transition: "transform .3s",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
  top: {
    display: "flex",
    flexDirection: "column",
    height: "80%",
    maxHeight: 250,
    justifyContent: "center",
  },
  chap: {
    transition: "transform .3s",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    height: "calc(15% + 10px)",
    minHeight: 50,
  },
  percent: {
    border: "1px solid",
    lineHeight: 2.5,
    padding: 2,
    borderRadius: 5,
    width: 30,
    height: 30,
    fontSize: 10,
    textAlign: "center",
    verticalAlign: "middle",
  },
  "@keyframes animatedGradient": {
    "0%": { backgroundPosition: "0% 50%" },
    "50%": { backgroundPosition: "100% 50%" },
    "100%": { backgroundPosition: "0% 50%" },
  },
}));

export default function LessonCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

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

  const buildChapter = (chap) => {
    let chapters = [];
    let i = 0;
    for (const key of Object.keys(chap)) {
      if (currentChap === chap[key] || (i === 0 && currentChap === undefined)) {
        chapters.push(
          <Typography
            variant="h4"
            key={i}
            className={classes.chap}
            onClick={(e) => {
              e.stopPropagation();
              passInfo(chap[key].title);
            }}
          >
            {chap[key].title}
          </Typography>
        );
      } else if (currentChap !== undefined && currentChap[0] > i) {
        chapters.push(
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center",
            }}
            key={i}
            onClick={(e) => {
              e.stopPropagation();
              passInfo(chap[key].title);
            }}
          >
            <Typography key={i} variant="h6" className={classes.chap}>
              {chap[key].title}
            </Typography>
            <CheckIcon
              key={i + 1}
              fontSize="small"
              style={{ color: theme.palette.primary.main }}
            />
          </div>
        );
      } else {
        chapters.push(
          <Typography
            key={i}
            variant="h6"
            className={classes.chap}
            onClick={(e) => {
              e.stopPropagation();
              passInfo(chap[key].title);
            }}
          >
            {chap[key].title}
          </Typography>
        );
      }
      i++;
    }
    return chapters;
  };

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
    <Card
      className={classes.card}
      onClick={(e) => {
        passInfo();
      }}
    >
      <CardContent className={classes.top}>
        {buildChapter(props.chapters)}
      </CardContent>
      <div className={classes.bottom}>
        <Typography variant="h5">
          {capitalizeFirstLetter(props.type)}
        </Typography>
        <Typography variant="h6" className={classes.percent}>
          {user.languages !== undefined
            ? user.languages[defaultLanguage][props.type] !== undefined
              ? user.languages[defaultLanguage][props.type].progression +
                "%"
              : "0%"
            : "0%"}
        </Typography>
      </div>
    </Card>
  );
}
