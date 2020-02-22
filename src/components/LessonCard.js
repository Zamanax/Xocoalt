import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

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
    minWidth: 300
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
    height: 35
  },
  percent: {
    border: "1px solid",
    lineHeight: 2,
    padding: 2,
    borderRadius: 5,
    width: 30,
    height: 30,
    fontSize: 15,
    textAlign: "center",
    verticalAlign: "middle"
  }
}));

export default function LessonCard(props) {
  const classes = useStyles();

  const buildChapter = chap => {
    let chapters = [];
    let i = 0;
    let currentChap = undefined;
    try {
      currentChap =
        props.user.languages[Object.keys(props.user.languages)[0]][props.type]
          .current;
    } catch {}
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
          >
            <Typography key={i} style={{ color: "#939393" }}>
              {key.slice(1)}
            </Typography>
            <CheckIcon fontSize="small" style={{ color: "#939393" }} />
          </div>
        );
      } else {
        chapters.push(
          <Typography key={i} style={{ color: "#939393" }}>
            {key.slice(1)}
          </Typography>
        );
      }
      i++;
    }
    return chapters;
  };

  return (
    <div className={classes.card}>
      <div className={classes.top}>{buildChapter(props.chapters)}</div>
      <div className={classes.bottom}>
        <Typography variant="h5">
          {capitalizeFirstLetter(props.type)}
        </Typography>
        <Typography variant="h6" className={classes.percent}>
          {(props.user.languages[Object.keys(props.user.languages)[0]][
            props.type
          ] !== undefined
            ? props.user.languages[Object.keys(props.user.languages)[0]][
                props.type
              ].progression
            : 0) + "%"}
        </Typography>
      </div>
    </div>
  );
}
