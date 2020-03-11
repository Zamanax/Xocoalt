import React from 'react';
import {PieChart, Pie, Cell, ResponsiveContainer} from 'recharts';

export default function Camembert () {
  const data = [{name: 'Completed', value: 23}, {name: 'Uncompleted', value: 77}];
  const COLORS = ['#00C49F','#FCBD86'];

  return (
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={data}
          labelLine={false}
          label={"comp"}
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
        >
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
          }
        </Pie>
      </PieChart>
      </ResponsiveContainer>
    );
}