import React from "react";
import {
  Typography,
  makeStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  createMuiTheme,
  Button
} from "@material-ui/core";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%"
  },
  formControl: {
    margin: 15
  }
}));

const themes = {
  Beach: {
    palette: {
      primary: {
        main: "#5E7880"
      },
      secondary: {
        main: "#BDF0FF"
      },
      background: {
        default: "#386F80"
      }
    }
  },
  Dark: {
    palette: {
      type: "dark",
      primary: {
        main: "#2f2f2f"
      },
      secondary: {
        main: "#fff"
      },
      background: {
        default: "#2f2f2f"
      }
    }
  }
};

export default function Settings(props) {
  const db = firebase.firestore();
  const classes = useStyles();
  const setTheme = props.theme;
  const [themeIndex, setIndex] = React.useState(
    localStorage.getItem("themeIndex") || 0
  );
  // const user = props.user;

  const handleChange = event => {
    localStorage.setItem("theme", JSON.stringify(themes[event.target.value]));
    const index = Object.keys(themes).indexOf(event.target.value);
    setIndex(index);
    localStorage.setItem("themeIndex", index);
    setTheme(createMuiTheme(themes[event.target.value]));
  };

  return (
    <div className={classes.center}>
      <Typography variant="h2" color="secondary">
        Settings
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel>Theme</InputLabel>
        <Select
          value={Object.keys(themes)[parseInt(themeIndex, 10)]}
          onChange={handleChange}
          color="secondary"
        >
          {Object.keys(themes).map((name, i) => (
            <MenuItem value={name} key={i}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={classes.formControl}>
        <input type="file" accept="application/JSON" id="uploadButton" style={{display:"none"}}/>
        <label htmlFor="uploadButton">
          <Button variant="contained" component="span">Upload</Button>
        </label>
      </div>
    </div>
  );
}
