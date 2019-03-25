import React, { useState, useEffect } from 'react';

import { TreeView } from '/components/TreeView';
import { NTContext } from '/context/NTContext';

export function App() {
  const [ntdata, setNtdata] = useState({});

  useEffect(() => {
    var ws = new WebSocket("ws://127.0.0.1:5678/");
    ws.addEventListener('message', event => {
      setNtdata(JSON.parse(event.data));
    })

    return () => {
      ws.close();
    };
  }, []);

  return (
    <NTContext.Provider value={ ntdata }>
      <TreeView />
    </NTContext.Provider>
  );
}
