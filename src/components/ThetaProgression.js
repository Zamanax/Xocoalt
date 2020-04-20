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

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
  },
}));

export default function ThetaProgression(props) {
  const theme = useTheme();
  const classes = useStyles();
  const [state, setState] = React.useState({
    opacity: {
      progress: 1,
    },
  });

  const { user } = props;
  const sourceLang = "english";
  const language = "french";

  const buildData = () => {
    return [
      { progress: 0 },
      ...user.progress[sourceLang][language].vocabulary.theta.map((theta) => ({
        progress: theta,
      })),
    ];
  };

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
        data={buildData()}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis stroke={theme.palette.secondary.main} />
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
      <Typography
        variant={useMediaQuery(theme.breakpoints.up("sm")) ? "h4" : "h5"}
        color="secondary"
      >
        Level Progression
      </Typography>
    </div>
  );
}
