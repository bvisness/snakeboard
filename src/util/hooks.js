import React, { useState, useRef } from 'react';

export function useStableState(defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const valueRef = useRef(defaultValue);

  return [
    value,
    newValue => {
      if (typeof newValue === 'function') {
        newValue = newValue(valueRef.current);
      }

      valueRef.current = newValue;
      setValue(newValue);
    },
    () => valueRef.current,
  ];
}
