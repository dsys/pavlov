import React from 'react';
import TargetContext from './TargetContext';

export default function EmbeddedTargetContextPage({ match }) {
  return <TargetContext targetId={match.params.targetId} />;
}
