import React from "react";

import {
  makeStyles,
  CircularProgress,
} from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth";

import Hub from "./Hub"
import Login from "./Login"

const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center",
    height: "100%",
  },
}));

export default function Welcome(props) {
  const classes = useStyles();

  const [values, setValues] = props.values;

  const [cards, setCards] = props.cards;

  const [err, setError] = props.err;

  const setOpenAlert = props.setOpenAlert;

  const authInit = props.auth;

  return (
    <div className={classes.center}>
      {( cards.list.length !== 0 ? (firebase.auth().currentUser || authInit) ? (
        <Hub values={values} cards={cards} setCards={setCards} />
      ) : (
        <Login values={values} setValues={setValues} err={err} setError={setError} setOpenAlert={setOpenAlert}/>
      ) : <CircularProgress color="secondary"/>)}
    </div>
  );
}
