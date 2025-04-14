'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { useFloating, useHover, useInteractions } from '@floating-ui/react';
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

  const { setValue, open, setOpen, setAnchor, positionerElement } = useNavigationMenuRootContext();
  const value = useNavigationMenuItemContext();

  const { context, refs } = useFloating({
    open,
    onOpenChange(nextOpen, event) {
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

  const hover = useHover(context, { restMs: 100, move: false });

  const { getReferenceProps } = useInteractions([hover]);

  const renderElement = useRenderElement('button', componentProps, {
    ref: [forwardedRef, refs.setReference],
    props: mergeProps<'button'>(getReferenceProps, elementProps),
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
