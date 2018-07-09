import Icon from './Icon';
import React from 'react';
import Select from 'react-select';
import TargetListSearchTerm from './TargetListSearchTerm';
import _ from 'lodash';
import colors from '../colors';

export default class TargetListSearch extends React.Component {
  state = { input: '' };

  handleChange = e => {
    this.props.onChange(e.map(v => v.value));
  };

  handleInputChange = input => {
    this.setState({ input });
  };

  generateOptions = () => {
    const { suggestedSearchTerms, searchTerms } = this.props;
    const { input } = this.state;

    let searchTermValues = searchTerms.concat(suggestedSearchTerms);
    if (input) {
      if (input.startsWith('TRG')) {
        searchTermValues = searchTermValues.concat([`id:${input}`]);
      }
      searchTermValues = searchTermValues.concat([`alias:${input}`]);
    }

    const searchTermOptions = _.uniq(searchTermValues).map(v => ({
      label: v,
      value: v
    }));

    if (input) {
      return searchTermOptions;
    } else {
      return searchTermOptions.concat([
        { label: 'Or, enter a target identifier or alias...', disabled: true }
      ]);
    }
  };

  render() {
    const { searchTerms } = this.props;

    const options = this.generateOptions();

    return (
      <div className="search">
        <div className="icon">
          <Icon inline name="search" width={20} height={20} />
        </div>
        <Select
          multi
          clearable={false}
          value={searchTerms}
          options={options}
          placeholder={
            <div className="placeholder-text">Search targets...</div>
          }
          valueComponent={TargetListSearchTerm}
          onInputChange={this.handleInputChange}
          onChange={this.handleChange}
        />
        <style jsx>{`
          .search {
            position: relative;
            background-color: ${colors.gray2};
          }

          .icon {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 30px;
            display: flex;
            align-items: center;
            color: ${colors.gray3};
            z-index: 1;
          }

          div :global(.Select-control) {
            border: 0;
            border-radius: 0;
            padding: 17px 20px 18px 70px;
            cursor: text;
            border-bottom: 1px solid ${colors.gray2};
          }

          div :global(.Select-control:focus) {
            border-bottom-color: ${colors.white};
          }

          div :global(.Select-input),
          div :global(.Select--multi .Select-multi-value-wrapper) {
            display: block !important;
          }

          div :global(.Select-input),
          div :global(.Select--multi.has-value .Select-input) {
            height: 34px;
            margin-left: 0;
          }

          div :global(.Select-input > input) {
            padding: 2px 0;
            line-height: 20px;
            float: left;
            margin: 5px 10px 5px 0;
          }

          div :global(.Select-placeholder) {
            display: flex;
            align-items: center;
            font-style: italic;
            padding: 0;
            margin-left: 50px;
          }

          div :global(.Select-arrow-zone) {
            padding-right: 0;
          }

          .placeholder-text {
            margin-left: 20px;
          }
        `}</style>
      </div>
    );
  }
}
