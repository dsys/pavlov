import DeleteButton from './DeleteButton';
import Footnote from './Footnote';
import PropTypes from 'prop-types';
import React from 'react';
import Table from './Table';
import moment from 'moment';
import { getCurrentAuthTokenId } from '../auth';

export default class AuthTokensTable extends React.Component {
  onClickDelete(id) {
    if (
      confirm(
        `${id}\n\nAre you sure you wish to delete this auth token? All clients using this token will be logged out.`
      )
    ) {
      this.props.onDelete(id);
    }
  }

  render() {
    const currentAuthTokenId = getCurrentAuthTokenId();
    return (
      <Table
        cols={['Public Auth Token Info', 'Created', 'Expires', 'Actions']}
        rows={this.props.authTokens}
        renderRow={(row, key) => (
          <tr key={key}>
            <td>
              <strong>{row.id}</strong>
              <div>{row.audience}</div>
              <Footnote>via {row.issuer}</Footnote>
            </td>
            <td>{moment(row.createdAt).fromNow()}</td>
            <td>{moment(row.expiresAt).fromNow()}</td>
            <td>
              {currentAuthTokenId !== row.id && (
                <DeleteButton onClick={() => this.onClickDelete(row.id)} />
              )}
            </td>
          </tr>
        )}
      />
    );
  }
}

AuthTokensTable.propTypes = {
  authTokens: PropTypes.arrayOf(PropTypes.object),
  onDelete: PropTypes.func
};

AuthTokensTable.defaultProps = {
  onDelete: () => {}
};
