import React, { useState } from 'react';

import { Widget } from '/components/widgets/Widget';

export function WidgetCanvas() {
  const [widgetKeys, setWidgetKeys] = useState({
    '/SmartDashboard/robotTime': true,
  });

  return (
    <div className="widget-canvas">
      { Object.keys(widgetKeys).map(key => (
        <Widget key={ key } ntkey={ key } />
      )) }
    </div>
  );
}
