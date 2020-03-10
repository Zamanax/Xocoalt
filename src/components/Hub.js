import React from "react";
import { Fade } from "react-reveal";
import { makeStyles, CircularProgress, Typography } from "@material-ui/core";

import { capitalizeFirstLetter, createSubjects } from "../model/utils";

const useStyles = makeStyles(theme => ({
    cardContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center"
    },
}));

export default function Hub(props) {
  const { values, cards, setCards } = props;
  const classes = useStyles();

  if (cards.list.length === 0 && !cards.fetching) {
    createSubjects(values.user, cards, setCards)
  }

  return (
    (cards.fetching ? <CircularProgress color="secondary"/> :<Fade bottom>
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
      <div className={classes.cardContainer}>
        {cards.fetching ? <CircularProgress /> : cards.list}
      </div>
    </Fade>)
  );
}
