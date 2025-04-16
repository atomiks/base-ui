'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import {
  safePolygon,
  useClick,
  useDismiss,
  useFloatingRootContext,
  useHover,
  useInteractions,
} from '@floating-ui/react';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuItemContext } from '../item/NavigationMenuItemContext';
import { mergeProps } from '../../merge-props';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { useEventCallback } from '../../utils/useEventCallback';
import { translateOpenChangeReason } from '../../utils/translateOpenChangeReason';
import { PATIENT_CLICK_THRESHOLD } from '../../utils/constants';
import { FocusGuard } from '../../toast/viewport/FocusGuard';
import { visuallyHidden } from '../../utils';
import { tabbable } from 'tabbable';

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
    popupElement,
    currentContentRef,
  } = useNavigationMenuRootContext();
  const value = useNavigationMenuItemContext();

  const timeoutRef = React.useRef(-1);
  const stickIfOpenTimeoutRef = React.useRef(-1);

  const [triggerElement, setTriggerElement] = React.useState<HTMLElement | null>(null);
  const [stickIfOpen, setStickIfOpen] = React.useState(true);

  React.useEffect(() => {
    clearTimeout(timeoutRef.current);
  }, [contextValue]);

  const clearStickIfOpenTimeout = useEventCallback(() => {
    clearTimeout(stickIfOpenTimeoutRef.current);
  });

  React.useEffect(() => {
    if (!open) {
      clearStickIfOpenTimeout();
    }
  }, [clearStickIfOpenTimeout, open]);

  React.useEffect(() => {
    return clearStickIfOpenTimeout;
  }, [clearStickIfOpenTimeout]);

  const context = useFloatingRootContext({
    open,
    onOpenChange(openValue, eventValue, reasonValue) {
      const isHover = reasonValue === 'hover' || reasonValue === 'safe-polygon';

      if (!openValue && anchor && anchor !== triggerElement) {
        return;
      }

      function changeState() {
        setOpen(openValue, eventValue, translateOpenChangeReason(reasonValue));
      }

      if (isHover) {
        // Only allow "patient" clicks to close the popup if it's open.
        // If they clicked within 500ms of the popup opening, keep it open.
        setStickIfOpen(true);
        clearStickIfOpenTimeout();
        stickIfOpenTimeoutRef.current = window.setTimeout(() => {
          setStickIfOpen(false);
        }, PATIENT_CLICK_THRESHOLD);

        ReactDOM.flushSync(changeState);
      } else {
        changeState();
      }

      setOpen(openValue);

      if (openValue) {
        setValue(value);
      } else if (!openValue) {
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
    delay: { close: 100 },
  });
  const click = useClick(context, {
    stickIfOpen,
    toggle: anchor === triggerElement,
  });
  const dismiss = useDismiss(context);

  const { getReferenceProps } = useInteractions([hover, click, dismiss]);

  const handleOpenEvent = useEventCallback(() => {
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
  });

  const renderElement = useRenderElement('button', componentProps, {
    ref: [forwardedRef, setTriggerElement],
    props: mergeProps<'button'>(
      getReferenceProps,
      {
        onMouseEnter: handleOpenEvent,
        onClick: handleOpenEvent,
      },
      elementProps,
    ),
  });

  return (
    <React.Fragment>
      {renderElement()}
      {anchor === triggerElement && open && (
        <React.Fragment>
          <FocusGuard
            onFocus={() => {
              if (!currentContentRef.current) {
                return;
              }

              const popupTabbable = tabbable(currentContentRef.current)[0] || popupElement;
              popupTabbable?.focus();
            }}
          />
          <span aria-owns={popupElement?.id} style={visuallyHidden} />
        </React.Fragment>
      )}
    </React.Fragment>
  );
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
