import React from "react";
import {
  Typography,
  makeStyles,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const data = [
  { name: "January", progress: 0, amt: 2400 },
  { name: "February", progress: 0, amt: 2210 },
  { name: "March", progress: 0, amt: 2290 },
  { name: "April", progress: 23, amt: 2000 },
  { name: "May", progress: 34, amt: 2181 },
  { name: "June", progress: 56, amt: 2500 },
  { name: "July", progress: 60, amt: 2100 },
  { name: "August", progress: 68, amt: 2100 },
  { name: "September", progress: 74, amt: 2100 },
  { name: "October", progress: 88, amt: 2100 },
  { name: "November", progress: 95, amt: 2100 },
  { name: "December", uprogress: 100, amt: 2100 },
];

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default function ThetaProgression() {
  const theme = useTheme();
  const classes = useStyles();
  const [state, setState] = React.useState({
    opacity: {
      progress: 1,
    },
  });

  const legendColor = (value, entry) => {
    const { color } = entry;
    return <span style={{ color }}>{value}</span>;
  };

  const handleMouseEnter = (o) => {
    const { dataKey } = o;
    const { opacity } = state;

    setState({
      opacity: { ...opacity, [dataKey]: 0.5 },
    });
  };

  const handleMouseLeave = (o) => {
    const { dataKey } = o;
    const { opacity } = state;

    setState({
      opacity: { ...opacity, [dataKey]: 1 },
    });
  };

  const { opacity } = state;

  return (
    <div className={classes.container}>
      <LineChart
        width={useMediaQuery(theme.breakpoints.up("sm")) ? 750 : 300}
        height={300}
        data={data}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke={theme.palette.secondary.main} />
        <YAxis stroke={theme.palette.secondary.main} />
        <Tooltip />
        <Legend
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          formatter={legendColor}
        />

        <Line
          type="monotone"
          dataKey="progress"
          strokeOpacity={opacity.progress}
          stroke={theme.palette.primary.main}
        />
      </LineChart>
      <Typography variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"} color="secondary">
        Level Progression
      </Typography>
    </div>
  );
}
