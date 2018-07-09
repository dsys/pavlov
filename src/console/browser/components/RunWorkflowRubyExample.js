import React from 'react'; // eslint-disable-line no-unused-vars
import highlight from 'babel-plugin-transform-syntax-highlight/highlight';

const RunWorkflowRubyExample = highlight.react(
  {
    language: 'ruby'
  },
  `# using rest-client
# https://github.com/rest-client/rest-client

require "json"
require "rest-client"

sync_url = "{# props.syncURL #}"
image = File.new('/path/to/image.png')

res = RestClient.post(sync_url, image: File.new('/path/to/file'))
id = JSON.parse(res.body)
puts id`
);

export default RunWorkflowRubyExample;
