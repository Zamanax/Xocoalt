import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import { useHistory } from "react-router-dom";

import { capitalizeFirstLetter } from "../model/utils";

const useStyles = makeStyles(() => ({
  card: {
    display: "flex",
    flexDirection: "column",
    padding: 2,
    borderRadius: 10,
    color: "#000",
    background: "#FFF",
    margin: 15,
    minWidth: 300,
    transition: "transform .3s",
    '&:hover': {
      transform: "scale(1.1)",
      cursor: "pointer",
    },
  },
  top: {
    display: "flex",
    flexDirection: "column",
    fontWeight: "normal",
    height: 175,
    justifyContent: "center"
  },
  bottom: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderTop: "1px solid",
    height: 50,
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
	
	const defaultLanguage = props.user.languages !== undefined ? Object.keys(props.user.languages)[0] : "french";

  let currentChap = undefined;
  try {
    currentChap =
      props.user.languages[defaultLanguage][props.type]
        .current;
  } catch {}

  const buildChapter = chap => {
    let chapters = [];
    let i = 0;
    for (const key of Object.keys(chap)) {
      if (currentChap === key || (i === 0 && currentChap === undefined)) {
        chapters.push(
          <Typography key={i} style={{ fontSize: 30 }}>
            {key.slice(1)}
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
            <Typography key={i} style={{ color: "#939393" }}>
              {key.slice(1)}
            </Typography>
            <CheckIcon key={i+1} fontSize="small" style={{ color: "#939393" }} />
          </div>
        );
      } else {
        chapters.push(
          <Typography key={i} style={{ color: "#939393" }}>
            {key.slice(1)}
          </Typography>
        );
      }
      i+=2;
    }
    return chapters;
  };

  const chooseSubject = () => {
    history.push("/" + props.type)
  };

  return (
    <div className={classes.card} onClick={chooseSubject}>
      <div className={classes.top}>{buildChapter(props.chapters)}</div>
      <div className={classes.bottom}>
        <Typography variant="h5">
          {capitalizeFirstLetter(props.type)}
        </Typography>
        <Typography variant="h6" className={classes.percent}>
					{
						( props.user.languages !== undefined ? (props.user.languages[defaultLanguage][
            props.type
          ] !== undefined
            ? props.user.languages[defaultLanguage][
                props.type
              ].progression
          + "%" : "0%") : "0%")}
        </Typography>
      </div>
    </div>
  );
}
