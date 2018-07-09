// based on github.com/segmentio/elements

import React from 'react';
import colors from '../colors';
import moment from 'moment';

export default class ActivityHeatmap extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.setState({
        visible: true
      });
    }, 200);
  }

  render() {
    return (
      <div className="heatmap-wrapper">
        <div className="heatmap">{this.renderYear(getRollingYear())}</div>
        <style jsx>{`
          .heatmap-wrapper {
            overflow: hidden;
            padding: 2px;
          }

          .heatmap {
            min-width: 600px;
            height: 116px;
            display: flex;
            justify-content: space-between;
          }

          .heatmap-wrapper :global(.month) {
            flex: 1;
          }

          .heatmap-wrapper :global(.label) {
            font-weight: 500;
            margin-bottom: 4px;
            margin-top: -4px;
            color: ${colors.gray1};
          }

          .heatmap-wrapper :global(.column) {
            height: 100px;
            display: flex;
            flex-direction: column;
            align-content: flex-start;
            flex-wrap: wrap;
          }

          .heatmap-wrapper :global(.circle) {
            width: 10px;
            height: 10px;
            margin: 1px;
            border-radius: 5px;
            opacity: 0;
            animation: circle-fade-in 1s forwards;
          }

          @keyframes circle-fade-in {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}</style>
      </div>
    );
  }

  renderYear = rollingYear => {
    let totalCount = 0;

    this._renderedYear = rollingYear.map(({ month, year }) => {
      const { circles, count } = this.renderCircles(month, year, totalCount);
      totalCount = count;
      const d = new Date();
      d.setMonth(month);

      return (
        <div key={month} className="month">
          <p className="label">{moment(d).format('MMM')}</p>
          <div className="column">{circles}</div>
        </div>
      );
    });

    return this._renderedYear;
  };

  /**
   * Render circles for the given `m` month.
   *
   * @param {Number} m
   * @param {Number} y
   */

  renderCircles = (m, y, count) => {
    if (this.props.values.length === 0) {
      return { circles: [], count: 0 };
    }

    const { values, levels } = this.props;
    const month = moment({ month: m });
    const days = month.daysInMonth();
    const circles = [];
    let totalCounter = count;

    for (let i = 1; i <= days; i++) {
      let count = 0;
      totalCounter++;
      Object.keys(values).forEach(v => {
        const d = moment(cleanDate(v));
        if (d.month() === m && d.year() === y && d.date() === i) {
          count = values[v];
        }
      });

      let circleColor = null;
      for (let i = 0; i < levels.length; i++) {
        const level = levels[i];
        const { max, min, color } = level;
        if (count >= min && count <= max) {
          circleColor = color;
          break;
        }
      }

      const timestamp = moment()
        .set('date', i)
        .set('month', m)
        .set('year', y)
        .format('MMM Do YYYY');

      const animationDelay = `${totalCounter * 2}ms`;

      circles.push(
        <div
          key={i}
          className="circle"
          style={{ background: circleColor, animationDelay }}
          title={`${count} Activities on ${timestamp}`}
        />
      );
    }

    return { circles, count: totalCounter };
  };
}

function cleanDate(dateString) {
  return dateString
    .split('-')
    .map(s => {
      if (s.length === 1) {
        return `0${s}`;
      } else {
        return s;
      }
    })
    .join('-');
}

/**
 * Get the last 12 months.
 *
 * @return {Array}
 */

function getRollingYear() {
  const dateEnd = moment().endOf('month'); // e.g. May 31, 2017
  const dateStart = moment()
    .startOf('month')
    .subtract('11', 'months'); // e.g. June 1, 2016
  const timeValues = [];

  while (dateEnd.isAfter(dateStart)) {
    timeValues.push({
      month: dateStart.get('month'),
      year: dateStart.get('year')
    });
    dateStart.add(1, 'month');
  }

  return timeValues;
}
