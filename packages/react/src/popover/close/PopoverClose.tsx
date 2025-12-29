'use client';
import * as React from 'react';
import type {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { usePopoverRootContext } from '../root/PopoverRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import { useButton } from '../../use-button';
import { createChangeEventDetails } from '../../utils/createBaseUIEventDetails';
import { REASONS } from '../../utils/reasons';

/**
 * A button that closes the popover.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Popover](https://base-ui.com/react/components/popover)
 */
export const PopoverClose = React.forwardRef(function PopoverClose(
  props: PopoverClose.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const { render, className, disabled = false, nativeButton = true, ...elementProps } = props;

  const { buttonRef, getButtonProps } = useButton({
    disabled,
    focusableWhenDisabled: false,
    native: nativeButton,
  });

  const { store } = usePopoverRootContext();

  const element = useRenderElement('button', props, {
    ref: [forwardedRef, buttonRef],
    props: [
      {
        onClick(event) {
          store.setOpen(
            false,
            createChangeEventDetails(REASONS.closePress, event.nativeEvent, event.currentTarget),
          );
        },
      },
      elementProps as React.ComponentPropsWithoutRef<'button'>,
      getButtonProps,
    ],
  });

  return element;
});

export interface PopoverCloseState {}

interface PopoverCloseNativeProps
  extends NativeButtonProps, BaseUIComponentProps<'button', PopoverClose.State> {
  nativeButton?: true;
}

interface PopoverCloseNonNativeProps
  extends NonNativeButtonProps, GenericHTMLProps<PopoverClose.State> {
  nativeButton: false;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled?: boolean;
}

export type PopoverCloseProps = PopoverCloseNativeProps | PopoverCloseNonNativeProps;

export namespace PopoverClose {
  export type State = PopoverCloseState;
  export type Props = PopoverCloseProps;
}
