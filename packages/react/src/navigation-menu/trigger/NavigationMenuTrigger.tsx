'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { safePolygon, useFloating, useHover, useInteractions } from '@floating-ui/react';
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
    open,
    setOpen,
    setAnchor,
    positionerElement,
    popupElement,
    anchor,
  } = useNavigationMenuRootContext();
  const value = useNavigationMenuItemContext();

  const timeoutRef = React.useRef(-1);

  React.useEffect(() => {
    clearTimeout(timeoutRef.current);
  }, [contextValue]);

  const { context, refs } = useFloating<HTMLElement>({
    open,
    onOpenChange(nextOpen) {
      if (!nextOpen && anchor && anchor !== refs.domReference.current) {
        return;
      }

      setOpen(nextOpen);
      setValue(value);

      if (refs.domReference.current) {
        setAnchor(refs.domReference.current);
      }
    },
    elements: {
      floating: positionerElement,
    },
  });

  const hover = useHover(context, {
    restMs: open ? 0 : 100,
    move: false,
    handleClose: safePolygon(),
  });

  const { getReferenceProps } = useInteractions([hover]);

  const renderElement = useRenderElement('button', componentProps, {
    ref: [forwardedRef, refs.setReference],
    props: mergeProps<'button'>(
      getReferenceProps,
      {
        onMouseEnter() {
          if (open) {
            popupElement?.style.removeProperty('--popup-width');
            popupElement?.style.removeProperty('--popup-height');
            positionerElement?.style.removeProperty('--positioner-width');
            positionerElement?.style.removeProperty('--positioner-height');

            ReactDOM.flushSync(() => {
              setValue(value);
              setOpen(true);
              setAnchor(refs.domReference.current);
            });
          }
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
