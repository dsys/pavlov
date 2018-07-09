import React from 'react';
import colors from '../colors';
import moment from 'moment';
import Spinner from './Spinner';
import {
  ResponsiveContainer,
  BarChart,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  CartesianGrid,
  Bar
} from 'recharts';

export default function WorkflowHistogram({ loading, workflow }) {
  if (loading) {
    return <Spinner />;
  }

  const dataWithFormattedTime = workflow.histogramData.map(
    ({ time, ...o }) => ({
      ...o,
      time: moment(time).format('MMM DD')
    })
  );

  return (
    <div className="workflow-histogram">
      <ResponsiveContainer>
        <BarChart
          data={dataWithFormattedTime}
          margin={{ top: 0, left: 0, right: 0, bottom: 0 }}
        >
          <XAxis dataKey="time" stroke={colors.gray1} />
          <YAxis width={50} stroke={colors.gray1} />
          <Tooltip wrapperStyle={{ borderRadius: 4 }} />
          <Legend />
          <CartesianGrid stroke={colors.gray3} strokeDasharray="5 5" />
          {workflow.possibleLabels.map((dataKey, i) => {
            const { bg } = colors.forLabel(dataKey);
            return (
              <Bar
                key={i}
                type="monotone"
                dataKey={dataKey}
                stackId="1"
                connectNulls={false}
                isAnimationActive={false}
                stroke={bg}
                fill={bg}
                baseLine={0}
              />
            );
          })}
        </BarChart>
      </ResponsiveContainer>
      <style jsx>{`
        .workflow-histogram {
          width: 99%;
          height: 240px;
        }
      `}</style>
    </div>
  );
}
