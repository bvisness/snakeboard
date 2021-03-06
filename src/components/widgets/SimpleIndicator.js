import React, { useContext } from 'react';
import classnames from 'classnames';
import { NTData } from '/context/NTData';

export function SimpleIndicator(props) {
  const ntdata = useContext(NTData);

  return (
    <div className={ classnames('simple-indicator', { on: ntdata[props.ntkey] }) } />
  );
}
