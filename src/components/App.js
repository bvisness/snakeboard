import React, { useState, useEffect } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

import { NTConnection } from '/context/NTConnection';
import { NTData } from '/context/NTData';

import { ConnectionIndicators } from '/components/ConnectionIndicators';
import { TreeView } from '/components/TreeView';
import { WidgetCanvas } from '/components/WidgetCanvas';

import 'normalize.css';
import '/style.scss';

function NTProvider(props) {
  const [serverConnected, setServerConnected] = useState(false);
  const [robotConnected, setRobotConnected] = useState(false);
  const [ntdata, setNtdata] = useState({});

  useEffect(() => {
    NetworkTables.addWsConnectionListener(connected => {
      console.log("Websocket connected: " + connected);
      setServerConnected(connected);
    }, true);
    NetworkTables.addRobotConnectionListener(function(connected){
      console.log("Robot connected: " + connected);
      setRobotConnected(connected);
    }, true);
    NetworkTables.addGlobalListener((key, value, isNew) => {
      setNtdata(ntdata => ({...ntdata, [key]: value}));
    }, true);
  }, []);

  const connections = {
    server: serverConnected,
    robot: robotConnected,
  };

  return (
    <NTConnection.Provider value={ connections }>
      <NTData.Provider value={ ntdata }>
        { props.children }
      </NTData.Provider>
    </NTConnection.Provider>
  );
}

export function App() {
  return (
    <DragDropContextProvider backend={ HTML5Backend }>
      <NTProvider>
        <WidgetCanvas />
        <TreeView />
        <ConnectionIndicators />
      </NTProvider>
    </DragDropContextProvider>
  );
}
