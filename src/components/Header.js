import React from "react";

import { useLocation, useHistory } from "react-router-dom";
import { Typography, makeStyles, Button } from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";

import { languages, capitalizeFirstLetter } from "../model/utils";

const useStyles = makeStyles((theme) => ({
  header: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    height: 110,
    margin: "2% 7.5% 1% 7.5%",
  },
  title: {
    background: "-webkit-linear-gradient(" + theme.palette.secondary.main + ", " + theme.palette.primary.main + ")",
    "-webkit-background-clip": "text",
    "-webkit-text-fill-color": "transparent",
  },
  button: {
    height: "50%",
  },
}));

export default function Header(props) {
  const classes = useStyles();

    const { user } = props;
    const location = useLocation();
  const history = useHistory();
  
  let title = ""

  if (location.pathname === "/") {
    title = "XOCOALT"
  } else if (location.pathname.slice(1).split("/").length !== 1) {
    let lang = location.pathname.slice(1).split("/")[0]
    title = capitalizeFirstLetter(languages[lang.slice(0,2)]) + "→" + capitalizeFirstLetter(languages[lang.slice(2)])
  } else {
    title = location.pathname.slice(1).split("/")[0]
  }

  return (
    <div className={classes.header}>
      <Typography variant="h2" color="secondary" className={classes.title}>
        {title}
      </Typography>
      {user && (
        <Button
          color="secondary"
          startIcon={<AccountCircleIcon />}
          variant="contained"
          className={classes.button}
                  onClick={() => {
              history.push("/Account")
          }}
        >
          <Typography>{user.name}</Typography>
        </Button>
      )}
    </div>
  );
}
