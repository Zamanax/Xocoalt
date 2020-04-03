import React from "react";
import { useTheme } from "@material-ui/core";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis
} from "recharts";

const data = [
  {
    subject: "ELVISH",
    A: 120,
    B: 110,
    fullMark: 150
  },
  {
    subject: "KLINGON",
    A: 98,
    B: 130,
    fullMark: 150
  },
  {
    subject: "ENGLISH",
    A: 86,
    B: 130,
    fullMark: 150
  },
  {
    subject: "FRENCH",
    A: 99,
    B: 100,
    fullMark: 150
  },
  {
    subject: "RUSSIAN",
    A: 85,
    B: 90,
    fullMark: 150
  },
  {
    subject: "SPANISH",
    A: 65,
    B: 85,
    fullMark: 150
  }
];

const radius = 150;

export default function RadarLanguage() {
  const theme = useTheme();
  return (
    <RadarChart
      outerRadius={radius}
      width={radius * 3}
      height={radius * 3}
      data={data}
    >
      <PolarGrid />
      <PolarAngleAxis dataKey="subject" stroke={theme.palette.secondary.main} />
      <PolarRadiusAxis domain={[0, 150]} />
      <Radar
        name="Mike"
        dataKey="A"
        stroke={theme.palette.secondary.main}
        fill={theme.palette.secondary.main}
        fillOpacity={0.6}
      />
    </RadarChart>
  );
}
