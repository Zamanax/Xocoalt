import React from "react";

import {
  makeStyles,
  TextField,
  FormControl,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/database";

import LessonCard from "./LessonCard";

import { capitalizeFirstLetter } from "../model/utils";


const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center"
  },
  rectangle: {
    padding: 2,
    borderRadius: 10,
    color: "#000",
    background: "#FFF",
    width: 300,
    paddingBottom: 15,
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row"
  },
  buttons: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly"
  },
  pageTitle: {
    margin: 20,
    fontWeight: "normal",
  }
}));

export default function Welcome(props) {
  const database = firebase.database();

  const classes = useStyles();

  const [values, setValues] = props.values;

  const [cards, setCards] = props.cards;

  const [err, setError] = React.useState({
    name: false,
    password: false
  });

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleRegister = () => {
    setOpenDialog(true);
  };

  const handleDialogCloseCancel = () => {
    setOpenDialog(false);
  };
  const handleDialogCloseConfirm = () => {
    setOpenDialog(false);

    setValues({ ...values, fetching: true });

    database.ref("/users/" + values.login).set(
      {
        name: values.login,
        password: values.password
      },
      function(error) {
        if (error) {
        } else {
          handleLog();
        }
      }
    );
  };

  const handleChange = prop => event => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

  const handleLog = () => {
    setValues({ ...values, fetching: true });
    setError({
      name: false,
      password: false
    });

    database
      .ref("/users/" + values.login)
      .once("value")
      .then(snapshot => {
        setValues({ ...values, fetching: false });
        let val = snapshot.val();
        if (val !== null && val.password === values.password) {
          setValues({ ...values, user: val });
          createSubjects(val);
        } else if (val === null) {
          setError({ ...err, name: true });
        } else {
          setError({ ...err, password: true });
        }
      });
  };

  const createSubjects = (user) => {
    setCards({ ...cards, fetching: true });
    const defaultLanguage = user.languages !== undefined ? Object.keys(user.languages)[0] : "french";
    database
      .ref("/lang/english/languages/" + defaultLanguage)
      .once("value")
      .then(snapshot => {
        let list = [];
        const subjects = snapshot.val();
        let i = 0;
        for (const subject of Object.keys(subjects)) {
          list.push(
            <LessonCard
              type={subject}
              chapters={subjects[subject]}
              user={user}
              key={i}
            />
          );
          i++;
        }
        setCards({ list: list, fetching: false });
      });
  };

  return (
    <div className={classes.center}>
      {values.user ? (
        <div>
          <Typography variant="h3" color="secondary" >Welcome {values.login} !</Typography>
          <Fade bottom>
          <Typography variant="h4" color="secondary">
            {capitalizeFirstLetter( values.user.languages !== undefined ? Object.keys(values.user.languages)[0] : "french")}
          </Typography>
          <div className={classes.cardContainer}>
            {cards.fetching ? <CircularProgress /> : cards.list}
          </div>
          </Fade>
        </div>
      ) : (
        <div>
          <Typography variant="h3" color="secondary" className={classes.pageTitle}>Login</Typography>
          <div className={classes.rectangle}>
            <div>
              <h3>Please enter your credentials</h3>
              <FormControl noValidate autoComplete="on">
                <TextField
                  variant="outlined"
                  id="userName"
                  error={err.name}
                  label="User Name"
                  style={{ marginBottom: 15 ,width: 215 }}
                  value={values.login}
                  onChange={handleChange("login")}
                  onKeyDown={e => {
                    if (e.key === "Enter") handleLog();
                  }}
                />
              </FormControl>
              <FormControl
                noValidate
                variant="outlined"
                autoComplete="on"
                style={{ marginBottom: 15 }}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  error={err.password}
                  style={{ width: 215 }}
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  label="Password"
                  onKeyDown={e => {
                    if (e.key === "Enter") handleLog();
                  }}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {values.showPassword ? (
                          <Visibility />
                        ) : (
                          <VisibilityOff />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
              <br />
              {values.fetching ? (
                <CircularProgress />
              ) : (
                <div className={classes.buttons}>
                  <FormControl>
                    <Button onClick={handleLog}>Login</Button>
                  </FormControl>
                  <Typography variant="h6" style={{ fontSize: 15 }}>
                    OR
                  </Typography>
                  <FormControl>
                    <Button
                      onClick={handleRegister}
                    >
                      Register
                    </Button>
                  </FormControl>
                </div>
              )}
            </div>
          </div>
          <Dialog
            open={openDialog}
            onClose={handleDialogCloseCancel}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">Register</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Do you confirm to create this account ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleDialogCloseCancel} color="primary">
                Disagree
              </Button>
              <Button
                onClick={handleDialogCloseConfirm}
                color="primary"
                autoFocus
              >
                Agree
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      )}
    </div>
  );
}
