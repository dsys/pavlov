import FileField from './FileField';
import FormError from './FormError';
import InputField from './InputField';
import React from 'react';
import SubmitButton from './SubmitButton';

export default class RunWorkflowForm extends React.Component {
  state = {
    image: null,
    imageURL: '',
    setLabel: '',
    addAlias: '',
    removeAlias: ''
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.onSubmit(this.state);
  };

  handleChangeImageFile = image => {
    this.setState({ image });
  };

  handleChangeImageURL = e => {
    this.setState({ imageURL: e.target.value });
  };

  handleChangeSetLabel = e => {
    this.setState({ setLabel: e.target.value });
  };

  handleChangeAddAlias = e => {
    this.setState({ addAlias: e.target.value });
  };

  handleChangeRemoveAlias = e => {
    this.setState({ removeAlias: e.target.value });
  };

  render() {
    const { running, error } = this.props;
    const { imageURL, setLabel, addAlias, removeAlias } = this.state;

    return (
      <form onSubmit={this.handleSubmit}>
        <FormError text={error} />
        <FileField
          label="Image"
          disabled={running}
          onChange={this.handleChangeImageFile}
        />
        <InputField
          label="Image URL"
          type="text"
          value={imageURL}
          disabled={running}
          onChange={this.handleChangeImageURL}
        />
        <InputField
          label="Set Label"
          type="text"
          value={setLabel}
          disabled={running}
          onChange={this.handleChangeSetLabel}
        />
        <InputField
          label="Add Alias"
          type="text"
          value={addAlias}
          disabled={running}
          onChange={this.handleChangeAddAlias}
        />
        <InputField
          label="Remove Alias"
          type="text"
          value={removeAlias}
          disabled={running}
          onChange={this.handleChangeRemoveAlias}
        />
        <SubmitButton text={running ? 'Running...' : 'Run'} />
        <style jsx>{`
          form {
            margin: 20px;
            min-width: 200px;
          }
        `}</style>
      </form>
    );
  }
}
