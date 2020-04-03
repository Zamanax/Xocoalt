import React from "react";
import { makeStyles } from "@material-ui/core";

import RadarLanguage from "./RadarLanguage";
import Camembert from "./Camembert";
import ThetaProgression from "./ThetaProgression";
import RadarSubjects from "./RadarSubjects"

const useStyles = makeStyles(theme => ({
  container : {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    scrollbarWidth: "none",
  }
}));

export default function DashBoard(props) {
  const classes = useStyles();

  return(
    <div className={classes.container}>
      <RadarLanguage/>
      <Camembert/>
      <ThetaProgression/>
      <RadarSubjects/>
    </div>
  )
}