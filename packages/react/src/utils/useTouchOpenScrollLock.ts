'use client';
import * as React from 'react';
import { useAnimationFrame } from '@base-ui/utils/useAnimationFrame';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import type { InteractionType } from '@base-ui/utils/useEnhancedClickHandler';

const VIEWPORT_WIDTH_TOLERANCE_PX = 20;

/**
 * Enables scroll lock for touch-open popups that effectively cover the full viewport width.
 */
export function useTouchOpenScrollLock(
  enabled: boolean,
  openMethod: InteractionType | null,
  positionerElement: HTMLElement | null,
) {
  const [touchOpenShouldLockScroll, setTouchOpenShouldLockScroll] = React.useState(false);
  const touchOpen = openMethod === 'touch';
  const frame = useAnimationFrame();

  useIsoLayoutEffect(() => {
    if (!enabled || !touchOpen || positionerElement == null) {
      setTouchOpenShouldLockScroll(false);
      return undefined;
    }

    const element = positionerElement;

    function updateShouldLockScroll() {
      const availableWidth = Number.parseFloat(element.style.getPropertyValue('--available-width'));
      const popupWidth = element.offsetWidth;

      setTouchOpenShouldLockScroll(
        availableWidth > 0 && popupWidth > 0 && popupWidth >= availableWidth - VIEWPORT_WIDTH_TOLERANCE_PX,
      );
    }

    updateShouldLockScroll();
    frame.request(updateShouldLockScroll);

    return () => {
      frame.cancel();
    };
  }, [enabled, frame, positionerElement, touchOpen]);

  return enabled && (!touchOpen || touchOpenShouldLockScroll);
}
