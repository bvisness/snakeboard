import React, { useState, useEffect } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { NTContext } from '/context/NTContext';

import { TreeView } from '/components/TreeView';
import { WidgetCanvas } from '/components/WidgetCanvas';

import 'normalize.css';
import '/style.scss';

function NTProvider(props) {
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
      { props.children }
    </NTContext.Provider>
  );
}

export function App() {
  return (
    <DragDropContextProvider backend={ HTML5Backend }>
      <NTProvider>
        <WidgetCanvas />
        <TreeView />
      </NTProvider>
    </DragDropContextProvider>
  );
}
