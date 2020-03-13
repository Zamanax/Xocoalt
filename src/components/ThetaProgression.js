import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
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
  { name: "December", uprogress: 100, amt: 2100 }
];
export default function ThetaProgression() {
  const [state, setState] = React.useState({
    opacity: {
        progress: 1
      }
  });

  const legendColor = (value,entry) => {
      const {color} = entry;
      return <span style={{color}}>{value}</span>
  };

  const handleMouseEnter = o => {
    const { dataKey } = o;
    const { opacity } = state;

    setState({
      opacity: { ...opacity, [dataKey]: 0.5 }
    });
  };

  const handleMouseLeave = o => {
    const { dataKey } = o;
    const { opacity } = state;

    setState({
      opacity: { ...opacity, [dataKey]: 1 }
    });
  };

  const { opacity } = state;

  return (
    <ResponsiveContainer width="50%" height="30%">
      <LineChart
        width={1000}
        height={300}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" stroke="#FFF"/>
        <YAxis stroke="#FFF"/>
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
          stroke="#82ca9d"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
