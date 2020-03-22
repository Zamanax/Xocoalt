import React from "react";
import { Typography, makeStyles, FormControl, InputLabel, MenuItem, Select, createMuiTheme } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "100%"
  }
}));

const themes = {
  Beach : {
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
  Dark : {
    palette: {
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
  const classes = useStyles();
  const setTheme = props.theme;
  const [themeIndex, setIndex] = React.useState(0);
  // const user = props.user;
  
  const handleChange = (event) => {
    setIndex(Object.keys(themes).indexOf(event.target.value))
    setTheme(createMuiTheme(themes[event.target.value]));
  }

  return (
    <div className={classes.center}>
      <Typography variant="h2" color="secondary">
        Settings
      </Typography>
      <FormControl className={classes.formControl}>
        <InputLabel>Theme</InputLabel>
        <Select
        value={Object.keys(themes)[themeIndex]}
          onChange={handleChange}
          color="secondary"
        >
          {Object.keys(themes).map((name, i) => (<MenuItem value={name} key={i}>{name}</MenuItem>))}
        </Select>
      </FormControl>
    </div>
  );
}
