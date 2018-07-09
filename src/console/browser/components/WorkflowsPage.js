import DocumentTitle from './DocumentTitle';
import React from 'react';
import SplitPane from './SplitPane';
import TargetContext from './TargetContext';
import TargetListScroller from './TargetListScroller';
import TargetListSearch from './TargetListSearch';
import TargetListToolbar from './TargetListToolbar';
import WorkflowSettings from './WorkflowSettings';
import _ from 'lodash';
import colors from '../colors';
import gql from 'graphql-tag';
import queryString from 'query-string';
import { graphql } from 'react-apollo';
import { toast } from 'react-toastify';

@graphql(
  gql`
    query WorkflowsPage($id: ID!, $environment: Environment!) {
      workflow(id: $id) {
        id
        name
        suggestedSearchTerms
        settings(environment: $environment) {
          asyncURL
        }
      }
    }
  `,
  {
    options: props => ({
      variables: {
        id: props.match.params.id,
        environment: props.match.query.env
      }
    })
  }
)
@graphql(
  gql`
    query TargetListSearch(
      $workflowId: ID!
      $environment: Environment!
      $searchTerms: [String!]!
      $cursor: String
    ) {
      searchTargets(
        workflowId: $workflowId
        environment: $environment
        searchTerms: $searchTerms
        cursor: $cursor
      ) {
        cursor
        hasNextPage
        items {
          id
          thumbnailURL
          thumbnailIcon
          title
          subtitle
          label
          score
          reasons
          updatedAt
        }
      }
    }
  `,
  {
    name: 'searchData',
    options: props => ({
      variables: {
        workflowId: props.match.params.id,
        environment: props.match.query.env,
        searchTerms: props.match.query.search
      },
      fetchPolicy: 'network-only'
    })
  }
)
export default class WorkflowsPage extends React.Component {
  state = {
    updatedAt: null,
    top: true,
    running: false,
    runError: null,
    runPopoverOpen: false
  };

  handleSelectTarget = target => {
    this.updateQueryString({ target });
  };

  handleChangeEnvironment = env => {
    this.updateQueryString({ env });
  };

  handleChangeSearch = search => {
    this.updateQueryString({ search });
  };

  handleSettings = () => {
    this.updateQueryString({ target: null });
  };

  handleChangeDecision = () => {
    this.setState({ updatedAt: new Date() });
  };

  updateQueryString = qs => {
    const { location, history } = this.props;
    const parts = _.pickBy(
      {
        ...queryString.parse(location.search, { arrayFormat: 'bracket' }),
        ...qs
      },
      x => x != null
    );

    history.push({
      search: queryString.stringify(parts, { arrayFormat: 'bracket' })
    });
  };

  loadMoreRows = () => {
    const { fetchMore, searchTargets } = this.props.searchData;
    return fetchMore({
      variables: { cursor: searchTargets.cursor },
      updateQuery: (previousResult, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          return {
            ...fetchMoreResult,
            searchTargets: {
              ...fetchMoreResult.searchTargets,
              items: [
                ...previousResult.searchTargets.items,
                ...fetchMoreResult.searchTargets.items
              ]
            }
          };
        } else {
          return previousResult;
        }
      }
    });
  };

  handleRefresh = async () => {
    await this.props.searchData.refetch();
    this.setState({ updatedAt: new Date() });
  };

  handleToggleRunPopover = () => {
    this.setState({ runPopoverOpen: !this.state.runPopoverOpen });
  };

  handleRun = async values => {
    const { workflow } = this.props.data;

    if (workflow) {
      const form = new FormData();
      for (const [k, v] of Object.entries(values)) {
        if (v) {
          form.append(k, v);
        }
      }

      this.setState({ running: true });
      const res = await fetch(workflow.settings.asyncURL, {
        method: 'POST',
        body: form
      });

      if (res.ok) {
        const { id } = await res.json();

        this.setState({
          running: false,
          runError: null,
          runPopoverOpen: false
        });
        toast(`Ran workflow on target: ${id}`);
        this.handleSelectTarget(id);
      } else {
        const { errors } = await res.json();
        this.setState({
          running: false,
          runError: errors.map(e => e.message).join(', ')
        });
      }
    }
  };

  handleScroll = ({ scrollTop }) => {
    if (scrollTop === 0) {
      this.setState({ top: true });
    } else {
      this.setState({ top: false });
    }
  };

  render() {
    const { match, data: { workflow }, searchData } = this.props;
    const { updatedAt, top, running, runError, runPopoverOpen } = this.state;

    const title = workflow ? workflow.name : 'Workflows';
    const suggestedSearchTerms = workflow ? workflow.suggestedSearchTerms : [];

    return (
      <SplitPane
        fixed
        localStorageKey="list"
        minSplit={400}
        maxSplit={600}
        defaultSplit={400}
      >
        <div className="target-list">
          <DocumentTitle title={title} />
          <div className="toolbar-wrapper">
            <TargetListToolbar
              environment={match.query.env}
              settingsActive={match.query.target == null}
              running={running}
              runError={runError}
              runPopoverOpen={runPopoverOpen}
              onChangeEnvironment={this.handleChangeEnvironment}
              onRefresh={this.handleRefresh}
              onSettings={this.handleSettings}
              onToggleRunPopover={this.handleToggleRunPopover}
              onRun={this.handleRun}
            />
          </div>
          <div className="search-wrapper">
            <TargetListSearch
              suggestedSearchTerms={suggestedSearchTerms}
              searchTerms={match.query.search}
              onChange={this.handleChangeSearch}
            />
          </div>
          <div className="scroller-wrapper">
            {!top && <div className="shadow-bar" />}
            <TargetListScroller
              ref={this.setScrollerRef}
              updatedAt={updatedAt}
              selectedTargetId={match.query.target}
              onScroll={this.handleScroll}
              onSelect={this.handleSelectTarget}
              loadMoreRows={this.loadMoreRows}
              {...searchData}
            />
          </div>
          <style jsx>{`
            .target-list {
              display: flex;
              flex-direction: column;
              height: 100%;
              min-height: 100vh;
              background: ${colors.gray3};
            }

            .toolbar-wrapper,
            .search-wrapper {
              flex: none;
            }

            .scroller-wrapper {
              flex: auto;
              position: relative;
            }

            .shadow-bar {
              height: 4px;
              background: ${colors.blackTransparent};
              box-shadow: 0 2px 4px ${colors.blackTransparent};
              width: 100%;
              position: absolute;
              z-index: 1;
            }
          `}</style>
        </div>
        {match.query.target ? (
          <TargetContext
            targetId={match.query.target}
            updatedAt={updatedAt}
            onChangeDecision={this.handleChangeDecision}
            onSelectTarget={this.handleSelectTarget}
          />
        ) : (
          <WorkflowSettings
            workflowId={match.params.id}
            environment={match.query.env}
          />
        )}
      </SplitPane>
    );
  }
}
