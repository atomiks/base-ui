'use client';
import * as React from 'react';
import { useButton } from '../use-button/useButton';
import { useRenderElement } from '../utils/useRenderElement';
import type {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../utils/types';

/**
 * A button component that can be used to trigger actions.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Button](https://base-ui.com/react/components/button)
 */
export const Button = React.forwardRef(function Button(
  componentProps: Button.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const {
    render,
    className,
    disabled: disabledProp = false,
    focusableWhenDisabled = false,
    nativeButton = true,
    ...elementProps
  } = componentProps;

  const disabled = Boolean(disabledProp);

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled,
    native: nativeButton,
  });

  const state: Button.State = React.useMemo(
    () => ({
      disabled,
    }),
    [disabled],
  );

  return useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [elementProps as React.ComponentPropsWithoutRef<'button'>, getButtonProps],
  });
});

export interface ButtonState {
  /**
   * Whether the button should ignore user interaction.
   */
  disabled: boolean;
}

interface ButtonCommonProps {
  /**
   * Whether the button should ignore user interaction.
   */
  disabled?: boolean;
  /**
   * Whether the button should be focusable when disabled.
   * @default false
   */
  focusableWhenDisabled?: boolean;
}

interface ButtonNativeProps
  extends
    NativeButtonProps,
    ButtonCommonProps,
    Omit<BaseUIComponentProps<'button', ButtonState>, 'disabled'> {
  nativeButton?: true;
}

interface ButtonNonNativeProps
  extends NonNativeButtonProps, ButtonCommonProps, Omit<GenericHTMLProps<ButtonState>, 'disabled'> {
  nativeButton: false;
}

export type ButtonProps = ButtonNativeProps | ButtonNonNativeProps;

export namespace Button {
  export type State = ButtonState;
  export type Props = ButtonProps;
}
