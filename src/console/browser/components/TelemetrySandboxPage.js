import React from 'react';
import fetch from 'isomorphic-fetch';
import { gray1 } from '../colors';

const EMIT_REQUEST_TIMEOUT = 5 * 1000;

export default class TelemetrySandboxPage extends React.Component {
  state = { emitting: false, counter: 0 };

  handleClick = e => {
    this.emit('CLICK', {});
  };

  componentDidMount() {
    this.emit('VIEW', {});
  }

  emit = async (type, fields) => {
    this.setState({ emitting: true });
    await fetch(this.props.match.query.url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ type, fields }),
      timeout: EMIT_REQUEST_TIMEOUT
    });
    this.setState({ emitting: false, counter: this.state.counter + 1 });
  };

  render() {
    const { match } = this.props;
    const { emitting, counter } = this.state;

    return (
      <div className="page">
        <h1>Sandbox for {match.query.url}</h1>
        <button onClick={this.handleClick}>
          {emitting ? 'Emitting' : 'Click Me!'}
        </button>
        <div className="counter">{counter}</div>
        <style jsx>{`
          .page {
            margin: 40px;
          }

          h1 {
            font-size: 18px;
          }

          button {
            display: block;
            border: 1px solid ${gray1};
            border-radius: 2px;
            background: white;
            padding: 4px 8px;
            cursor: pointer;
            font-family: inherit;
            margin: 20px 0;
          }

          .counter {
            margin: 20px 0;
          }
        `}</style>
      </div>
    );
  }
}
