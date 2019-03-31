import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { NTContext } from '/context/NTContext';

import { SimpleIndicator } from '/components/widgets/SimpleIndicator';
import { SimpleText } from '/components/widgets/SimpleText';

import { keyName } from '/util/keys';
import { typeOf } from '/util/types';
import { useStableState } from '/util/hooks';

const DRAG_NONE = 'none';
const DRAG_POSITION = 'position';
const DRAG_SIZE = 'size';

function widgetComponent(widgetType) {
  const components = {
    SimpleIndicator: SimpleIndicator,
    SimpleText: SimpleText,
  };

  return components[widgetType];
}

function widgetTypes(typeOfValue) {
  switch (typeOfValue) {
    case 'number':
      return [
        'SimpleText',
      ];
    case 'boolean':
      return [
        'SimpleIndicator',
        'SimpleText',
      ];
    default:
      return [
        'SimpleText',
      ];
  }
}

export function defaultType(value) {
  return widgetTypes(typeOf(value))[0];
}

export function Widget(props) {
  const ntdata = useContext(NTContext);
  const domRef = useRef(null);
  
  const [dragMode, setDragMode, getDragMode] = useStableState(DRAG_NONE);
  const [
    initialDragMousePosition,
    setInitialDragMousePosition,
    getInitialDragMousePosition,
  ] = useStableState([0, 0]);
  const [
    initialDragPosition,
    setInitialDragPosition,
    getInitialDragPosition,
  ] = useStableState([0, 0]);
  const [
    initialDragSize,
    setInitialDragSize,
    getInitialDragSize,
  ] = useStableState(null);

  function startDrag(event, mode) {
    event.preventDefault();

    setInitialDragPosition(props.position);
    setInitialDragMousePosition([event.screenX, event.screenY]);
    setInitialDragSize([
      domRef.current.clientWidth,
      domRef.current.clientHeight,
    ]);
    setDragMode(mode);

    props.moveToFront();
  }

  useEffect(() => {
    function handleMouseMove(event) {
      const initialMousePosition = getInitialDragMousePosition();
      const deltaX = event.screenX - initialMousePosition[0];
      const deltaY = event.screenY - initialMousePosition[1];

      if (getDragMode() === DRAG_POSITION) {
        const initialOffset = getInitialDragPosition();
        props.setPosition([
          initialOffset[0] + deltaX,
          initialOffset[1] + deltaY,
        ]);
      } else if (getDragMode() === DRAG_SIZE) {
        const initialDragSize = getInitialDragSize();
        props.setSize([
          initialDragSize[0] + deltaX,
          initialDragSize[1] + deltaY,
        ]);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    function handleMouseUp() {
      setDragMode(DRAG_NONE);
    }
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const WidgetComponent = widgetComponent(props.type);

  return (
    <div
      className={ classnames(
        'widget',
        {
          'dragging': dragMode === DRAG_POSITION,
        },
      )}
      style={{
        left: props.position[0],
        top: props.position[1],
        width: props.size && props.size[0],
        height: props.size && props.size[1],
        zIndex: props.z,
      }}
      ref={ domRef }
    >
      <div className="widget-header">
        <button>=</button>
        <div className="widget-title" onMouseDown={ e => startDrag(e, DRAG_POSITION) }>
          { keyName(props.ntkey) }
        </div>
        <button onClick={ () => props.close() }>X</button>
      </div>
      <div className="widget-body">
        { WidgetComponent
          ? <WidgetComponent ntkey={ props.ntkey } />
          : 'ERROR!'
        }
      </div>
      <div className="widget-resize-handle" onMouseDown={ e => startDrag(e, DRAG_SIZE) } />
    </div>
  );
}

Widget.propTypes = {
  ntkey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  size: PropTypes.array,
  z: PropTypes.number.isRequired,
  close: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired,
  setSize: PropTypes.func.isRequired,
  moveToFront: PropTypes.func.isRequired,
};
