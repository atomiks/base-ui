'use client';
import * as React from 'react';
import {
  BaseUIComponentProps,
  GenericHTMLProps,
  NativeButtonProps,
  NonNativeButtonProps,
} from '../../utils/types';
import { useButton } from '../../use-button';
import type { ToolbarRoot } from '../root/ToolbarRoot';
import { useToolbarRootContext } from '../root/ToolbarRootContext';
import { useToolbarGroupContext } from '../group/ToolbarGroupContext';
import { CompositeItem } from '../../composite/item/CompositeItem';

/**
 * A button that can be used as-is or as a trigger for other components.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Toolbar](https://base-ui.com/react/components/toolbar)
 */
export const ToolbarButton = React.forwardRef(function ToolbarButton(
  componentProps: ToolbarButton.Props,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const {
    className,
    disabled: disabledProp = false,
    focusableWhenDisabled = true,
    render,
    nativeButton = true,
    ...elementProps
  } = componentProps;

  const itemMetadata = React.useMemo(() => ({ focusableWhenDisabled }), [focusableWhenDisabled]);

  const { disabled: toolbarDisabled, orientation } = useToolbarRootContext();

  const groupContext = useToolbarGroupContext(true);

  const disabled = toolbarDisabled || (groupContext?.disabled ?? false) || disabledProp;

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled,
    native: nativeButton,
  });

  const state: ToolbarButton.State = React.useMemo(
    () => ({
      disabled,
      orientation,
      focusable: focusableWhenDisabled,
    }),
    [disabled, focusableWhenDisabled, orientation],
  );

  return (
    <CompositeItem
      tag="button"
      render={render}
      className={className}
      metadata={itemMetadata}
      state={state}
      refs={[forwardedRef, buttonRef]}
      props={[
        elementProps as React.ComponentPropsWithoutRef<'button'>,
        // for integrating with Menu and Select disabled states, `disabled` is
        // intentionally duplicated even though getButtonProps includes it already
        // TODO: follow up after https://github.com/mui/base-ui/issues/1976#issuecomment-2916905663
        { disabled },
        getButtonProps,
      ]}
    />
  );
});

export interface ToolbarButtonState extends ToolbarRoot.State {
  disabled: boolean;
  focusable: boolean;
}

interface ToolbarButtonCommonProps {
  /**
   * When `true` the item is disabled.
   * @default false
   */
  disabled?: boolean;
  /**
   * When `true` the item remains focuseable when disabled.
   * @default true
   */
  focusableWhenDisabled?: boolean;
}

interface ToolbarButtonNativeProps
  extends
    NativeButtonProps,
    BaseUIComponentProps<'button', ToolbarButton.State>,
    ToolbarButtonCommonProps {
  nativeButton?: true;
}

interface ToolbarButtonNonNativeProps
  extends NonNativeButtonProps, GenericHTMLProps<ToolbarButton.State>, ToolbarButtonCommonProps {
  nativeButton: false;
}

export type ToolbarButtonProps = ToolbarButtonNativeProps | ToolbarButtonNonNativeProps;

export namespace ToolbarButton {
  export type State = ToolbarButtonState;
  export type Props = ToolbarButtonProps;
}
