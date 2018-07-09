import React from 'react'; // eslint-disable-line no-unused-vars
import highlight from 'babel-plugin-transform-syntax-highlight/highlight';

const RunWorkflowCURLExample = highlight.react(
  {
    language: 'bash'
  },
  `curl "{# props.syncURL #}" -F image=@path/to/image.png`
);

export default RunWorkflowCURLExample;
