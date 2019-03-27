import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropTarget } from 'react-dnd'

import { NTContext } from '/context/NTContext';

import { useStableState } from '/util/hooks';

import { DragItemTypes } from '/util/constants';
import { Widget, defaultType } from '/components/widgets/Widget';

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
  // TODO: now everything rerenders whenever anything changes :(
  const ntdata = useContext(NTContext);

  const [widgetState, setWidgetState, getWidgetState] = useStableState({});

  function addWidget(key, position = [200, 200]) {
    setWidgetState(widgetState => ({
      [key]: {
        ntkey: key,
        position: position,
        type: defaultType(ntdata[key]),
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

  function renderWidget(key) {
    const widgetData = widgetState[key];

    return (
      <Widget
        key={ key }
        {...widgetData}
        close={ () => closeWidget(key) }
        setPosition={ position => setWidgetPosition(key, position) }
      />
    );
  }

  // save/load widget state
  useEffect(() => {
    const storageKey = 'snakeboardWidgetState'

    const previousState = window.localStorage.getItem(storageKey);
    if (previousState) {
      setWidgetState(JSON.parse(previousState));
    }

    function saveState() {
      const saveData = JSON.stringify(getWidgetState());
      window.localStorage.setItem(storageKey, saveData);
    }

    function handleMouseUp() {
      saveState();
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
    </div>
  );
}
