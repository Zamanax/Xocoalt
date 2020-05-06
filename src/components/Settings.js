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

import DatabaseTree from "./DatabaseTree";

const useStyles = makeStyles((theme) => ({
  center: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  formControl: {
    margin: 15,
  },
}));

const themes = {
  "The Bad Good Theme": {
    palette: {
      primary: {
        main: "#FFE376",
      },
      secondary: {
        main: "#FFB467",
      },
    },
  },
  "The One Good Theme": {
    palette: {
      primary: {
        main: "#FFE376",
      },
      secondary: {
        main: "#FFB467",
      },
      type: "dark",
    },
  },
  Negative: {
    palette: {
      primary: {
        main: "#fff",
      },
      secondary: {
        main: "#2f2f2f",
      },
      background: {
        default: "#fff",
      },
    },
  },
  "Cyberpunk 2077": {
    palette: {
      primary: {
        main: "#3f51b5",
      },
      secondary: {
        main: "#f50057",
      },
      type: "dark",
    },
  },
  "I'm blue": {
    palette: {
      primary: {
        main: "#24454c",
      },
      secondary: {
        main: "#1093a7",
      },
      background: {
        default: "#def2f3",
      },
    },
  },
  "Constant Rambling": {
    palette: {
      primary: {
        main: "#fc8c8a",
      },
      secondary: {
        main: "#fee6c2",
      },
      background: {
        default: "#fc8c8a",
      },
    },
  },
  Depression: {
    palette: {
      primary: {
        main: "#8B3BA3",
      },
      secondary: {
        main: "#000247",
      },
      type: "dark",
    },
  },
  "Melon d'eau": {
    palette: {
      primary: {
        main: "#EBE087",
      },
      secondary: {
        main: "#9DEBC8",
      },
      background: {
        default: "#EB8A7A",
      },
    },
  },
  "Autumn Fire": {
    palette: {
      primary: {
        main: "#DC143C",
      },
      secondary: {
        main: "#D9B100",
      },
      background: {
        default: "#5C0819",
      },
      type: "dark",
    },
  },
  Fireman: {
    palette: {
      primary: {
        main: "#358CDB",
      },
      secondary: {
        main: "#DB524B",
      },
      background: {
        default: "#295F8F",
      },
    },
  },
  Irishman: {
    palette: {
      primary: {
        main: "#17E88A",
      },
      secondary: {
        main: "#11A864",
      },
      background: {
        default: "#0A693E",
      },
      type: "dark",
    },
  },
  "Dark Blood": {
    palette: {
      primary: {
        main: "#303030",
      },
      secondary: {
        main: "#750C16",
      },
      background: {
        default: "#000",
      },
      type: "dark",
    },
  },
};

export default function Settings(props) {
  const classes = useStyles();
  const setTheme = props.theme;
  const [themeIndex, setIndex] = React.useState(
    localStorage.getItem("themeIndex") || 3
  );
  const { user } = props;

  const handleChange = (event) => {
    localStorage.setItem("theme", JSON.stringify(themes[event.target.value]));
    const index = Object.keys(themes).indexOf(event.target.value);
    setIndex(index);
    localStorage.setItem("themeIndex", index);
    setTheme(createMuiTheme(themes[event.target.value]));
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
      {user.admin && (
        <div className={clsx(classes.formControl, classes.center)}>
          <DatabaseTree />
        </div>
      )}
    </div>
  );
}
