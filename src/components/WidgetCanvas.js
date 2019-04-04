import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropTarget } from 'react-dnd'

import { NTContext } from '/context/NTContext';

import { useStableState } from '/util/hooks';

import { DragItemTypes } from '/util/constants';
import { Widget, defaultType } from '/components/widgets/Widget';
import { WidgetMenu } from '/components/widgets/WidgetMenu';

const WidgetDropTarget = DropTarget(
  DragItemTypes.TreeItem,
  {
    drop(props, monitor) {
      props.addWidget(
        monitor.getItem().key,
        [
          monitor.getClientOffset().x,
          monitor.getClientOffset().y,
        ],
      );
    },
  },
  function collect(connect, monitor) {
    return {
      connectDropTarget: connect.dropTarget(),
      isDragging: monitor.canDrop(),
    };
  },
)(props => props.connectDropTarget(
  <div className={ classnames(
    'widget-drop-target',
    {
      active: props.isDragging,
    },
  )} />
));
WidgetDropTarget.propTypes = {
  addWidget: PropTypes.func.isRequired,
};

export function WidgetCanvas(props) {
  const ntdata = useContext(NTContext);

  const [widgetState, setWidgetState, getWidgetState] = useStableState({});
  const [widgetMaxZ, setWidgetMaxZ] = useState(0);
  const [widgetMenuState, setWidgetMenuState] = useState(null);

  function newFrontZ() {
    const newMaxZ = widgetMaxZ + 1;
    setWidgetMaxZ(newMaxZ);
    return newMaxZ;
  }

  function addWidget(key, position = [200, 200]) {
    setWidgetState(widgetState => ({
      [key]: {
        ntkey: key,
        type: defaultType(ntdata[key]),
        position: position,
        size: null,
        z: newFrontZ(),
      },
      ...widgetState,
    }));
  }

  function closeWidget(key) {
    setWidgetState(widgetState => {
      const {[key]: undefined, ...newState} = widgetState;
      return newState;
    });
  }

  function setWidgetPosition(key, position) {
    setWidgetState(widgetState => ({
      ...widgetState,
      [key]: {
        ...widgetState[key],
        position: position,
      },
    }));
  }

  function setWidgetSize(key, size) {
    setWidgetState(widgetState => ({
      ...widgetState,
      [key]: {
        ...widgetState[key],
        size: size,
      },
    }));
  }

  function setWidgetType(key, type) {
    setWidgetState(widgetState => ({
      ...widgetState,
      [key]: {
        ...widgetState[key],
        type: type,
      },
    }));
  }

  function moveWidgetToFront(key) {
    setWidgetState(widgetState => ({
      ...widgetState,
      [key]: {
        ...widgetState[key],
        z: newFrontZ(),
      },
    }));
  }

  function showWidgetMenu(key, position) {
    setWidgetMenuState({
      key: key,
      position: position,
    });
  }

  function renderWidget(key) {
    const widgetData = widgetState[key];

    return (
      <Widget
        key={ key }
        {...widgetData}
        close={ () => closeWidget(key) }
        setPosition={ position => setWidgetPosition(key, position) }
        setSize={ size => setWidgetSize(key, size) }
        moveToFront={ () => moveWidgetToFront(key) }
        showMenu={ position => showWidgetMenu(key, position) }
      />
    );
  }

  // save/load widget state
  useEffect(() => {
    const storageKey = 'snakeboardWidgetState'

    const previousStateJson = window.localStorage.getItem(storageKey);
    if (previousStateJson) {
      const prevState = JSON.parse(previousStateJson);
      setWidgetState(prevState);
      setWidgetMaxZ(Object.values(prevState).reduce(
        (max, current) => Math.max(max, current.z || 0),
        0,
      ));
    }

    function saveState() {
      const saveData = JSON.stringify(getWidgetState());
      window.localStorage.setItem(storageKey, saveData);
    }

    function handleMouseUp() {
      saveState();
      setWidgetMenuState(null);
    }
    window.addEventListener('mouseup', handleMouseUp);

    function handleWindowUnload() {
      saveState();
    }
    window.addEventListener('beforeunload', handleWindowUnload);

    return () => {
      saveState();
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div className="widget-canvas">
      { Object.keys(widgetState).map(key => renderWidget(key)) }
      <WidgetDropTarget addWidget={ addWidget } />
      { widgetMenuState &&
        <WidgetMenu
          ntkey={ widgetMenuState.key }
          type={ widgetState[widgetMenuState.key].type }
          position={ widgetMenuState.position }
          setType={ type => setWidgetType(widgetMenuState.key, type) }
        />
      }
    </div>
  );
}
