import React from "react";
import { makeStyles, Typography } from "@material-ui/core";

import { capitalizeFirstLetter } from "../model/utils";

const useStyles = makeStyles(theme => ({
  hub: {
    width: "100%",
    height: "100%"
  },
  header: {
    height: 110
  },
  cardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "calc(80% - 110px)"
  }
}));

export default function Hub(props) {
  const { values, cards } = props;
  const classes = useStyles();

  return (
    <div className={classes.hub}>
      <div className={classes.header}>
        <Typography variant="h3" color="secondary">
          Welcome {values.user.name} !
        </Typography>
        <Typography variant="h3" color="secondary">
          {capitalizeFirstLetter(
            values.user.languages !== undefined
              ? Object.keys(values.user.languages)[0]
              : "french"
          )}
        </Typography>
      </div>
      <div className={classes.cardContainer}>
        {cards.list}
      </div>
    </div>
  );
}
