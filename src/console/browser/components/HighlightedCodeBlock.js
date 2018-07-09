import CodeBlock from './CodeBlock';
import React from 'react';
import colors from '../colors';

export default function HighlightCodeBlock({
  component,
  style,
  ...otherProps
}) {
  const children = React.createElement(component, otherProps, null);
  return (
    <div>
      <CodeBlock style={style} noPre>
        {children}
      </CodeBlock>
      <style jsx>{`
        div :global(.hljs-class),
        div :global(.hljs-title) {
          font-weight: bold;
          color: ${colors.purple5};
        }

        div :global(.hljs-keyword) {
          font-weight: bold;
          color: ${colors.white};
        }

        div :global(.hljs-comment) {
          color: ${colors.gray1};
        }

        div :global(.hljs-string) {
          color: ${colors.purple4};
        }

        div :global(.hljs-symbol),
        div :global(.hljs-attr) {
          color: ${colors.purple5};
        }
      `}</style>
    </div>
  );
}
