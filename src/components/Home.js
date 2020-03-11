import React from "react";

import {
  makeStyles,
} from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth";

import Hub from "./Hub"
import Login from "./Login"

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

  const authInit = props.auth;

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
