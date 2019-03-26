import React, { useContext } from 'react';
import classnames from 'classnames';
import { NTContext } from '/context/NTContext';

export function SimpleIndicator(props) {
  const ntdata = useContext(NTContext);

  return (
    <div className={ classnames('simple-indicator', { on: ntdata[props.ntkey] }) } />
  );
}
