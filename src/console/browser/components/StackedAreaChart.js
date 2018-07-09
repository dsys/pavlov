import React from 'react';
import colors from '../colors';
import {
  ResponsiveContainer,
  AreaChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Area
} from 'recharts';

const STACK_COLORS = [colors.purple1, colors.purple2, colors.purple3];

function colorForI(i) {
  return STACK_COLORS[i % STACK_COLORS.length];
}

export default function StackedAreaChart({ dataKeys, data }) {
  return (
    <div className="stacked-area-chart">
      <ResponsiveContainer>
        <AreaChart data={data}>
          <XAxis dataKey="x" stroke={colors.gray1} />
          <YAxis stroke={colors.gray1} />
          <Tooltip wrapperStyle={{ borderRadius: 4 }} />
          <Legend />
          <CartesianGrid stroke={colors.gray3} strokeDasharray="5 5" />
          {dataKeys.map((dataKey, i) => {
            const c = colorForI(i);
            return (
              <Area
                key={i}
                type="monotone"
                dataKey={dataKey}
                stackId="1"
                stroke={c}
                fill={c}
              />
            );
          })}
        </AreaChart>
      </ResponsiveContainer>
      <style jsx>{`
        .stacked-area-chart {
          width: 100%;
          height: 180px;
          max-width: 99%;
          max-height: 25vh;
        }
      `}</style>
    </div>
  );
}
