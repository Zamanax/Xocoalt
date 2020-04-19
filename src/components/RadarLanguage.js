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

const data = [
  {
    subject: "ELVISH",
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: "KLINGON",
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "ENGLISH",
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: "FRENCH",
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: "RUSSIAN",
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: "SPANISH",
    A: 65,
    B: 85,
    fullMark: 150,
  },
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
  
  return (
    <div className={classes.container}>
      <RadarChart
        outerRadius={
          useMediaQuery(theme.breakpoints.up("sm")) ? radius : radius / 2
        }
        width={radius * 3}
        height={radius * (useMediaQuery(theme.breakpoints.up("sm")) ? 3 : 1.5)}
        data={data}
      >
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          stroke={theme.palette.secondary.main}
        />
        <PolarRadiusAxis domain={[0, 150]} />
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
      <Typography variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"} color="secondary">
        Languages Progression
      </Typography>
    </div>
  );
}
