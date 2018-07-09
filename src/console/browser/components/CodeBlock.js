import React from 'react';
import colors from '../colors';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { toast } from 'react-toastify';

export default class CodeBlock extends React.Component {
  state = { text: '' };

  componentWillReceiveProps(props) {
    this.updateText();
  }

  handleCodeRef = elem => {
    this.codeElem = elem;
    this.updateText();
  };

  updateText = () => {
    setTimeout(() => {
      if (this.codeElem) {
        const text = this.codeElem.innerText;
        this.setState({ text });
      }
    }, 0);
  };

  render() {
    const { noPre, style, children } = this.props;
    const { text } = this.state;

    return (
      <div className="code-wrapper" style={style}>
        <CopyToClipboard
          text={text}
          onCopy={() => toast('Copied to your clipboard.')}
        >
          <button>Copy to clipboard 📋</button>
        </CopyToClipboard>
        <div className="code" ref={this.handleCodeRef}>
          {noPre ? children : <pre>{children}</pre>}
        </div>
        <style jsx>
          {`
            .code-wrapper {
              position: relative;
              margin: 20px auto;
              background: ${colors.black};
              border-radius: 5px;
            }

            button {
              position: absolute;
              right: 10px;
              top: 10px;
              background: transparent;
              border: 0;
              color: ${colors.purple4};
              transition: 0.2s color;
              cursor: pointer;
              padding: 5px;
            }

            button:hover,
            button:focus {
              color: ${colors.purple5};
            }

            .code {
              color: ${colors.gray3};
              font-family: monospace;
              font-size: 14px;
              line-height: 20px;
              padding: 40px;
              text-align: left;
            }

            .code :global(pre) {
              white-space: pre-wrap;
              word-wrap: break-word;
            }
          `}
        </style>
      </div>
    );
  }
}
