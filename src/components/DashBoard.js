import React from "react";
import { makeStyles } from "@material-ui/core";

import Progression from "./Progression";

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
      <Progression/>
    </div>
  )
};