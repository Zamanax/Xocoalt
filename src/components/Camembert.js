import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";

const data = [
  { name: "Completed", value: 23 },
  { name: "Uncompleted", value: 77 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default function Camembert() {
  const classes = useStyles();
  const theme = useTheme();
  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];
  const radius = useMediaQuery(theme.breakpoints.up("sm")) ? 80 : 60;

  return (
    <div className={classes.container}>
      <PieChart
        width={useMediaQuery(theme.breakpoints.up("sm")) ? 300 : 160}
        height={useMediaQuery(theme.breakpoints.up("sm")) ? 200 : 125}
      >
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={(radius * 4) / 5}
          outerRadius={radius}
          paddingAngle={4}
          label
        >
          {data.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} key={index} />
          ))}
        </Pie>
      </PieChart>
      <Typography variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"} color="secondary">
        Completion
      </Typography>
    </div>
  );
}
