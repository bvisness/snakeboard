import React, { useContext } from 'react';
import { NTContext } from '/context/NTContext';

export function SimpleNumber(props) {
  const ntdata = useContext(NTContext);

  return (
    <div className="simple-number">
      { ntdata[props.ntkey] }
    </div>
  );
}
