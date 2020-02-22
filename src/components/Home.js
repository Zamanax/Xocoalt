import React from "react";

import {
  TextField,
  makeStyles,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  Button,
  CircularProgress
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

import * as firebase from "firebase/app";
import "firebase/database";

import LessonCard from "./LessonCard";

import {capitalizeFirstLetter} from "../model/utils"

const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center",
    width: 300
  },
  rectangle: {
    padding: 2,
    borderRadius: 10,
    color: "#000",
    background: "#FFF"
  },
}));

export default function Welcome() {
  const database = firebase.database();

  const classes = useStyles();

  const [values, setValues] = React.useState({
    login: "",
    password: "",
    showPassword: false,
    user: false,
    fetching: false
  });

  const [err, setError] = React.useState({
    name: false,
    password: false
  });

  const [cards, setCards] = React.useState({
    list: [],
    fetching: false,
  });

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
    database
      .ref("/lang/english/languages/" + Object.keys(user.languages)[0])
      .once("value")
      .then(snapshot => {
        let list = [];
        const subjects = snapshot.val();
        let i = 0;
        for (const subject of Object.keys(subjects)) {
          list.push(<LessonCard type={subject} user={user} key={i} />);
          i++;
        }
        setCards({ list: list, fetching: false });
      });
  };

  return (
    <div className={classes.center}>
      {values.user ? (
        <div>
          <h2>Welcome {values.login} !</h2>
          <h1>{capitalizeFirstLetter(Object.keys(values.user.languages)[0])}</h1>
          <div>
            {cards.fetching ? <CircularProgress /> : cards.list}
          </div>
        </div>
      ) : (
        <div>
          <h1>Login</h1>
          <div className={classes.rectangle}>
            <div>
              <h3>Please enter your credentials</h3>
              <FormControl noValidate autoComplete="on">
                <TextField
                  id="userName"
                  error={err.name}
                  label="User Name"
                  style={{ marginBottom: 15 }}
                  value={values.login}
                  onChange={handleChange("login")}
                  onKeyDown={(e)=>{if (e.key === "Enter") handleLog()}}
                />
              </FormControl>
              <FormControl
                noValidate
                autoComplete="on"
                style={{ marginBottom: 15 }}
              >
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  id="password"
                  error={err.password}
                  style={{ width: 175 }}
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
                  onKeyDown={(e)=>{if (e.key === "Enter") handleLog()}}
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
                <FormControl>
                  <Button style={{ marginBottom: 20 }} onClick={handleLog}>
                    Login
                  </Button>
                </FormControl>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
