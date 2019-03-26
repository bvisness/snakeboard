import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DropTarget } from 'react-dnd'

import { DragItemTypes } from '/util/constants';
import { Widget } from '/components/widgets/Widget';

const WidgetDropTarget = DropTarget(
  DragItemTypes.TreeItem,
  {
    drop(props, monitor) {
      props.addWidget(monitor.getItem().key);
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
  const [widgetKeys, setWidgetKeys] = useState({});

  function addWidget(key) {
    setWidgetKeys({[key]: true, ...widgetKeys});
  }

  function closeWidget(key) {
    const {[key]: undefined, ...newKeys} = widgetKeys;
    setWidgetKeys(newKeys);
  }

  return (
    <div className="widget-canvas">
      { Object.keys(widgetKeys).map(key => (
        <Widget
          key={ key }
          ntkey={ key }
          closeWidget={ closeWidget }
        />
      )) }
      <WidgetDropTarget addWidget={ addWidget } />
    </div>
  );
}
