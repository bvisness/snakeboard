import React, { useContext } from 'react';
import { NTContext } from '/context/NTContext';

export function SimpleText(props) {
  const ntdata = useContext(NTContext);

  return (
    <div className="simple-text">
      { ntdata[props.ntkey] + '' }
    </div>
  );
}
