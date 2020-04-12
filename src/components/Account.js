import React from "react";

import { makeStyles, Typography, TextField } from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/auth"
import "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "2% 7.5% 1% 7.5%",
  },
}));

export default function Account(props) {
  const classes = useStyles();
  const db = firebase.firestore();

  const { user } = props;

  const [name, setName] = React.useState(undefined);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  return (
    <div className={classes.main}>
      <Typography variant="h4" color="secondary">
        Name:
      </Typography>
      <TextField value={name === undefined ? user.name : name} onChange={handleChange} />
    </div>
  );
}
