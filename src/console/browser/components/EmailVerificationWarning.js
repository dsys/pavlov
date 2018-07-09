import React from 'react';
import colors from '../colors';

export default function EmailVerificationWarning({
  verified,
  resending,
  onResend
}) {
  if (verified) {
    return null;
  } else {
    return (
      <span>
        (unverified,{' '}
        {resending ? (
          'resending...'
        ) : (
          <a href="#" onClick={onResend}>
            resend
          </a>
        )})
        <style jsx>{`
          span {
            color: ${colors.red};
            padding-left: 0.5em;
          }
        `}</style>
      </span>
    );
  }
}
