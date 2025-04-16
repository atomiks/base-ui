'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { safePolygon, useFloatingRootContext, useHover, useInteractions } from '@floating-ui/react';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { mergeProps } from '../../merge-props';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';

/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuTrigger = React.forwardRef(function NavigationMenuTrigger(
  componentProps: NavigationMenuTrigger.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const { className, render, ...elementProps } = componentProps;

  const {
    value: contextValue,
    setValue,
    mounted,
    open,
    setOpen,
    setAnchor,
    positionerElement,
    anchor,
    setActivationDirection,
    setFloatingRootContext,
  } = useNavigationMenuRootContext();
  const value = useNavigationMenuItemContext();

  const timeoutRef = React.useRef(-1);

  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    clearTimeout(timeoutRef.current);
  }, [contextValue]);

  const context = useFloatingRootContext({
    open,
    onOpenChange(nextOpen) {
      if (!nextOpen && anchor && anchor !== triggerElement) {
        return;
      }

      setOpen(nextOpen);

      if (nextOpen) {
        setValue(value);
      } else if (!nextOpen) {
        setActivationDirection(null);
        setValue(null);
      }
    },
    elements: {
      reference: triggerElement,
      floating: positionerElement,
    },
  });

  const hover = useHover(context, {
    move: false,
    handleClose: safePolygon(),
    restMs: 50,
  });

  const { getReferenceProps } = useInteractions([hover]);

  const renderElement = useRenderElement('button', componentProps, {
    ref: [forwardedRef, setTriggerElement],
    props: mergeProps<'button'>(
      getReferenceProps,
      {
        onMouseEnter() {
          positionerElement?.style.removeProperty('--positioner-width');
          positionerElement?.style.removeProperty('--positioner-height');

          const prevAnchorRect = anchor?.getBoundingClientRect();

          ReactDOM.flushSync(() => {
            if (mounted && prevAnchorRect && triggerElement) {
              const nextAnchorRect = triggerElement.getBoundingClientRect();
              const isMovingRight = nextAnchorRect.left > prevAnchorRect.left;
              if (nextAnchorRect.left !== prevAnchorRect.left) {
                setActivationDirection(isMovingRight ? 'right' : 'left');
              }
            }

            setFloatingRootContext(context);
            setValue(value);
            setAnchor(triggerElement);
          });
        },
      },
      elementProps,
    ),
  });

  return renderElement();
});

NavigationMenuTrigger.propTypes /* remove-proptypes */ = {
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

namespace NavigationMenuTrigger {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'button', State> {}
}

export { NavigationMenuTrigger };
