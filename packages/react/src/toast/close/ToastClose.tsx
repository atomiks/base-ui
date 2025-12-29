'use client';
import * as React from 'react';
import type {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { useToastRootContext } from '../root/ToastRootContext';
import { useToastContext } from '../provider/ToastProviderContext';
import { useButton } from '../../use-button/useButton';
import { useRenderElement } from '../../utils/useRenderElement';

/**
 * Closes the toast when clicked.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Toast](https://base-ui.com/react/components/toast)
 */
export const ToastClose = React.forwardRef(function ToastClose(
  componentProps: ToastClose.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const { render, className, disabled, nativeButton = true, ...elementProps } = componentProps;

  const { close, expanded } = useToastContext();
  const { toast } = useToastRootContext();

  const [hasFocus, setHasFocus] = React.useState(false);

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
  });

  const state: ToastClose.State = React.useMemo(
    () => ({
      type: toast.type,
    }),
    [toast.type],
  );

  const element = useRenderElement('button', componentProps, {
    ref: [forwardedRef, buttonRef],
    state,
    props: [
      {
        'aria-hidden': !expanded && !hasFocus,
        onClick() {
          close(toast.id);
        },
        onFocus() {
          setHasFocus(true);
        },
        onBlur() {
          setHasFocus(false);
        },
      },
      elementProps as React.ComponentPropsWithoutRef<'button'>,
      getButtonProps,
    ],
  });

  return element;
});

export interface ToastCloseState {
  /**
   * The type of the toast.
   */
  type: string | undefined;
}

interface ToastCloseNativeProps
  extends NativeButtonProps, BaseUIComponentProps<'button', ToastClose.State> {
  nativeButton?: true;
}

interface ToastCloseNonNativeProps
  extends NonNativeButtonProps, GenericHTMLProps<ToastClose.State> {
  nativeButton: false;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled?: boolean;
}

export type ToastCloseProps = ToastCloseNativeProps | ToastCloseNonNativeProps;

export namespace ToastClose {
  export type State = ToastCloseState;
  export type Props = ToastCloseProps;
}
