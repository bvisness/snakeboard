import React, { useState, useEffect, useRef } from 'react';
import classnames from 'classnames';

import { SimpleNumber } from '/components/widgets/SimpleNumber';

import { keyName } from '/util/keys';

const typeToWidget = {
  SimpleNumber: SimpleNumber,
};

export function Widget(props) {
  const [widgetType, setWidgetType] = useState('SimpleNumber');
  
  const [isDragging, _setIsDraggingState] = useState(false);
  const [offset, setOffset] = useState([0, 0]);
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

  const WidgetType = typeToWidget[widgetType];

  return (
    <div
      className={ classnames(
        'widget',
        {
          'dragging': isDragging,
        },
      )}
      onMouseDown={ startDrag }
      style={{
        left: offset[0],
        top: offset[1],
      }}
    >
      <div className="widget-header">
        <button>=</button>
        <div className="widget-title">
          { keyName(props.ntkey) }
        </div>
        <button>X</button>
      </div>
      <div className="widget-body">
        { WidgetType
          ? <WidgetType ntkey={ props.ntkey } />
          : 'ERROR!'
        }
      </div>
    </div>
  );
}
