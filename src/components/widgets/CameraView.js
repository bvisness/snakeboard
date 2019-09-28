import React, { useContext } from 'react';
import classnames from 'classnames';
import { NTData } from '/context/NTData';

export function CameraView(props) {
  const ntdata = useContext(NTData);

  return (
    <img
      className="camera-view"
      src={ props.ntkey }
    />
  );
}
