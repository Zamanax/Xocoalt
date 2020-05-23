import React from "react";
import { Paper, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  card: {
    padding: 10,
    margin: 10,
  },
  source: {
    fontWeight: "bold",
    textTransform: "capitalize",
  },
}));

export default function DefinitionCard({ source, target }) {
  const classes = useStyles();
  return (
    <Paper elevation={3} className={classes.card}>
      <Typography className={classes.source}>
        {source} → {target}
      </Typography>
    </Paper>
  );
}
