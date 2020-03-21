import React from "react";
import { useParams, useHistory } from "react-router-dom";
import {
  Typography,
  CircularProgress,
  makeStyles,
  withStyles,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Radio,
  Button
} from "@material-ui/core";
import { useQuery, getChapter, choice } from "../model/utils";
import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/firestore";

const useStyles = makeStyles(theme => ({
  frame: {
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  exercise: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  chap: {
    marginTop: -15,
    marginBottom: 15
  },
  wording: {
    margin: 40
  }
}));

const languages = {
  en: "english",
  fr: "french"
};

const WhiteRadio = withStyles({
  root: {
    color: "#FFF"
  },
})(props => <Radio color="default" {...props} />);

export default function Exercise(props) {
  const classes = useStyles();
  const history = useHistory();

  const db = firebase.firestore();

  // const { user } = props;
  const { lang, subject, chapter } = useParams();
  const id = useQuery().get("id");

  const [exercise, setExercise] = React.useState(<CircularProgress />);
  const [fetching, setFecthing] = React.useState(true);

  const sourceLang = languages[lang.slice(0, 2)];
  const destLang = languages[lang.slice(2)];

  const generateExercise = () => {
    setFecthing(false);
    db.collection("sources")
      .doc(sourceLang)
      .collection("exercises")
      .doc(destLang)
      .get()
      .then(snap => {
        const fetchedData = getChapter(snap.data()[subject], chapter);
        const currentWord = Object.keys(fetchedData.words)[id];
        // Add IRT for next time
        let sentence = choice(fetchedData.sentences[currentWord]);

        const goodIndex = Math.floor(Math.random() * 4);
        const possibleAnswers = [];

        for (let index = 0; index < 4; index++) {
          if (index === goodIndex) {
            possibleAnswers.push(fetchedData.words[currentWord]);
          } else {
            let word = choice(Object.keys(fetchedData.words));
            do {
              word = choice(Object.keys(fetchedData.words));
            } while (
              possibleAnswers.includes(fetchedData.words[word]) ||
              word === currentWord
            );
            possibleAnswers.push(fetchedData.words[word]);
          }
        }

        setExercise(
          <Fade bottom cascade>
            <div className={classes.exercise}>
              <Typography
                color="secondary"
                variant="h2"
                className={classes.chap}
              >
                {fetchedData.title}
              </Typography>
              <Typography
                color="secondary"
                variant="h3"
                className={classes.wording}
              >
                {sentence}
              </Typography>
                <FormControl style={{ marginBottom: 40 }}>
                  <RadioGroup>
                    {possibleAnswers.map((word, i) => (
                      <FormControlLabel
                        value={word}
                        control={<WhiteRadio />}
                        label={<span style={{ fontSize: 25 }}>{word}</span>}
                        style={{ color: "#FFF" }}
                        key={i}
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              <Button color="secondary" size="large" variant="contained">
                Validate
              </Button>
            </div>
          </Fade>
        );
      });
  };
  if (fetching) {
    generateExercise();
  }
  return <div className={classes.frame}>{exercise}</div>;
}
