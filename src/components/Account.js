import React from "react";

import { makeStyles, Typography } from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles(theme => ({
  main: {
    margin: "2% 7.5% 1% 7.5%",
  }
}));

export default function Account(props) {
    const classes = useStyles();
    const db = firebase.firestore();

  const { user } = props.user;

  return <div className={classes.main}><Typography>Account</Typography></div>;
}
