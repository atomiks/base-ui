'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { FloatingPortal } from '@floating-ui/react';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { useComponentRenderer } from '../../utils/useComponentRenderer';
import { HTMLElementType } from '../../utils/proptypes';
import { usePopoverBackdrop } from './usePopoverBackdrop';
import type { BaseUIComponentProps } from '../../utils/types';
import { type CustomStyleHookMapping } from '../../utils/getStyleHookProps';
import { popupOpenStateMapping as baseMapping } from '../../utils/popupOpenStateMapping';
import type { TransitionStatus } from '../../utils/useTransitionStatus';

const customStyleHookMapping: CustomStyleHookMapping<PopoverBackdrop.State> = {
  ...baseMapping,
  transitionStatus(value) {
    if (value === 'entering') {
      return { 'data-starting-style': '' } as Record<string, string>;
    }
    if (value === 'exiting') {
      return { 'data-ending-style': '' };
    }
    return null;
  },
};

/**
 * Renders a backdrop for the popover.
 *
 * Demos:
 *
 * - [Popover](https://base-ui.com/components/react-popover/)
 *
 * API:
 *
 * - [PopoverBackdrop API](https://base-ui.com/components/react-popover/#api-reference-PopoverBackdrop)
 */
const PopoverBackdrop = React.forwardRef(function PopoverBackdrop(
  props: PopoverBackdrop.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { className, render, keepMounted = false, container, ...otherProps } = props;

  const { open, mounted, transitionStatus } = usePopoverRootContext();

  const { getBackdropProps } = usePopoverBackdrop();

  const state = React.useMemo(
    () => ({
      open,
      transitionStatus,
    }),
    [open, transitionStatus],
  );

  const { renderElement } = useComponentRenderer({
    propGetter: getBackdropProps,
    render: render ?? 'div',
    className,
    state,
    ref: forwardedRef,
    extraProps: otherProps,
    customStyleHookMapping,
  });

  const shouldRender = keepMounted || mounted;
  if (!shouldRender) {
    return null;
  }

  return <FloatingPortal root={container}>{renderElement()}</FloatingPortal>;
});

namespace PopoverBackdrop {
  export interface State {
    open: boolean;
    transitionStatus: TransitionStatus;
  }

  export interface Props extends BaseUIComponentProps<'div', State> {
    /**
     * If `true`, the backdrop remains mounted when the popover content is closed.
     * @default false
     */
    keepMounted?: boolean;
    /**
     * The container element to which the backdrop is appended to.
     * @default false
     */
    container?: HTMLElement | null | React.MutableRefObject<HTMLElement | null>;
  }
}

PopoverBackdrop.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node,
  /**
   * Class names applied to the element or a function that returns them based on the component's state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  /**
   * The container element to which the backdrop is appended to.
   * @default false
   */
  container: PropTypes /* @typescript-to-proptypes-ignore */.oneOfType([
    HTMLElementType,
    PropTypes.func,
  ]),
  /**
   * If `true`, the backdrop remains mounted when the popover content is closed.
   * @default false
   */
  keepMounted: PropTypes.bool,
  /**
   * A function to customize rendering of the component.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
} as any;

export { PopoverBackdrop };
