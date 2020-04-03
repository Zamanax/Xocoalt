import React from "react";

import { makeStyles } from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth";

import Hub from "./Hub";
import Login from "./Login";
import { Fade } from "react-reveal";

const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center",
    height: "100%",
    width: "100%",
  }
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
      {firebase.auth().currentUser || authInit ? (
        <Fade bottom duration={1000}>
          <Hub values={values} cards={cards} setCards={setCards} />
        </Fade>
      ) : (
        <Fade bottom duration={1000}>
          <Login
            values={values}
            setValues={setValues}
            err={err}
            setError={setError}
            setOpenAlert={setOpenAlert}
          />
        </Fade>
      )}
    </div>
  );
}
