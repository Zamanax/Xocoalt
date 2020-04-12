import React from "react";
import {
  makeStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  createMuiTheme,
} from "@material-ui/core";
import clsx from "clsx";

import DatabaseTree from "./DatabaseTree"

const useStyles = makeStyles(theme => ({
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    height: "80%",
    overflowY: "scroll",
    scrollbarWidth: "none",
  },
  formControl: {
    margin: 15
  }
}));

const themes = {
  "The One Good Theme": {
    palette: {
      primary: {
        main: "#FFE376"
      },
      secondary: {
        main: "#FFB467"
      },
    }
  },
  "The One Good Theme (Dark)": {
    palette: {
      primary: {
        main: "#FFE376"
      },
      secondary: {
        main: "#FFB467"
      },
    type: "dark"
  },
  },
  Negative: {
    palette: {
      primary: {
        main: "#fff"
      },
      secondary: {
        main: "#2f2f2f"
      },
      background: {
        default: "#fff"
      }
    }
  },
  "Cyberpunk 2077": {
    palette: {
      primary: {
        main: "#3f51b5"
      },
      secondary: {
        main: "#f50057"
      },
      type:"dark"
    }
  },
  Beach: {
    palette: {
      primary: {
        main: "#24454c"
      },
      secondary: {
        main: "#1093a7"
      },
      background: {
        default: "#def2f3"
      }
    }
  },
  "Constant Rambling": {
    palette: {
      primary: {
        main: "#fc8c8a",
      },
      secondary: {
        main: "#fee6c2"
      },
      background: {
        default: "#fc8c8a"
      },
    }
  }
};

export default function Settings(props) {
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
    console.log(createMuiTheme(themes[event.target.value]))
  };

  return (
    <div className={classes.center}>
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
      <div className={clsx(classes.formControl, classes.center)}>
        <DatabaseTree/>
      </div>
    </div>
  );
}
