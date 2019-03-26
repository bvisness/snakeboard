import React, { useState, useEffect } from 'react';
import { NTContext } from '/context/NTContext';

import { TreeView } from '/components/TreeView';
import { WidgetCanvas } from '/components/WidgetCanvas';

import 'normalize.css';
import '/style.scss';

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
      <WidgetCanvas />
    </NTContext.Provider>
  );
}
