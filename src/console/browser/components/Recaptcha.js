/* global grecaptcha */

import React from 'react';

const RECAPTCHA_LOAD_CALLBACK = 'pavlovHandleRecaptchaLoaded';
const RECAPTCHA_SITEKEY = '6LdegTIUAAAAALskmHn__W35iR273ZJHeHYen7ED';
const RECAPTCHA_SCRIPT = `https://www.google.com/recaptcha/api.js?render=explicit&onload=${RECAPTCHA_LOAD_CALLBACK}`;

let RECAPTCHA_LOADED = false;
let RECAPTCHA_LOAD_PROMISE = null;

async function loadRecaptcha() {
  if (!RECAPTCHA_LOAD_PROMISE) {
    RECAPTCHA_LOAD_PROMISE = new Promise((resolve, reject) => {
      window[RECAPTCHA_LOAD_CALLBACK] = () => {
        delete window[RECAPTCHA_LOAD_CALLBACK];
        RECAPTCHA_LOADED = true;
        resolve();
      };
    });

    const script = document.createElement('script');
    script.src = RECAPTCHA_SCRIPT;
    script.async = true;
    document.body.appendChild(script);
  }

  return RECAPTCHA_LOAD_PROMISE;
}

export default class Recaptcha extends React.Component {
  state = { loaded: RECAPTCHA_LOADED, success: false };
  widget = null;

  componentWillMount() {
    if (!this.state.loaded) {
      loadRecaptcha().then(() => this.setState({ loaded: true }));
    }
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.widget != null &&
      this.state.success &&
      nextProps.recaptchaResponse == null
    ) {
      this.setState({ success: false });
      grecaptcha.reset(this.widget);
    }
  }

  handleCallbackSuccess = recaptchaResponse => {
    this.setState({ success: true });
    this.props.onChange(recaptchaResponse);
  };

  handleCallbackExpired = e => {
    this.setState({ success: false });
    this.props.onChange(null);
  };

  handleRenderWidget = elem => {
    if (elem) {
      this.widget = grecaptcha.render(elem, {
        sitekey: RECAPTCHA_SITEKEY,
        size: 'invisible',
        badge: 'inline',
        callback: this.handleCallbackSuccess,
        'expired-callback': this.handleCallbackExpired
      });
      grecaptcha.execute();
    } else {
      this.widget = null;
    }
  };

  render() {
    return (
      <div className="recaptcha-wrapper">
        {this.state.loaded && <div ref={this.handleRenderWidget} />}
        <style jsx>{`
          .recaptcha-wrapper {
            position: fixed;
            bottom: 20px;
            right: 20px;
          }
        `}</style>
      </div>
    );
  }
}
