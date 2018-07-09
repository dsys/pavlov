import React from 'react';
import colors from '../colors';
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Line
} from 'recharts';

export default function LineChart({ name, dataKeys, data }) {
  return (
    <div className="line-chart">
      <ResponsiveContainer>
        <RechartsLineChart data={data}>
          <XAxis stroke={colors.gray1} />
          <YAxis stroke={colors.gray1} />
          <Tooltip wrapperStyle={{ borderRadius: 4 }} />
          <CartesianGrid stroke={colors.gray3} strokeDasharray="5 5" />
          <Legend />
          <Line type="monotone" dataKey={dataKeys[0]} stroke={colors.purple3} />
        </RechartsLineChart>
      </ResponsiveContainer>
      <style jsx>{`
        .line-chart {
          width: 100%;
          height: 180px;
          max-height: 25vh;
        }
      `}</style>
    </div>
  );
}
