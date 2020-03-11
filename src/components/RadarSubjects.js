import React from 'react';
import {Radar, RadarChart, PolarGrid,
    PolarAngleAxis, PolarRadiusAxis} from 'recharts';

const data = [
{ subject: 'Grammar', A: 130, fullMark: 150 },
{ subject: 'Conjugation', A: 70, fullMark: 150 },
{ subject: 'Vocabulary', A: 86, fullMark: 150 },
{ subject: 'Expression', A: 99, fullMark: 150 },
];

export default function RadarSubject() {
    return (
    <RadarChart outerRadius={150} width={500} height={500} data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="subject" stroke="#FFF"/>
        <PolarRadiusAxis/>
        <Radar name="Mike" dataKey="A" stroke="#fcbd86" fill="#fcbd86" fillOpacity={0.6}/>
    </RadarChart>
    );
}