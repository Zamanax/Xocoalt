import React, { useState } from "react";
import { useHistory } from "react-router-dom";

import {
  Typography,
  makeStyles,
  Stepper,
  Step,
  StepLabel,
} from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  selected: {
    margin: 20,
    padding: 30,
  },
  unselected: {
    margin: 20,
    padding: 30,
    border: "dashed #424242",
    borderRadius: 10,
  },
}));

export default function SubjectPage({ lang, subject, setOpenDialog }) {
  const classes = useStyles();
  const history = useHistory();
  const [infos, setInfos] = useState([]);

  const db = firebase.firestore();

  if (infos.length === 0 && subject !== undefined) {
    db.collection("sources")
      .doc("english")
      .collection("exercises")
      .doc(lang)
      .get()
      .then((snap) => {
        setInfos(snap.data()[subject]);
      });
  }

  return subject !== undefined ? (
    <div className={classes.selected}>
      <Stepper variant="outlined" orientation="vertical">
        {infos.map((item, index) => (
          <Step
            onClick={(e) => {
              localStorage.chapToResume = JSON.stringify({
                title: item.title,
                type: subject,
              });
              if (localStorage.results !== undefined) {
                setOpenDialog(true);
              } else {
                history.push(
                  "/" +
                    "english".slice(0, 2) +
                    lang.slice(0, 2) +
                    "/" +
                    subject +
                    "/" +
                    item.title
                );
              }
            }}
            style={{ cursor: "pointer" }}
          >
            <StepLabel>{item.title}</StepLabel>
          </Step>
        ))}
      </Stepper>
    </div>
  ) : (
    <div className={classes.unselected}>
      <Typography>Please, click on one of the subject above.</Typography>
    </div>
  );
}
