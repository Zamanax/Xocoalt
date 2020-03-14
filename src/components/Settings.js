import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
    center: {
      justifyContent: "center",
      textAlign: "center",
      height: "100%",
    },
  }));

export default function Settings() {
    const classes = useStyles();

    return (
    <div className={classes.center}>
        <Typography variant="h2" color="secondary" >Settings</Typography>
    </div>
    )
}