import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { NTContext } from '/context/NTContext';

function widgetTypes(typeOfValue) {
  switch (typeOfValue) {
    case 'number':
      return [
        { component: 'SimpleText', name: 'Simple Text' },
      ];
    case 'boolean':
      return [
        { component: 'SimpleIndicator', name: 'Indicator' },
        { component: 'SimpleText', name: 'Simple Text' },
      ];
    default:
      return [
        { component: 'SimpleText', name: 'Simple Text' },
      ];
  }
}

export function WidgetMenu(props) {
  const ntdata = useContext(NTContext);

  return (
    <div
      className="widget-menu"
      style={{ left: props.position[0], top: props.position[1] }}
      onMouseUp={ e => e.stopPropagation() } 
    >
      <label htmlFor="widget-type">Type:</label>
      <select
        id="widget-type"
        value={ props.type }
        onChange={ event => props.setType(event.target.value) }
      >
        { widgetTypes(typeof ntdata[props.ntkey]).map(info => (
          <option key={ info.component } value={ info.component }>
            { info.name }
          </option>
        )) }
      </select>
    </div>
  );
}
WidgetMenu.propTypes = {
  ntkey: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  position: PropTypes.array.isRequired,
  setType: PropTypes.func.isRequired,
};
