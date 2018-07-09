import DocumentTitle from './DocumentTitle';
import PageHeader from './PageHeader';
import React from 'react';

export default function NotFoundPage() {
  return (
    <DocumentTitle title="Not Found">
      <div>
        <PageHeader title="404 Not Found" subtitle="🚫" />
        <style jsx>{`
          div {
            padding: 0 40px;
            max-width: 960px;
            margin: 0 auto;
          }
        `}</style>
      </div>
    </DocumentTitle>
  );
}
