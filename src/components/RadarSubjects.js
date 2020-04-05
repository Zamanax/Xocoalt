import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";
import { makeStyles, useTheme, Typography } from "@material-ui/core";

const data = [
  { subject: "Grammar", A: 130, fullMark: 150 },
  { subject: "Conjugation", A: 70, fullMark: 150 },
  { subject: "Vocabulary", A: 86, fullMark: 150 },
  { subject: "Expression", A: 99, fullMark: 150 }
];

const useStyles = makeStyles(theme => ({
  title: {
    color: "white"
  },
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  }
}));

export default function RadarSubject() {
  const classes = useStyles();
  const theme = useTheme();
  return (
    <div className={classes.container}>
      <RadarChart outerRadius={150} width={500} height={350} data={data}>
        <PolarGrid />
        <PolarAngleAxis
          dataKey="subject"
          stroke={theme.palette.secondary.main}
        />
        <PolarRadiusAxis />
        <Radar
          name="Mike"
          dataKey="A"
          stroke="#fcbd86"
          fill="#fcbd86"
          fillOpacity={0.6}
        />
      </RadarChart>
      <Typography variant="h4" color="secondary">Subjects</Typography>
    </div>
  );
}
