import React from 'react'; // eslint-disable-line no-unused-vars
import highlight from 'babel-plugin-transform-syntax-highlight/highlight';

const RunWorkflowPythonExample = highlight.react(
  {
    language: 'python'
  },
  `# using requests
# http://docs.python-requests.org/en/master/

import requests

sync_url = "{# props.syncURL #}"
image = open('/path/to/image.png', 'rb')

res = requests.post(sync_url, files={'image': image})
print(res.json()['id'])`
);

export default RunWorkflowPythonExample;
