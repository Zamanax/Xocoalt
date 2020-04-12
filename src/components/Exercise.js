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
  Button,
  useTheme
} from "@material-ui/core";
import {
  useQuery,
  getChapter,
  choice,
  capitalizeFirstLetter
} from "../model/utils";
import { Fade } from "react-reveal";

import * as firebase from "firebase/app";
import "firebase/firestore";

import { languages } from "../model/utils";

const useStyles = makeStyles(theme => ({
  frame: {
    display: "flex",
    flexDirection: "column",
  },
  exercise: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center"
  },
  chap: {
    margin: "2% 7.5% 1% 7.5%",
  },
  wording: {
    margin: 40
  }
}));

export default function Exercise(props) {
  const classes = useStyles();
  const history = useHistory();

  const db = firebase.firestore();

  // const { user } = props;
  const { lang, subject, chapter } = useParams();
  const id = parseInt(useQuery().get("id"), 10);

  const theme = useTheme();
  const SecondaryRadio = withStyles({
    root: {
      color: theme.palette.secondary.main
    }
  })(props => <Radio {...props} />);

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
    history.push(window.location.pathname.split("?")[0] + "?id=" + (id + 1));
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
        console.log(fetchedData);
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
            while (
              possibleAnswers.includes(fetchedData.words[word]) ||
              word === currentWord
            ) {
              word = choice(Object.keys(fetchedData.words));
            }
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
          <Typography color="secondary" variant="h2" className={classes.chap}>
              {exercise.title}
            </Typography>
          <div className={classes.exercise}>
            <Fade bottom>
              <Fade spy={answer}>
                <Typography
                  color="secondary"
                  variant="h3"
                  className={classes.wording}
                >
                  {capitalizeFirstLetter(exercise.sentence)
                    .split(/_____/gi)
                    .map(
                      (text, i) =>
                        (text =
                          i !==
                          exercise.sentence.split(/_____/gi).length - 1 ? (
                            <span key={i}>
                              {text + " "}
                              <span
                                style={{
                                  fontStyle: "oblique 40deg",
                                  fontWeight: "bold",
                                  textDecoration: "underline"
                                }}
                              >
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
                    label={
                      <span
                        style={{
                          fontSize: 35,
                          color: theme.palette.secondary.main
                        }}
                      >
                        {word}
                      </span>
                    }
                    key={i}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <Button
              color="secondary"
              size="large"
              variant="contained"
              onClick={handleValidate}
            >
              Confirm
            </Button>
          </div>
        </Fade>
      ) : (
        <CircularProgress color="secondary" />
      )}
    </div>
  );
}
