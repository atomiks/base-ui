'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { mergeProps } from '../../merge-props';
import { TransitionStatus, useTransitionStatus } from '../../utils/useTransitionStatus';
import { useOpenChangeComplete } from '../../utils/useOpenChangeComplete';
import { transitionStatusMapping } from '../../utils/styleHookMapping';

/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuContent = React.forwardRef(function NavigationMenuContent(
  componentProps: NavigationMenuContent.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...elementProps } = componentProps;

  const { popupElement, value, activationDirection } = useNavigationMenuRootContext();
  const itemValue = useNavigationMenuItemContext();

  const open = value === itemValue;

  const ref = React.useRef<HTMLDivElement | null>(null);

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

  useOpenChangeComplete({
    ref,
    open,
    onComplete() {
      if (!open) {
        setMounted(false);
      }
    },
  });

  const state: NavigationMenuContent.State = React.useMemo(
    () => ({
      open,
      transitionStatus,
      activationDirection,
    }),
    [open, transitionStatus, activationDirection],
  );

  const renderElement = useRenderElement('div', componentProps, {
    state,
    ref: [forwardedRef, ref],
    props: mergeProps<'div'>(
      !open && mounted
        ? {
            style: { position: 'absolute', top: 0, left: 0 },
          }
        : {},
      elementProps,
    ),
    customStyleHookMapping: {
      ...transitionStatusMapping,
      activationDirection(value) {
        if (value === 'left') {
          return { 'data-activation-direction': 'left' };
        }
        if (value === 'right') {
          return { 'data-activation-direction': 'right' };
        }
        return null;
      },
    },
  });

  if (!popupElement || !mounted) {
    return null;
  }

  return ReactDOM.createPortal(renderElement(), popupElement);
});

namespace NavigationMenuContent {
  export interface State {
    /**
     * If `true`, the component is open.
     */
    open: boolean;
    /**
     * The transition status of the component.
     */
    transitionStatus: TransitionStatus;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

NavigationMenuContent.propTypes /* remove-proptypes */ = {
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

export { NavigationMenuContent };
