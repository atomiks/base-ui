'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import type { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import { useNavigationMenuRootContext } from '../root/NavigationMenuRootContext';
import { useEnhancedEffect } from '../../utils';
import { mergeProps } from '../../merge-props';
/**
 *
 * Documentation: [Base UI Navigation Menu](https://base-ui.com/react/components/navigation-menu)
 */
const NavigationMenuPopup = React.forwardRef(function NavigationMenuPopup(
  componentProps: NavigationMenuPopup.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, ...elementProps } = componentProps;

  const { popupElement, positionerElement, setPopupElement, value } =
    useNavigationMenuRootContext();

  const prevRectRef = React.useRef<DOMRect | null>(null);

  useEnhancedEffect(() => {
    if (!popupElement || !positionerElement || !value) {
      return;
    }

    const nextRect = popupElement.getBoundingClientRect();
    const prevRect = prevRectRef.current || nextRect;
    prevRectRef.current = nextRect;

    popupElement.style.setProperty('--popup-width', `${prevRect.width}px`);
    popupElement.style.setProperty('--popup-height', `${prevRect.height}px`);
    positionerElement.style.setProperty('--positioner-width', `${nextRect.width}px`);
    positionerElement.style.setProperty('--positioner-height', `${nextRect.height}px`);

    requestAnimationFrame(() => {
      popupElement.style.setProperty('--popup-width', `${nextRect.width}px`);
      popupElement.style.setProperty('--popup-height', `${nextRect.height}px`);
    });
  }, [positionerElement, popupElement, value]);

  const renderElement = useRenderElement('div', componentProps, {
    ref: [forwardedRef, setPopupElement],
    props: mergeProps<'div'>(
      {
        style: {
          // position: 'absolute',
          // zIndex: 1,
          // top: 0,
          // left: 0,
          overflow: 'hidden',
        },
      },
      elementProps,
    ),
  });

  return renderElement();
});

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

namespace NavigationMenuPopup {
  export interface State {}

  export interface Props extends BaseUIComponentProps<'div', State> {}
}

export { NavigationMenuPopup };
