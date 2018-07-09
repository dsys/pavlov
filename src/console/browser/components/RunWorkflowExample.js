import HighlightedCodeBlock from './HighlightedCodeBlock';
import React from 'react';
import RunWorkflowCURLExample from './RunWorkflowCURLExample';
import RunWorkflowJavaScriptExample from './RunWorkflowJavaScriptExample';
import RunWorkflowPythonExample from './RunWorkflowPythonExample';
import RunWorkflowRubyExample from './RunWorkflowRubyExample';
import RunWorkflowExampleButton from './RunWorkflowExampleButton';

const LOCALSTORAGE_KEY = 'pavlov.language';

const LANGUAGES = [
  { language: 'curl', display: 'cURL' },
  { language: 'js', display: 'JavaScript' },
  { language: 'py', display: 'Python' },
  { language: 'rb', display: 'Ruby' }
];

const EXAMPLE_COMPONENTS = {
  curl: RunWorkflowCURLExample,
  js: RunWorkflowJavaScriptExample,
  py: RunWorkflowPythonExample,
  rb: RunWorkflowRubyExample
};

function getLocalStorageLanguage() {
  const val = window.localStorage.getItem(LOCALSTORAGE_KEY);
  return val != null && val in EXAMPLE_COMPONENTS ? val : 'curl';
}

function setLocalStorageLanguage(language) {
  window.localStorage.setItem(LOCALSTORAGE_KEY, language);
}

export default class RunWorkflowExample extends React.Component {
  state = { currentLanguage: getLocalStorageLanguage() };

  handleClick = language => {
    setLocalStorageLanguage(language);
    this.setState({ currentLanguage: language });
  };

  render() {
    const { syncURL } = this.props;
    const { currentLanguage } = this.state;

    const exampleComponent =
      currentLanguage in EXAMPLE_COMPONENTS ? (
        <HighlightedCodeBlock
          style={{ marginTop: 0, borderRadius: '0 0 5px 5px' }}
          component={EXAMPLE_COMPONENTS[currentLanguage]}
          syncURL={syncURL}
        />
      ) : null;

    return (
      <div>
        <div className="language-select">
          {LANGUAGES.map(({ language, display }, i) => (
            <RunWorkflowExampleButton
              key={i}
              language={language}
              display={display}
              active={language === currentLanguage}
              onClick={this.handleClick}
            />
          ))}
        </div>
        {exampleComponent}
        <style jsx>{`
          .language-select {
            display: flex;
          }
        `}</style>
      </div>
    );
  }
}
