import React from "react";

import {Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis} from "recharts";

const data = [
    {
      subject: 'ELVISH', A: 120, B: 110, fullMark: 150,
    },
    {
      subject: 'KLINGON', A: 98, B: 130, fullMark: 150,
    },
    {
      subject: 'ENGLISH', A: 86, B: 130, fullMark: 150,
    },
    {
      subject: 'FRENCH', A: 99, B: 100, fullMark: 150,
    },
    {
      subject: 'RUSSIAN', A: 85, B: 90, fullMark: 150,
    },
    {
      subject: 'SPANISH', A: 65, B: 85, fullMark: 150,
    },
  ];

export default class DashBoard extends React.Component {

    render() {
        return (
        <RadarChart cx={300} cy={225} outerRadius={150} width={600} height={600} data={data} >
            <PolarGrid />
            <PolarAngleAxis dataKey="subject" />
            <PolarRadiusAxis angle={90} domain={[0, 120]} />
            <Radar name="Mike" dataKey="A" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
        </RadarChart>
    );
  }
}