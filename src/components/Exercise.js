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

const SecondaryRadio = withStyles({
  root: {
    color: "#D9CB9E"
  }
})(props => <Radio {...props} />);

export default function Exercise(props) {
  const classes = useStyles();
  const history = useHistory();

  const db = firebase.firestore();

  // const { user } = props;
  const { lang, subject, chapter } = useParams();
  const id = parseInt(useQuery().get("id"),10);

  const [exercise, setExercise] = React.useState({
    done: false,
    title: "",
    sentence: "",
    possibleAnswers: []
  });
  const [fetching, setFecthing] = React.useState(true);
  const [answer, setAnswer] = React.useState("_____");

  const sourceLang = languages[lang.slice(0, 2)];
  const destLang = languages[lang.slice(2)];

  const handleChange = event => {
    setAnswer(event.target.value);
  };

  const handleValidate = () => {
    setFecthing(true);
    history.push(window.location.pathname.split("?")[0] + "?id=" + (id+1))
  };

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

        setExercise({
          done: true,
          title: fetchedData.title,
          sentence: sentence,
          possibleAnswers: possibleAnswers
        });
      });
  };
  if (fetching) {
    generateExercise();
  }
  return (
    <div className={classes.frame}>
      {exercise.done ? (
        <Fade bottom cascade>
          <div className={classes.exercise}>
            <Typography color="secondary" variant="h2" className={classes.chap}>
              {exercise.title}
            </Typography>
            <Fade bottom>
              <Fade spy={answer}>
                <Typography
                  color="secondary"
                  variant="h3"
                  className={classes.wording}
                >
                  {exercise.sentence.split(/_____/gi).map(
                    (text, i) =>
                      (text =
                        i !== exercise.sentence.split(/_____/gi).length - 1 ? (
                          <span key={i}>
                            {text + " "}
                            <span style={{ fontStyle: "oblique 40deg", fontWeight: "bold", textDecoration: "underline" }}>
                              {answer}
                            </span>
                          </span>
                        ) : (
                          <span key={i}>{text}</span>
                        ))
                  )}
                </Typography>
              </Fade>
            </Fade>
            <FormControl style={{ marginBottom: 40 }}>
              <RadioGroup value={answer} onChange={handleChange}>
                {exercise.possibleAnswers.map((word, i) => (
                  <FormControlLabel
                    value={word}
                    control={<SecondaryRadio />}
                    label={<span style={{ fontSize: 35, color: "#D9CB9E" }}>{word}</span>}
                    style={{ color: "#FFF" }}
                    key={i}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button color="secondary" size="large" variant="contained" onClick={handleValidate}>
              Validate
            </Button>
          </div>
        </Fade>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
}
