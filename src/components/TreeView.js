import React from 'react';
import { NTContext } from '/context/NTContext';

import { keyName } from '/util/keys';

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
          <li id={ key } key={ key }>
            { keyName(key) }
            { typeof obj[key] === 'object'
              ? objectToList(obj[key], key)
              : ': ' + obj[key]
            }
          </li>
        )) }
      </ul>
    );
  }

  return objectToList(nested, '');
}

export function TreeView() {
  return (
    <NTContext.Consumer>
      { ntdata => (
        <div>
          { buildList(ntdata) }
        </div>
      ) }
    </NTContext.Consumer>
  );
}
