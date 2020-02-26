import React from "react";
import { Typography, makeStyles } from "@material-ui/core";
import CheckIcon from "@material-ui/icons/Check";

import Camembert from "./Camembert";
import Progression from "./Progression"

const useStyles = makeStyles(theme => ({
  container : {
    display: "flex",
    flexDirection: "row",
  }
}));

export default function DashBoard(props) {
  const classes = useStyles();

  return(
    <div className={classes.container}>
      <Camembert/>
    </div>
  )
};