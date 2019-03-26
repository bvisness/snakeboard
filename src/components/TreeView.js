import React, { useContext } from 'react';
import PropTypes from 'prop-types';
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
    <li>
      { keyName(props.ntkey) }
      { props.children }
    </li>
  );
}
const TreeItem = DragSource(DragItemTypes.TreeItem, itemSource, collect)(_treeItem);
TreeItem.propTypes = {
  ntkey: PropTypes.string.isRequired,
}

export function TreeView() {
  const ntdata = useContext(NTContext);

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

    function objectToList(obj, key) {
      return (
        <ul id={ key } key={ key }>
          { Object.keys(obj).map(key => (
            <TreeItem key={ key } ntkey={ key }>
              { typeof obj[key] === 'object'
                ? objectToList(obj[key], key)
                : ': ' + obj[key]
              }
            </TreeItem>
          )) }
        </ul>
      );
    }

    return objectToList(nested, '');
  }

  return (
    <div className="tree-view">
      { buildList(ntdata) }
    </div>
  );
}
