import React from "react";

import { useLocation, useHistory } from "react-router-dom";
import {
  Typography,
  makeStyles,
  useMediaQuery,
  useTheme,
  Button,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import {
  languages,
  capitalizeFirstLetter,
  linearGradient,
} from "../model/utils";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 110,
    margin: "2% 7.5% 1% 7.5%",
  },
  title: {
    wordBreak: "break-word",
    background: linearGradient(theme),
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
    animation: "$title 5s infinite ease-in-out",
  },
  "@keyframes title": {
    from: { transform: "translate(0,  0px)" },
    "50%": { transform: "translate(0, 3px)" },
    to: { transform: "translate(0, -0px)" },
  },
  button: {
    height: 40,
  },
}));

export default function Header(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { user } = props;
  const location = useLocation();
  const history = useHistory();

  let title = "";

  if (location.pathname === "/") {
    title = "";
  } else if (location.pathname.slice(1).split("/").length !== 1) {
    let lang = location.pathname.slice(1).split("/")[0];
    title =
      capitalizeFirstLetter(languages[lang.slice(0, 2)]) +
      "→" +
      capitalizeFirstLetter(languages[lang.slice(2)]);
  } else {
    title = location.pathname.slice(1).split("/")[0];
  }

  const size = useMediaQuery(theme.breakpoints.up("sm")) ? "h2" : "h3";

  return (
    <div className={classes.header}>
      {title !== "" && (
        <Typography variant={size} color="secondary" className={classes.title}>
          {title}
        </Typography>
      )}
      {user && (
        <Button
          color="secondary"
          startIcon={<AccountCircleIcon />}
          variant="contained"
          className={classes.button}
          onClick={() => {
            history.push("/Account");
          }}
        >
          <Typography>{user.name}</Typography>
        </Button>
      )}
    </div>
  );
}
