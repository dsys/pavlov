import React from 'react'; // eslint-disable-line no-unused-vars
import highlight from 'babel-plugin-transform-syntax-highlight/highlight';

const RunWorkflowJavaScriptExample = highlight.react(
  {
    language: 'javascript'
  },
  `// using isomorphic-fetch
// https://github.com/matthew-andrews/isomorphic-fetch

import 'isomorphic-fetch'
import fs from 'fs'

const syncURL =
  "{# props.syncURL #}";
const image = fs.readFileSync('/path/to/image.png')
const form = new FormData();
form.append('image', image, 'image.png');

fetch(syncURL, { method: 'POST', body: form })
  .then(res => res.json())
  .then(resBody => {
    console.log(resBody.id)
  })
  .catch(err => console.error(err));`
);

export default RunWorkflowJavaScriptExample;
