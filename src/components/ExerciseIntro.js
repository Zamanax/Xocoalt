import React from "react";

import { Button, makeStyles } from "@material-ui/core";
import DefinitionCard from "./DefinitonCard";

const useStyles = makeStyles((theme) => ({
    defCardContainer: {},
  }));

export default function ExerciseIntro({ chapterWords, setIntro }) {
    const classes = useStyles();
  return (
    <div>
      <div className={classes.defCardContainer}>
        {Object.keys(chapterWords).map((source, i) => (
          <DefinitionCard source={source} target={chapterWords[source]} key={i} />
        ))}
      </div>
      <Button
        color="secondary"
        size="large"
        variant="contained"
        onClick={() => {
          setIntro(false);
        }}
        style={{ margin: 20 }}
      >
        Start
      </Button>
    </div>
  );
}
