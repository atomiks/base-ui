'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { NavigationMenuRootContext } from './NavigationMenuRootContext';
import { useControlled, useTransitionStatus } from '../../utils';
import type { OpenChangeReason } from '../../utils/translateOpenChangeReason';
import { useOpenChangeComplete } from '../../utils/useOpenChangeComplete';
import { useEventCallback } from '../../utils/useEventCallback';

/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuRoot = React.forwardRef(function NavigationMenuRoot(
  componentProps: NavigationMenuRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    open: openParam,
    defaultOpen = false,
    onOpenChange,
    onOpenChangeComplete,
    defaultValue,
    value: valueParam,
    onValueChange,
    ...elementProps
  } = componentProps;

  const [open, setOpenUnwrapped] = useControlled({
    controlled: openParam,
    default: defaultOpen,
    name: 'NavigationMenu',
    state: 'open',
  });

  const [value, setValueUnwrapped] = useControlled({
    controlled: valueParam,
    default: defaultValue,
    name: 'NavigationMenu',
    state: 'value',
  });

  const setOpen = useEventCallback(
    (nextOpen: boolean, event?: Event, reason?: OpenChangeReason) => {
      onOpenChange?.(nextOpen, event, reason);
      setOpenUnwrapped(nextOpen);
    },
  );

  const setValue = useEventCallback((nextValue: any) => {
    onValueChange?.(nextValue);
    setValueUnwrapped(nextValue);
  });

  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [positionerElement, setPositionerElement] = React.useState<HTMLElement | null>(null);
  const [popupElement, setPopupElement] = React.useState<HTMLElement | null>(null);
  const [activationDirection, setActivationDirection] = React.useState<'left' | 'right' | null>(
    null,
  );

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

  if (!mounted && activationDirection !== null) {
    setActivationDirection(null);
  }

  const handleUnmount = useEventCallback(() => {
    setMounted(false);
    onOpenChangeComplete?.(false);
  });

  useOpenChangeComplete({
    enabled: !componentProps.actionsRef,
    open,
    ref: { current: popupElement },
    onComplete() {
      if (!open) {
        handleUnmount();
      }
    },
  });

  const renderElement = useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: elementProps,
  });

  const contextValue: NavigationMenuRootContext = React.useMemo(
    () => ({
      open,
      setOpen,
      value,
      setValue,
      mounted,
      transitionStatus,
      positionerElement,
      setPositionerElement,
      popupElement,
      setPopupElement,
      anchor,
      setAnchor,
      activationDirection,
      setActivationDirection,
    }),
    [
      open,
      setOpen,
      value,
      setValue,
      mounted,
      transitionStatus,
      positionerElement,
      setPositionerElement,
      popupElement,
      anchor,
      activationDirection,
      setActivationDirection,
    ],
  );

  return (
    <NavigationMenuRootContext.Provider value={contextValue}>
      {renderElement()}
    </NavigationMenuRootContext.Provider>
  );
});

NavigationMenuRoot.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * A ref to imperative actions.
   */
  actionsRef: PropTypes.shape({
    current: PropTypes.shape({
      unmount: PropTypes.func.isRequired,
    }).isRequired,
  }),
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
   * Whether the menu is initially open.
   *
   * To render a controlled menu, use the `open` prop instead.
   * @default false
   */
  defaultOpen: PropTypes.bool,
  /**
   * Event handler called when the menu is opened or closed.
   */
  onOpenChange: PropTypes.func,
  /**
   * Event handler called after any animations complete when the menu is closed.
   */
  onOpenChangeComplete: PropTypes.func,
  /**
   * Whether the menu is currently open.
   */
  open: PropTypes.bool,
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

namespace NavigationMenuRoot {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * A ref to imperative actions.
     */
    actionsRef?: React.RefObject<{ unmount: () => void }>;
    /**
     * Whether the menu is currently open.
     */
    open?: boolean;
    /**
     * Whether the menu is initially open.
     *
     * To render a controlled menu, use the `open` prop instead.
     * @default false
     */
    defaultOpen?: boolean;
    /**
     * Event handler called when the menu is opened or closed.
     */
    onOpenChange?: (open: boolean, event?: Event, reason?: OpenChangeReason) => void;
    /**
     * Event handler called after any animations complete when the menu is closed.
     */
    onOpenChangeComplete?: (open: boolean) => void;

    /**
     * The controlled value of the navigation menu item that should be currently selected.
     *
     * To render an uncontrolled navigation menu, use the `defaultValue` prop instead.
     */
    value?: any;
    /**
     * The uncontrolled value of the item that should be initially selected.
     *
     * To render a controlled navigation menu, use the `value` prop instead.
     */
    defaultValue?: any;
    /**
     * Callback fired when the value changes.
     */
    onValueChange?: (value: any) => void;
  }
}

export { NavigationMenuRoot };
