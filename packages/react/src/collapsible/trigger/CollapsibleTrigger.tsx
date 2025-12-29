'use client';
import * as React from 'react';
import { triggerOpenStateMapping } from '../../utils/collapsibleOpenStateMapping';
import type { StateAttributesMapping } from '../../utils/getStateAttributesProps';
import { transitionStatusMapping } from '../../utils/stateAttributesMapping';
import { useRenderElement } from '../../utils/useRenderElement';
import {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { useButton } from '../../use-button';
import { useCollapsibleRootContext } from '../root/CollapsibleRootContext';
import { CollapsibleRoot } from '../root/CollapsibleRoot';

const stateAttributesMapping: StateAttributesMapping<CollapsibleRoot.State> = {
  ...triggerOpenStateMapping,
  ...transitionStatusMapping,
};

/**
 * A button that opens and closes the collapsible panel.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Collapsible](https://base-ui.com/react/components/collapsible)
 */
export const CollapsibleTrigger = React.forwardRef(function CollapsibleTrigger(
  componentProps: CollapsibleTrigger.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const {
    panelId,
    open,
    handleTrigger,
    state,
    disabled: contextDisabled,
  } = useCollapsibleRootContext();

  const {
    className,
    disabled = contextDisabled,
    id,
    render,
    nativeButton = true,
    ...elementProps
  } = componentProps;

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled: true,
    native: nativeButton,
  });

  const props = React.useMemo(
    () => ({
      'aria-controls': open ? panelId : undefined,
      'aria-expanded': open,
      disabled,
      onClick: handleTrigger,
    }),
    [panelId, disabled, open, handleTrigger],
  );

  const element = useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef, buttonRef],
    props: [props, elementProps as React.ComponentPropsWithoutRef<'button'>, getButtonProps],
    stateAttributesMapping,
  });

  return element;
});

interface CollapsibleTriggerNativeProps
  extends NativeButtonProps, BaseUIComponentProps<'button', CollapsibleRoot.State> {
  nativeButton?: true;
}

interface CollapsibleTriggerNonNativeProps
  extends NonNativeButtonProps, GenericHTMLProps<CollapsibleRoot.State> {
  nativeButton: false;
  /**
   * Whether the component should ignore user interaction.
   */
  disabled?: boolean;
}

export type CollapsibleTriggerProps =
  | CollapsibleTriggerNativeProps
  | CollapsibleTriggerNonNativeProps;

export namespace CollapsibleTrigger {
  export type Props = CollapsibleTriggerProps;
}
