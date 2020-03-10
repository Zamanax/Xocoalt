import React from "react";

import {
  makeStyles,
} from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth";

import Hub from "./Hub"
import Login from "./Login"

import { createSubjects } from "../model/utils"

const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center"
  },
}));

export default function Welcome(props) {
  const classes = useStyles();

  const [values, setValues] = props.values;

  const [cards, setCards] = props.cards;

  const [authInit, setAuthInit] = React.useState(true);

  const db = firebase.firestore();

  if (authInit) {
    firebase.auth().onAuthStateChanged((user) => {
      setAuthInit(false)
      if (user) {
        db.collection("users")
                .doc("4GYEMfS0bfNm8zAqBgN5")
                .get()
                .then(snap => {
                  const val = snap.data()[user.email];
                  createSubjects(val, cards, setCards);
                  setValues({ ...values, user: val });
                });
      }
    })
  }

  return (
    <div className={classes.center}>
      {(firebase.auth().currentUser || authInit) ? (
        <Hub values={values} cards={cards} setCards={setCards} />
      ) : (
        <Login values={values} setValues={setValues} cards={cards} setCards={setCards} />
      )}
    </div>
  );
}
