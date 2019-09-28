import React, { useContext } from 'react';
import { NTData } from '/context/NTData';

export function SimpleText(props) {
  const ntdata = useContext(NTData);

  return (
    <div className="simple-text">
      { ntdata[props.ntkey] + '' }
    </div>
  );
}
