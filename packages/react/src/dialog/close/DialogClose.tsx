'use client';
import * as React from 'react';
import { useDialogRootContext } from '../root/DialogRootContext';
import { useRenderElement } from '../../utils/useRenderElement';
import type {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { useButton } from '../../use-button';
import { createChangeEventDetails } from '../../utils/createBaseUIEventDetails';
import { REASONS } from '../../utils/reasons';

/**
 * A button that closes the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export const DialogClose = React.forwardRef(function DialogClose(
  componentProps: DialogClose.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const {
    render,
    className,
    disabled = false,
    nativeButton = true,
    ...elementProps
  } = componentProps;

  const { store } = useDialogRootContext();
  const open = store.useState('open');

  function handleClick(event: React.MouseEvent) {
    if (open) {
      store.setOpen(false, createChangeEventDetails(REASONS.closePress, event.nativeEvent));
    }
  }

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
  });

  const state: DialogClose.State = React.useMemo(() => ({ disabled }), [disabled]);

  return useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [
      { onClick: handleClick },
      elementProps as React.ComponentPropsWithoutRef<'button'>,
      getButtonProps,
    ],
  });
});

interface DialogCloseNativeProps
  extends NativeButtonProps, Omit<BaseUIComponentProps<'button', DialogClose.State>, 'disabled'> {
  nativeButton?: true;
  /**
   * Whether the button is currently disabled.
   * @default false
   */
  disabled?: boolean;
}

interface DialogCloseNonNativeProps
  extends NonNativeButtonProps, Omit<GenericHTMLProps<DialogClose.State>, 'disabled'> {
  nativeButton: false;
  /**
   * Whether the button is currently disabled.
   * @default false
   */
  disabled?: boolean;
}

export type DialogCloseProps = DialogCloseNativeProps | DialogCloseNonNativeProps;

export interface DialogCloseState {
  /**
   * Whether the button is currently disabled.
   */
  disabled: boolean;
}

export namespace DialogClose {
  export type Props = DialogCloseProps;
  export type State = DialogCloseState;
}
