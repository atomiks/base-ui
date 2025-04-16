'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { tabbable as tabbableUtils } from '@floating-ui/react/utils';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { useEnhancedEffect } from '../../utils/useEnhancedEffect';
import type { TransitionStatus } from '../../utils/useTransitionStatus';
import { mergeProps } from '../../merge-props';
import { transitionStatusMapping } from '../../utils/styleHookMapping';
import { useBaseUiId } from '../../utils/useBaseUiId';
import { FocusGuard } from '../../toast/viewport/FocusGuard';
import { FocusableElement, tabbable } from 'tabbable';
import { ownerDocument } from '../../utils/owner';

/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuPopup = React.forwardRef(function NavigationMenuPopup(
  componentProps: NavigationMenuPopup.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, id: idProp, ...elementProps } = componentProps;

  const {
    anchor,
    open,
    transitionStatus,
    popupElement,
    positionerElement,
    setPopupElement,
    value,
  } = useNavigationMenuRootContext();

  const id = useBaseUiId(idProp);

  const state: NavigationMenuPopup.State = React.useMemo(
    () => ({
      open,
      transitionStatus,
    }),
    [open, transitionStatus],
  );

  useEnhancedEffect(() => {
    if (!popupElement || !positionerElement || !value) {
      return undefined;
    }

    const currentWidth = popupElement.offsetWidth;
    const currentHeight = popupElement.offsetHeight;
    popupElement.style.removeProperty('--popup-width');
    popupElement.style.removeProperty('--popup-height');
    const nextWidth = popupElement.offsetWidth;
    const nextHeight = popupElement.offsetHeight;
    popupElement.style.setProperty('--popup-width', `${currentWidth}px`);
    popupElement.style.setProperty('--popup-height', `${currentHeight}px`);
    positionerElement.style.setProperty('--positioner-width', `${nextWidth}px`);
    positionerElement.style.setProperty('--positioner-height', `${nextHeight}px`);

    const frame = requestAnimationFrame(() => {
      popupElement.style.setProperty('--popup-width', `${nextWidth}px`);
      popupElement.style.setProperty('--popup-height', `${nextHeight}px`);
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [positionerElement, popupElement, value]);

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, setPopupElement],
    props: mergeProps<'div'>(
      {
        id,
        tabIndex: -1,
        onFocus(event) {
          if (event.currentTarget !== event.target || !popupElement) {
            return;
          }
          const tabbableElements = tabbable(popupElement).reverse();
          const popupTabbable = tabbableElements[0] || popupElement;
          popupTabbable?.focus();
        },
      },
      elementProps,
    ),
    customStyleHookMapping: transitionStatusMapping,
  });

  return (
    <React.Fragment>
      <FocusGuard
        onFocus={() => {
          anchor?.focus({ preventScroll: true });
          if (popupElement) {
            tabbableUtils.enableFocusInside(popupElement);
          }
        }}
      />
      {renderElement()}
      <FocusGuard
        onFocus={() => {
          const tabbableElements = tabbable(ownerDocument(anchor).body);
          const index = tabbableElements.indexOf(anchor as FocusableElement);
          const nextElement = tabbableElements[index + 2] || anchor;
          nextElement?.focus({ preventScroll: true });
        }}
      />
    </React.Fragment>
  );
});

namespace NavigationMenuPopup {
  export interface State {
    /**
     * If `true`, the popup is open.
     */
    open: boolean;
    /**
     * The transition status of the popup.
     */
    transitionStatus: TransitionStatus;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

NavigationMenuPopup.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { NavigationMenuPopup };
