import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

import RadarLanguage from "./RadarLanguage";
import Camembert from "./Camembert";
import ThetaProgression from "./ThetaProgression";
import RadarSubjects from "./RadarSubjects";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    scrollbarWidth: "none",
  },
}));

export default function DashBoard(props) {
  const classes = useStyles();
  const { user } = props;

  return (
    <div>
      {user.progress !== undefined ? (
        <div className={classes.container}>
          <RadarLanguage user={user}/>
          <Camembert />
          <RadarSubjects />
          <ThetaProgression />
        </div>
      ) : (
        <Typography variant="h3">
          You haven't done any Exercise yet. Please, come back after.
        </Typography>
      )}
    </div>
  );
}
