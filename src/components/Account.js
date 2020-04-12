import React from "react";

import {
  makeStyles,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@material-ui/core";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

const useStyles = makeStyles((theme) => ({
  main: {
    margin: "2% 7.5% 1% 7.5%",
  },
  name: {
    display: "flex",
    flexDirection: "column",
  },
  line: {
    alignItems: "center",
    flexDirection: "row",
  },
}));

export default function Account(props) {
  const classes = useStyles();
  const db = firebase.firestore();

  const [values, setValues] = props.user;

  const [name, setName] = React.useState(undefined);
  const [nameStateWatcher, setNameStateWatcher] = React.useState(<ArrowRightAltIcon color="secondary" />);

  const handleChange = (event) => {
    setName(event.target.value);
  };

  React.useEffect(
    ()=>{
      if (name !== undefined && name !== values.user.name) {
        setNameStateWatcher(<ArrowRightAltIcon color="secondary" />);
      } else {
        setNameStateWatcher(<CheckCircleIcon color="secondary"/>);
      }}
  ,[name, values.user.name])

  const handleNameChange = () => {
    setNameStateWatcher(<CircularProgress size="small" color="secondary"/>)
    db.collection("users")
      .doc(firebase.auth().currentUser.email)
      .set({ name: name }, { merge: true })
      .then(() => {
        db.collection("users")
          .doc(firebase.auth().currentUser.email)
          .get()
          .then((snap) => {
        setValues({...values, user: snap.data()})
          });
      });
  };

  return (
    <div className={classes.main}>
      <div className={classes.name}>
        <Typography variant="h4" color="secondary">
          Name:
        </Typography>
        <div className={classes.line}>
          <TextField
            value={name === undefined ? values.user.name : name}
            onChange={handleChange}
            onKeyDown={(e)=>{if (e.key === "Enter") {
              handleNameChange()
            }}}
          />
          <IconButton onClick={handleNameChange} disabled={!(name !== undefined && name !== values.user.name)}>
            {nameStateWatcher}
          </IconButton>
        </div>
      </div>
    </div>
  );
}
