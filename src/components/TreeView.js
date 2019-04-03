import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { DragSource } from 'react-dnd'

import { NTContext } from '/context/NTContext';

import { keyName } from '/util/keys';
import { DragItemTypes } from '/util/constants';

const itemSource = {
  beginDrag(props) {
    return {
      key: props.ntkey,
    };
  },
};

function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  }
}

function _treeItem(props) {
  return props.connectDragSource(
    <li className="tree-item">
      <div className="tree-item-title">{ keyName(props.ntkey) }</div>
      <div className="tree-preview">{ props.ntvalue + '' }</div>
    </li>
  );
}
const TreeItem = DragSource(DragItemTypes.TreeItem, itemSource, collect)(_treeItem);
TreeItem.propTypes = {
  ntkey: PropTypes.string.isRequired,
  ntvalue: PropTypes.any,
};

function TreeList(props) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ul className={ classnames('tree-list', props.className) }>
      { Object.keys(props.subkeys).map(key => {
        if (typeof props.subkeys[key] === 'object') {
          return (
            <li key={ key } className={ classnames('tree-list-parent', { collapsed: collapsed }) }>
              { keyName(key) }
              <div className="toggle" onClick={ () => setCollapsed(!collapsed) } />
              <TreeList
                ntkey={ key }
                subkeys={ props.subkeys[key] }
              />
            </li>
          );
        } else {
          return (
            <TreeItem key={ key } ntkey={ key } ntvalue={ props.subkeys[key] } />
          );
        }
      }) }
    </ul>
  );
}
TreeList.propTypes = {
  ntkey: PropTypes.string.isRequired,
  subkeys: PropTypes.object.isRequired,
};

export function TreeView() {
  const ntdata = useContext(NTContext);

  const [open, setOpen] = useState(false);

  function buildList(data) {
    const keys = Object.keys(data).sort();

    const nested = {};
    for (const key of keys) {
      const segments = key.split('/');

      let currentKey = '';
      let currentObject = nested;

      for (let i = 1; i < segments.length; i++) {
        // skip the empty string at the beginning.
        
        const segment = segments[i];
        currentKey += '/' + segment;

        if (i < segments.length - 1) {
          // table
          if (!currentObject[currentKey]) {
            currentObject[currentKey] = {};
          }
          currentObject = currentObject[currentKey];
        } else {
          // value
          currentObject[currentKey] = data[currentKey];
        }
      }
    }

    return <TreeList ntkey="" subkeys={ nested } />;
  }

  return (
    <div className={ classnames('tree-view', { open: open }) }>
      <div className="list-drawer">
        <div className="list-container">
          { buildList(ntdata) }
        </div>
      </div>
      <div className="handle" onClick={ () => setOpen(!open) }>
        <div className="handle-label">
          Open / Close
        </div>
      </div>
    </div>
  );
}
