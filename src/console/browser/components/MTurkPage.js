import ExternalTaskContext from './ExternalTaskContext';
import React from 'react';
import _ from 'lodash';
import queryString from 'query-string';

const MTURK_SUBMIT_URL = __DEV__
  ? 'https://workersandbox.mturk.com/mturk/externalSubmit'
  : 'https://www.mturk.com/mturk/externalSubmit';

export default class MTurkPage extends React.Component {
  handleChangeDecision = decisionInfo => {
    const { assignmentId } = queryString.parse(window.location.search);
    const qs = queryString.stringify({ assignmentId, ...decisionInfo });
    window.location = `${MTURK_SUBMIT_URL}?${qs}`;
  };

  render() {
    const { match } = this.props;

    return (
      <ExternalTaskContext
        externalTaskId={match.params.externalTaskId}
        preview={
          !match.query.assignmentId ||
          match.query.assignmentId === 'ASSIGNMENT_ID_NOT_AVAILABLE'
        }
        metadata={_.omit(match.query, ['authToken'])}
        onChangeDecision={this.handleChangeDecision}
      />
    );
  }
}
