import React from "react";
import { Typography, makeStyles } from "@material-ui/core";

import { capitalizeFirstLetter } from "../model/utils"

const useStyles = makeStyles(() => ({
  rectangle: {
    padding: 2,
    borderRadius: 10,
    color: "#000",
    background: "#FFF",
    margin: 15
  }
}));

export default function LessonCard(props) {
  const classes = useStyles();

  return (
    <div className={classes.rectangle}>
      <div>
        <h3>Common Words</h3>
      </div>
      <div>
        <Typography variant="h5">{capitalizeFirstLetter(props.type)}</Typography>
        <Typography variant="h6">
          {props.user.languages[Object.keys(props.user.languages)[0]][
            props.type
          ] !== undefined
            ? props.user.languages[Object.keys(props.user.languages)[0]][
                props.type
              ].progression
            : 0}
        </Typography>
      </div>
    </div>
  );
}
