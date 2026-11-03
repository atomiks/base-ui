'use client';
import * as React from 'react';

/**
 * Whether the popup is mounted, from `Select.Positioner`'s single store subscription. The parts
 * inside read it here rather than each subscribing to the store, which adds up for long lists.
 * `null` outside a positioner, where parts render as they would in an open popup.
 */
export const SelectPositionerMountedContext = React.createContext<boolean | null>(null);

export function useSelectPositionerMounted() {
  return React.useContext(SelectPositionerMountedContext);
}
