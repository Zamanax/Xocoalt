import React from "react";
import { Typography, makeStyles, useTheme } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import { useHistory } from "react-router-dom";

import { capitalizeFirstLetter, linearGradient } from "../model/utils";

const useStyles = makeStyles(theme => ({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: 2,
    borderRadius: 10,
    background: linearGradient(theme),
    border: "solid 1px " + theme.palette.primary.main,
    margin: 15,
    width: 400,
    transition: "transform .3s",
    textAlign: "center",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer"
    }
  },
  top: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "normal",
    height: 175,
    justifyContent: "center"
  },
  chap: {
    transition: "transform .3s",
    "&:hover": {
      transform: "scale(1.1)",
      cursor: "pointer"
    }
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTop: "1px solid",
    height: 50
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
    verticalAlign: "middle"
  }
}));

export default function LessonCard(props) {
  const classes = useStyles();
  const history = useHistory();
  const theme = useTheme();

  const defaultLanguage =
    props.user.languages !== undefined
      ? Object.keys(props.user.languages)[0]
      : "french";

  let currentChap = undefined;
  try {
    currentChap = props.user.languages[defaultLanguage][props.type].current;
  } catch {}

  const buildChapter = chap => {
    let chapters = [];
    let i = 0;
    for (const key of Object.keys(chap)) {
      if (currentChap === chap[key] || (i === 0 && currentChap === undefined)) {
        chapters.push(
          <Typography variant="h4" key={i} className={classes.chap}>
            {chap[key].title}
          </Typography>
        );
      } else if (currentChap !== undefined && currentChap[0] > i) {
        chapters.push(
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "center"
            }}
            key={i}
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
          <Typography key={i} variant="h6" className={classes.chap}>
            {chap[key].title}
          </Typography>
        );
      }
      i++;
    }
    return chapters;
  };

  const chooseSubject = () => {
    const defaultSourceLanguage =
      props.user.languages !== undefined
        ? Object.keys(props.user.languages)[0]
        : "english";
    const defaultDestLanguage =
      props.user.languages !== undefined
        ? Object.keys(props.user.languages[defaultSourceLanguage])[0]
        : "french";
    history.push(
      "/" +
        defaultSourceLanguage.slice(0, 2) +
        defaultDestLanguage.slice(0, 2) +
        "/" +
        props.type +
        "/" +
        (currentChap !== undefined ? currentChap : props.chapters[0].title) +
        "?id=0"
    );
  };

  return (
    <div className={classes.card} onClick={chooseSubject}>
      <div className={classes.top}>{buildChapter(props.chapters)}</div>
      <div className={classes.bottom}>
        <Typography variant="h5">
          {capitalizeFirstLetter(props.type)}
        </Typography>
        <Typography variant="h6" className={classes.percent}>
          {props.user.languages !== undefined
            ? props.user.languages[defaultLanguage][props.type] !== undefined
              ? props.user.languages[defaultLanguage][props.type].progression +
                "%"
              : "0%"
            : "0%"}
        </Typography>
      </div>
    </div>
  );
}
