import React, { useState, useEffect, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

import { NTContext } from '/context/NTContext';

import { SimpleIndicator } from '/components/widgets/SimpleIndicator';
import { SimpleText } from '/components/widgets/SimpleText';

import { keyName } from '/util/keys';
import { typeOf } from '/util/types';

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

function defaultType(value) {
  return widgetTypes(typeOf(value))[0];
}

export function Widget(props) {
  const ntdata = useContext(NTContext);

  const [widgetType, setWidgetType] = useState(defaultType(ntdata[props.ntkey]));
  
  const [isDragging, _setIsDraggingState] = useState(false);
  const [offset, setOffset] = useState([200, 200]);
  const isDraggingRef = useRef(false);
  const initialDragOffsetRef = useRef([0, 0]);
  const initialDragMousePositionRef = useRef([0, 0]);

  function setIsDragging(d) {
    isDraggingRef.current = d;
    _setIsDraggingState(d);
  }

  function startDrag(event) {
    initialDragOffsetRef.current = offset;
    initialDragMousePositionRef.current = [event.screenX, event.screenY];
    setIsDragging(true);
  }

  useEffect(() => {
    function handleMouseMove(event) {
      if (isDraggingRef.current) {
        const initialOffset = initialDragOffsetRef.current;
        const initialMousePosition = initialDragMousePositionRef.current;

        const newX = initialOffset[0] + (event.screenX - initialMousePosition[0]);
        const newY = initialOffset[1] + (event.screenY - initialMousePosition[1]);
        setOffset([newX, newY]);
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

  const WidgetComponent = widgetComponent(widgetType);

  return (
    <div
      className={ classnames(
        'widget',
        {
          'dragging': isDragging,
        },
      )}
      style={{
        left: offset[0],
        top: offset[1],
      }}
    >
      <div className="widget-header">
        <button>=</button>
        <div className="widget-title" onMouseDown={ startDrag }>
          { keyName(props.ntkey) }
        </div>
        <button onClick={ () => props.closeWidget(props.ntkey) }>X</button>
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
  closeWidget: PropTypes.func.isRequired,
};
