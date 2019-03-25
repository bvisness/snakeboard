import React from 'react';

import { NTContext } from '/context/NTContext';

export function TreeView() {
  return (
    <NTContext.Consumer>
      {ntdata => (
        <div>I'm a tree! { JSON.stringify(ntdata) }</div>
      )}
    </NTContext.Consumer>
  );
}
