import React from 'react';
import Icon from './Icon';

export default function ViewButton({ href }) {
  return (
    <a href={href}>
      View{' '}
      <Icon
        inline
        name="external"
        width={14}
        style={{ verticalAlign: 'middle' }}
      />
    </a>
  );
}
