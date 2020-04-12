import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import { makeStyles, Typography, useTheme } from "@material-ui/core";

const data = [
  { name: "Completed", value: 23 },
  { name: "Uncompleted", value: 77 }
];

const useStyles = makeStyles(theme => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column"
  }
}));

export default function Camembert() {
  const classes = useStyles();
  const theme = useTheme();
  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];

  return (
    <div className={classes.container}>
      <PieChart width={300} height={200}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          label
        >
          {data.map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} key={index} />
          ))}
        </Pie>
      </PieChart>
      <Typography variant="h4" color="secondary">Completion</Typography>
    </div>
  );
}
