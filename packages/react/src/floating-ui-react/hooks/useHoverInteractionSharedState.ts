'use client';
import { useOnMount } from '@base-ui/utils/useOnMount';
import { useRefWithInit } from '@base-ui/utils/useRefWithInit';
import { Timeout } from '@base-ui/utils/useTimeout';

import type { ContextData, FloatingRootContext, SafePolygonOptions } from '../types';
import { createAttribute } from '../utils/createAttribute';
import { TYPEABLE_SELECTOR } from '../utils/constants';

export const safePolygonIdentifier = createAttribute('safe-polygon');
const interactiveSelector = `button,a,[role="button"],select,[tabindex]:not([tabindex="-1"]),${TYPEABLE_SELECTOR}`;

export function isInteractiveElement(element: Element | null) {
  return element ? Boolean(element.closest(interactiveSelector)) : false;
}

export interface HoverInteraction {
  pointerType: string | undefined;
  interactedInside: boolean;
  handler: ((event: MouseEvent) => void) | undefined;
  blockMouseMove: boolean;
  performedPointerEventsMutation: boolean;
  unbindMouseMove: () => void;
  restTimeoutPending: boolean;
  openChangeTimeout: Timeout;
  restTimeout: Timeout;
  handleCloseOptions: SafePolygonOptions | undefined;
  dispose: () => void;
}

function createHoverInteraction(): HoverInteraction {
  const openChangeTimeout = new Timeout();
  const restTimeout = new Timeout();

  return {
    pointerType: undefined,
    interactedInside: false,
    handler: undefined,
    blockMouseMove: true,
    performedPointerEventsMutation: false,
    unbindMouseMove: () => {},
    restTimeoutPending: false,
    openChangeTimeout,
    restTimeout,
    handleCloseOptions: undefined,
    dispose() {
      openChangeTimeout.clear();
      restTimeout.clear();
    },
  };
}

type HoverContextData = ContextData & {
  hoverInteractionState?: HoverInteraction | undefined;
};

export function useHoverInteractionSharedState(store: FloatingRootContext): HoverInteraction {
  const instance = useRefWithInit(createHoverInteraction).current;

  const data = store.context.dataRef.current as HoverContextData;
  if (!data.hoverInteractionState) {
    data.hoverInteractionState = instance;
  }

  useOnMount(() => data.hoverInteractionState?.dispose);

  return data.hoverInteractionState;
}
