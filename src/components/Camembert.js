import React from "react";
import { PieChart, Pie, Cell } from "recharts";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { getLanguageProgress } from "../model/utils";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default function Camembert(props) {
  const classes = useStyles();
  const theme = useTheme();
  const COLORS = [theme.palette.primary.main, theme.palette.secondary.main];
  const radius = useMediaQuery(theme.breakpoints.up("sm")) ? 80 : 60;

  const { user } = props;

  const buildData = () => {
    const completed = getLanguageProgress(user, "english", "french");
    return [
      { name: "Completed", value: completed.A },
      { name: "Uncompleted", value: 100 - completed.A },
    ];
  };

  return (
    <div className={classes.container}>
      <PieChart
        width={useMediaQuery(theme.breakpoints.up("sm")) ? 300 : 160}
        height={useMediaQuery(theme.breakpoints.up("sm")) ? 200 : 125}
      >
        <Pie
          data={buildData()}
          dataKey="value"
          nameKey="name"
          innerRadius={(radius * 4) / 5}
          outerRadius={radius}
          paddingAngle={4}
          label
        >
          {buildData().map((entry, index) => (
            <Cell fill={COLORS[index % COLORS.length]} key={index} />
          ))}
        </Pie>
      </PieChart>
      <Typography
        variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"}
        color="secondary"
      >
        Completion
      </Typography>
    </div>
  );
}
