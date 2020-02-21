import React from "react";

import {
  TextField,
  makeStyles,
  FormControl,
  Input,
  InputLabel,
  InputAdornment,
  IconButton,
  Button
} from "@material-ui/core";
import Visibility from "@material-ui/icons/Visibility";
import VisibilityOff from "@material-ui/icons/VisibilityOff";

const useStyles = makeStyles(theme => ({
  center: {
    justifyContent: "center",
    textAlign: "center",
    width: 300
  },
  rectangle: {
    justifyContent: "center",
    padding: 2,
    borderRadius: 10,
    color: "#000",
    background: "#FFF"
  }
}));

export default function Welcome() {
  const classes = useStyles();

  const [values, setValues] = React.useState({
    login: "",
    password: "",
    showPassword: false,
    isLoggedIn: false
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
    setValues({ ...values, isLoggedIn: true });
    console.log(values)
  };

  const createSubjects = () => {
    let table = [];

    // for (const subject of firebase) {
      
    // }

    return table;
  }

  return (
    <div className={classes.center}>
      {values.isLoggedIn ? (
        <div>
          <h1>Welcome {values.login} !</h1>
          {
            createSubjects()
          }
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
                  label="User Name"
                  style={{ marginBottom: 15 }}
                  value={values.login}
                  onChange={handleChange("login")}
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
                  style={{ width: 175 }}
                  type={values.showPassword ? "text" : "password"}
                  value={values.password}
                  onChange={handleChange("password")}
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
              <FormControl noValidate autoComplete="on">
                <Button style={{ marginBottom: 15 }} onClick={handleLog}>
                  Login
                </Button>
              </FormControl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
