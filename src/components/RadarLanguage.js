import React from "react";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import { getLanguageProgress } from "../model/utils";

const languages = [
  "elvish",
  "klingon",
  "french",
  "russian",
  "spanish",
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
}));

const radius = 125;

export default function RadarLanguage(props) {
  const theme = useTheme();
  const classes = useStyles();

  const { user } = props;
  const sourceLang = "english";

  const buildData = () => {
    return languages.map(language => getLanguageProgress(user, sourceLang, language));
  };
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
          dataKey="language"
          stroke={theme.palette.secondary.main}
        />
        <PolarRadiusAxis domain={[0, 100]} />
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
        Languages Progression
      </Typography>
    </div>
  );
}
