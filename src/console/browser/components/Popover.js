import React from 'react';
import { Manager, Target, Popper, Arrow } from 'react-popper';
import colors from '../colors';

export default function Popover({ visible, placement, children }) {
  return (
    <div className="popover-wrapper">
      <Manager>
        <Target>{children[0]}</Target>
        {visible && (
          <Popper placement={placement} className="popover">
            <Arrow className="arrow" />
            {children[1]}
          </Popper>
        )}
      </Manager>
      <style jsx>{`
        .popover-wrapper :global(.popover) {
          background: ${colors.white};
          color: ${colors.black};
          border-radius: 5px;
          padding: 4px 8px;
          box-shadow: 0 2px 10px 2px ${colors.blackTransparent};
          z-index: 1000;
        }

        .popover-wrapper :global(.arrow) {
          width: 0;
          height: 0;
          border-style: solid;
          position: absolute;
          border-width: 6px;
          border-color: transparent;
        }

        .popover-wrapper :global(.popover[data-placement='bottom']),
        .popover-wrapper :global(.popover[data-placement='bottom-start']) {
          margin-top: 10px;
        }

        .popover-wrapper :global(.popover[data-placement='bottom'] .arrow),
        .popover-wrapper
          :global(.popover[data-placement='bottom-start'] .arrow) {
          top: -6px;
          border-bottom-color: ${colors.white};
          border-top-width: 0;
        }
      `}</style>
    </div>
  );
}
