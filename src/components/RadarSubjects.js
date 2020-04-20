import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { capitalizeFirstLetter } from "../model/utils";

const subjects = ["grammar", "conjugation", "vocabulary", "expression"];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));
const radius = 125;
export default function RadarSubject(props) {
  const classes = useStyles();
  const theme = useTheme();

  const { user } = props;
  const sourceLang = "english";
  const language = "french";

  const buildData = () => {
    return subjects.map((subject) => {
      let progress = 20
      if (user.progress[sourceLang][language].hasOwnProperty(subject)) {
        const element = user.progress[sourceLang][language][subject];
        progress = element.theta[element.theta.length - 1] * 100 / 3;
      } 
      return {subject: capitalizeFirstLetter(subject), A: progress, fullMark: 100}
    })
  }

  return (
    <div className={classes.container}>
      <RadarChart
        outerRadius={
          useMediaQuery(theme.breakpoints.up("sm")) ? radius : radius / 2
        }
        width={radius * 3}
        height={radius * (useMediaQuery(theme.breakpoints.up("sm")) ? 3 : 1.5)}
        data={buildData()}
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          stroke={theme.palette.secondary.main}
        />
        <PolarRadiusAxis domain={[0, 100]}/>
        <defs>
          <radialGradient id="radarchartColorToRed">
            <stop offset="5%" stopColor={theme.palette.primary.main} />
            <stop offset="95%" stopColor={theme.palette.secondary.main} />
          </radialGradient>
        </defs>
        <Radar
          name="Mike"
          dataKey="A"
          fill="url(#radarchartColorToRed)"
          fillOpacity={0.6}
        />
      </RadarChart>
      <Typography
        variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"}
        color="secondary"
      >
        Progression of each subject
      </Typography>
    </div>
  );
}
