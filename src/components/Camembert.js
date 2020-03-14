import React from 'react';
import {PieChart, Pie, Cell} from 'recharts';
import { makeStyles } from "@material-ui/core";

const data = [{name: 'Completed', value: 23}, {name: 'Uncompleted', value: 77}];
const COLORS = ['#00C49F','#FCBD86'];


const useStyles = makeStyles(theme => ({
  title : {
    color: "white",
  },
  container : {
    display : "flex",
    alignItems: "center",
    flexDirection: "column",
  }
}));

export default function Camembert () {
  const classes = useStyles();

  return (      
      <div className={classes.container}>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          label
        >      

          {
            data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]} key={index}/>)
          }
        </Pie>
      </PieChart>
      <p className={classes.title}>Completion</p>
      </div>        
    );
}     