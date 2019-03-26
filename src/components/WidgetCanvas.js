import React, { useState } from 'react';

import { Widget } from '/components/widgets/Widget';

export function WidgetCanvas() {
  const [widgetKeys, setWidgetKeys] = useState({
    '/SmartDashboard/robotTime': true,
  });

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
    </div>
  );
}
