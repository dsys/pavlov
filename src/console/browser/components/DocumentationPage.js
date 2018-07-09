import React from 'react';
import DocumentTitle from './DocumentTitle';

export default function DocumentationPage() {
  return (
    <DocumentTitle title="Documentation">
      <div>
        <iframe src="https://pavlov.ai/docs/?no-logo=true" />
        <style jsx>{`
          div {
            height: 100%;
          }

          iframe {
            display: block;
            width: 100%;
            height: 100%;
          }
        `}</style>
      </div>
    </DocumentTitle>
  );
}
