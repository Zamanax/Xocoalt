import React from "react";

import { makeStyles } from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth";

import Hub from "./Hub";
import Login from "./Login";
import { Fade } from "react-reveal";

const useStyles = makeStyles((theme) => ({
  center: {
    justifyContent: "center",
    height: "100%",
    width: "100%",
    textAlign: "center",
  },
}));

export default function Welcome(props) {
  const classes = useStyles();

  const [values, setValues] = props.values;

  const [err, setError] = props.err;

  const setOpenAlert = props.setOpenAlert;

  const authInit = props.auth;

  return (
    <div className={classes.center}>
      <Fade duration={1000}>
        {firebase.auth().currentUser || authInit ? (
          <Hub
            values={values}
          />
        ) : (
          <Login
            values={values}
            setValues={setValues}
            err={err}
            setError={setError}
            setOpenAlert={setOpenAlert}
          />
        )}
      </Fade>
    </div>
  );
}
