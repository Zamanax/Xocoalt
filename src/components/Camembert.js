import React from 'react';
import {PieChart, Pie, Cell} from 'recharts';

export default function Camembert () {
  const data = [{name: 'Completed', value: 23}, {name: 'Uncompleted', value: 77}];
  const COLORS = ['#00C49F','#FCBD86'];

    return (
      <PieChart width={800} height={400}>
        <Pie
          data={data} 
          cx={120} 
          cy={200}
          labelLine={false}
          label={"comp"}
          innerRadius={60}
          outerRadius={80} 
          fill="#8884d8"
          paddingAngle={5}
        >
          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)
          }
          <p className="notes">That's some insane progress!</p>
        </Pie>
      </PieChart>
      
    );
}