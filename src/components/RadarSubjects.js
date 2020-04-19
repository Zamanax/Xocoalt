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

const data = [
  { subject: "Grammar", A: 130, fullMark: 150 },
  { subject: "Conjugation", A: 70, fullMark: 150 },
  { subject: "Vocabulary", A: 86, fullMark: 150 },
  { subject: "Expression", A: 99, fullMark: 150 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
  },
}));
const radius = 125;
export default function RadarSubject() {
  const classes = useStyles();
  const theme = useTheme();
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
        <PolarRadiusAxis />
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
        Progression of each subject
      </Typography>
    </div>
  );
}
