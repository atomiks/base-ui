'use client';
import * as React from 'react';
import { useDialogRootContext } from '../root/DialogRootContext';
import { useButton } from '../../use-button/useButton';
import { useRenderElement } from '../../utils/useRenderElement';
import type {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { triggerOpenStateMapping } from '../../utils/popupStateMapping';
import { CLICK_TRIGGER_IDENTIFIER } from '../../utils/constants';
import { DialogHandle } from '../store/DialogHandle';
import { useTriggerDataForwarding } from '../../utils/popups';
import { useBaseUiId } from '../../utils/useBaseUiId';
import { useClick, useInteractions } from '../../floating-ui-react';

/**
 * A button that opens the dialog.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Dialog](https://base-ui.com/react/components/dialog)
 */
export const DialogTrigger = React.forwardRef(function DialogTrigger(
  componentProps: DialogTrigger.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const {
    render,
    className,
    disabled = false,
    nativeButton = true,
    id: idProp,
    payload,
    handle,
    ...elementProps
  } = componentProps;

  const dialogRootContext = useDialogRootContext(true);
  const store = handle?.store ?? dialogRootContext?.store;
  if (!store) {
    throw new Error(
      'Base UI: <Dialog.Trigger> must be used within <Dialog.Root> or provided with a handle.',
    );
  }

  const thisTriggerId = useBaseUiId(idProp);
  const floatingContext = store.useState('floatingRootContext');
  const isOpenedByThisTrigger = store.useState('isOpenedByTrigger', thisTriggerId);

  const triggerElementRef = React.useRef<HTMLElement | null>(null);

  const { registerTrigger, isMountedByThisTrigger } = useTriggerDataForwarding(
    thisTriggerId,
    triggerElementRef,
    store,
    {
      payload,
    },
  );

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
  });

  const click = useClick(floatingContext, { enabled: floatingContext != null });

  const localInteractionProps = useInteractions([click]);

  const state: DialogTrigger.State = React.useMemo(
    () => ({
      disabled,
      open: isOpenedByThisTrigger,
    }),
    [disabled, isOpenedByThisTrigger],
  );

  const rootTriggerProps = store.useState('triggerProps', isMountedByThisTrigger);

  return useRenderElement('button', componentProps, {
    state,
    ref: [buttonRef, forwardedRef, registerTrigger, triggerElementRef],
    props: [
      localInteractionProps.getReferenceProps(),
      rootTriggerProps,
      { [CLICK_TRIGGER_IDENTIFIER as string]: '', id: thisTriggerId },
      elementProps as React.ComponentPropsWithoutRef<'button'>,
      getButtonProps,
    ],
    stateAttributesMapping: triggerOpenStateMapping,
  });
}) as DialogTrigger;

export interface DialogTrigger {
  <Payload>(
    componentProps: DialogTriggerProps<Payload> & React.RefAttributes<HTMLElement>,
  ): React.JSX.Element;
}

interface DialogTriggerCommonProps<Payload = unknown> {
  /**
   * A handle to associate the trigger with a dialog.
   * Can be created with the Dialog.createHandle() method.
   */
  handle?: DialogHandle<Payload>;
  /**
   * A payload to pass to the dialog when it is opened.
   */
  payload?: Payload;
  /**
   * ID of the trigger. In addition to being forwarded to the rendered element,
   * it is also used to specify the active trigger for the dialogs in controlled mode (with the DialogRoot `triggerId` prop).
   */
  id?: string;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled?: boolean;
}

interface DialogTriggerNativeProps<Payload = unknown>
  extends
    NativeButtonProps,
    BaseUIComponentProps<'button', DialogTrigger.State>,
    DialogTriggerCommonProps<Payload> {
  nativeButton?: true;
}

interface DialogTriggerNonNativeProps<Payload = unknown>
  extends
    NonNativeButtonProps,
    GenericHTMLProps<DialogTrigger.State>,
    DialogTriggerCommonProps<Payload> {
  nativeButton: false;
}

export type DialogTriggerProps<Payload = unknown> =
  | DialogTriggerNativeProps<Payload>
  | DialogTriggerNonNativeProps<Payload>;

export interface DialogTriggerState {
  /**
   * Whether the dialog is currently disabled.
   */
  disabled: boolean;
  /**
   * Whether the dialog is currently open.
   */
  open: boolean;
}

export namespace DialogTrigger {
  export type Props<Payload = unknown> = DialogTriggerProps<Payload>;
  export type State = DialogTriggerState;
}
