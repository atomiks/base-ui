'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuPositioner } from './useNavigationMenuPositioner';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { useNavigationMenuPortalContext } from '../portal/NavigationMenuPortalContext';
import { mergeProps } from '../../merge-props';

/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuPositioner = React.forwardRef(function NavigationMenuPositioner(
  componentProps: NavigationMenuPositioner.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    className,
    render,
    anchor,
    positionMethod = 'absolute',
    side = 'bottom',
    align = 'center',
    sideOffset = 0,
    alignOffset = 0,
    collisionBoundary = 'clipping-ancestors',
    collisionPadding = 5,
    arrowPadding = 5,
    sticky = false,
    trackAnchor = true,
    ...elementProps
  } = componentProps;

  const {
    open,
    mounted,
    positionerElement,
    setPositionerElement,
    anchor: triggerAnchor,
    floatingRootContext,
  } = useNavigationMenuRootContext();
  const keepMounted = useNavigationMenuPortalContext();

  const positioning = useNavigationMenuPositioner({
    anchor: anchor ?? triggerAnchor,
    positionMethod,
    mounted,
    open,
    side,
    sideOffset,
    align,
    alignOffset,
    arrowPadding,
    collisionBoundary,
    collisionPadding,
    sticky,
    trackAnchor,
    keepMounted,
    floatingRootContext,
  });

  React.useEffect(() => {
    if (!positionerElement) {
      return undefined;
    }

    positionerElement.style.transition = 'none';

    if (!positioning.isPositioned) {
      return undefined;
    }

    const frame = requestAnimationFrame(() => {
      positionerElement.style.transition = '';
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [positioning.isPositioned, positionerElement]);

  const renderElement = useRenderElement('div', componentProps, {
    ref: [forwardedRef, setPositionerElement, positioning.refs.setFloating],
    props: mergeProps<'div'>(positioning.props, elementProps),
  });

  return renderElement();
});

NavigationMenuPositioner.propTypes /* remove-proptypes */ = {
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

namespace NavigationMenuPositioner {
  export interface State {}

  export interface Props
    extends useNavigationMenuPositioner.SharedParameters,
      BaseUIComponentProps<'div', State> {}
}

export { NavigationMenuPositioner };
