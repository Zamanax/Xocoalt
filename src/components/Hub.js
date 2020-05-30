import React, { useState, useEffect } from "react";
import { useHistory } from "react-router";

import {
  makeStyles,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
} from "@material-ui/core";

import LessonCard from "../components/LessonCard";
import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  hub: {
  },
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: "0 7.5% 0 7.5%",
  },
  cardContainer: {
    display: "flex",
    flexWrap: "wrap",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    padding: 50,
  },
  target: {
    textTransform: "capitalize",
  },
  tengwar: {
    fontFamily: "Tengwar",
  },
  button: {
    marginBottom: 10,
  }
}));

export default function Hub(props) {
  const db = firebase.firestore();
  const classes = useStyles();
  const history = useHistory();

  const [openDialog, setOpenDialog] = useState(false);
  const [target, setTarget] = useState("french");
  const [languages, setLanguages] = useState([]);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    db.collection("sources")
      .doc("english")
      .collection("exercises")
      .doc(target.toLowerCase())
      .get()
      .then((snap) => {
        const val = snap.data();
        setCards(
          Object.keys(val).map((subject, i) => (
            <LessonCard
              type={subject}
              chapters={val[subject]}
              setOpenDialog={setOpenDialog}
              key={i}
            />
          ))
        );
      });
  }, [db, target]);

  const chooseSubject = (remove) => {
    if (remove) {
      localStorage.removeItem("results");
      localStorage.removeItem("listOfExercises");
    }
    const chapToResume = JSON.parse(localStorage.chapToResume);
    history.push(
      "/" +
        "en" +
        target.slice(0, 2) +
        "/" +
        chapToResume.type +
        "/" +
        chapToResume.title
    );
  };

  const handleDialogCloseCancel = () => {
    setOpenDialog(false);
  };
  const handleDialogCloseConfirm = () => {
    setOpenDialog(false);
    chooseSubject(true);
  };

  const handleLanguageChange = (event) => {
    setTarget(event.target.value);
  };

  if (languages.length === 0) {
    const db = firebase.firestore();
    db.collection("sources")
      .doc("english")
      .collection("exercises")
      .get()
      .then((snap) => {
        const toReturn = [];
        snap.forEach((doc) => {
          toReturn.push(doc.id);
        });
        setLanguages(toReturn);
      });
  }

  return (
    <div className={classes.hub}>
      <div className={classes.header}>
        <Select value={target} onChange={handleLanguageChange}>
          {languages.map((language, i) => (
            <MenuItem value={language} key={i} className={classes.target}>
              {language}
            </MenuItem>
          ))}
        </Select>
      </div>
      <div className={classes.cardContainer}>{cards}</div>
      {localStorage.results !== undefined && (
        <Button
          variant="contained"
          onClick={() => {
            chooseSubject(false);
          }}
          className={classes.button}
          size="large"
        >
          Resume
        </Button>
      )}
      <Dialog open={openDialog} onClose={handleDialogCloseCancel}>
        <DialogTitle>Found Previous Exercise</DialogTitle>
        <DialogContent>
          <DialogContentText>
            If you confirm, all data about the previous exercise you did not
            finish will be lost.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogCloseCancel} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDialogCloseConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
