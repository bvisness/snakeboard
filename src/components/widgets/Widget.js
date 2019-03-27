import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { NTContext } from '/context/NTContext';

import { SimpleIndicator } from '/components/widgets/SimpleIndicator';
import { SimpleText } from '/components/widgets/SimpleText';

import { keyName } from '/util/keys';
import { typeOf } from '/util/types';
import { useStableState } from '/util/hooks';

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
  
  const [isDragging, setIsDragging, getIsDragging] = useStableState(false);
  const [
    initialDragPosition,
    setInitialDragPosition,
    getInitialDragPosition,
  ] = useStableState([0, 0]);
  const [
    initialDragMousePosition,
    setInitialDragMousePosition,
    getInitialDragMousePosition,
  ] = useStableState([0, 0]);

  function startDrag(event) {
    setInitialDragPosition(props.position);
    setInitialDragMousePosition([event.screenX, event.screenY]);
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(event) {
      if (getIsDragging()) {
        const initialOffset = getInitialDragPosition();
        const initialMousePosition = getInitialDragMousePosition();

        const newX = initialOffset[0] + (event.screenX - initialMousePosition[0]);
        const newY = initialOffset[1] + (event.screenY - initialMousePosition[1]);
        props.setPosition([newX, newY]);
      }
    }
    window.addEventListener('mousemove', handleMouseMove);

    function handleMouseUp() {
      setIsDragging(false);
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
          'dragging': isDragging,
        },
      )}
      style={{
        left: props.position[0],
        top: props.position[1],
      }}
    >
      <div className="widget-header">
        <button>=</button>
        <div className="widget-title" onMouseDown={ startDrag }>
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
    </div>
  );
}

Widget.propTypes = {
  ntkey: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  type: PropTypes.string.isRequired,
  close: PropTypes.func.isRequired,
  setPosition: PropTypes.func.isRequired,
};
