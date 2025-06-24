'use client';
import * as React from 'react';
import { NOOP } from '../../utils/noop';
import type { BaseUIComponentProps } from '../../utils/types';
import { useModernLayoutEffect } from '../../utils/useModernLayoutEffect';
import { useRenderElement } from '../../utils/useRenderElement';
import { useButton } from '../../use-button';
import { ACTIVE_COMPOSITE_ITEM } from '../../composite/constants';
import { CompositeItem } from '../../composite/item/CompositeItem';
import { useFieldRootContext } from '../../field/root/FieldRootContext';
import { customStyleHookMapping } from '../utils/customStyleHookMapping';
import { useRadioGroupContext } from '../../radio-group/RadioGroupContext';
import { RadioRootContext } from './RadioRootContext';

/**
 * Represents the radio button itself.
 * Renders a `<button>` element and a hidden `<input>` beside.
 *
 * Documentation: [Base UI Radio](https://base-ui.com/react/components/radio)
 */
export const RadioRoot = React.forwardRef(function RadioRoot(
  componentProps: RadioRoot.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  const {
    render,
    className,
    disabled: disabledProp = false,
    readOnly: readOnlyProp = false,
    required: requiredProp = false,
    value,
    nativeButton = true,
    ...elementProps
  } = componentProps;

  const {
    disabled: disabledRoot,
    readOnly: readOnlyRoot,
    required: requiredRoot,
    checkedValue,
    setCheckedValue,
    onValueChange,
    touched,
    fieldControlValidation,
    registerControlRef,
  } = useRadioGroupContext();
  const {
    state: fieldState,
    disabled: fieldDisabled,
    setTouched,
    setDirty,
    setFilled,
    validityData,
  } = useFieldRootContext();

  const disabled = fieldDisabled || disabledRoot || disabledProp;
  const readOnly = readOnlyRoot || readOnlyProp;
  const required = requiredRoot || requiredProp;
  const checked = checkedValue === value;

  useModernLayoutEffect(() => {
    if (checked) {
      setFilled(true);
    }
  }, [checked, setFilled]);

  const rootProps: React.ComponentPropsWithRef<'button'> = React.useMemo(
    () => ({
      role: 'radio',
      'aria-checked': checked,
      'aria-required': required || undefined,
      'aria-disabled': disabled || undefined,
      'aria-readonly': readOnly || undefined,
      [ACTIVE_COMPOSITE_ITEM as string]: checked ? '' : undefined,
      disabled,
      onKeyDown(event) {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      },
      onClick(event) {
        if (event.defaultPrevented || disabled || readOnly) {
          return;
        }

        event.preventDefault();

        setTouched(true);
        setDirty(value !== validityData.initialValue);
        setCheckedValue(value);
        setFilled(true);
        onValueChange?.(value, event.nativeEvent);
      },
      onFocus(event) {
        if (event.defaultPrevented || disabled || readOnly || !touched) {
          return;
        }

        setTouched(true);
        setDirty(value !== validityData.initialValue);
        setCheckedValue(value);
        setFilled(true);
        onValueChange?.(value, event.nativeEvent);
        setTouched(false);
      },
    }),
    [
      checked,
      required,
      disabled,
      readOnly,
      touched,
      setTouched,
      setCheckedValue,
      value,
      setDirty,
      validityData.initialValue,
      setFilled,
      onValueChange,
    ],
  );

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    native: nativeButton,
  });

  const state: RadioRoot.State = React.useMemo(
    () => ({
      ...fieldState,
      required,
      disabled,
      readOnly,
      checked,
    }),
    [fieldState, disabled, readOnly, checked, required],
  );

  const contextValue: RadioRootContext = React.useMemo(() => state, [state]);

  const element = useRenderElement('button', componentProps, {
    state,
    ref: [forwardedRef, registerControlRef, buttonRef],
    props: [
      rootProps,
      fieldControlValidation?.getValidationProps ?? undefined,
      elementProps,
      getButtonProps,
    ],
    customStyleHookMapping,
  });

  return (
    <RadioRootContext.Provider value={contextValue}>
      {setCheckedValue === NOOP ? element : <CompositeItem render={element} />}
    </RadioRootContext.Provider>
  );
});

export namespace RadioRoot {
  export interface Props extends Omit<BaseUIComponentProps<'button', State>, 'value'> {
    /**
     * The unique identifying value of the radio in a group.
     */
    value: any;
    /**
     * Whether the component should ignore user interaction.
     * @default false
     */
    disabled?: boolean;
    /**
     * Whether the user must choose a value before submitting a form.
     * @default false
     */
    required?: boolean;
    /**
     * Whether the user should be unable to select the radio button.
     * @default false
     */
    readOnly?: boolean;
    /**
     * Whether the component renders a native `<button>` element when replacing it
     * via the `render` prop.
     * Set to `false` if the rendered element is not a button (e.g. `<div>`).
     * @default true
     */
    nativeButton?: boolean;
  }

  export interface State {
    /**
     * Whether the radio button is currently selected.
     */
    checked: boolean;
    disabled: boolean;
    /**
     * Whether the user should be unable to select the radio button.
     */
    readOnly: boolean;
    /**
     * Whether the user must choose a value before submitting a form.
     */
    required: boolean;
  }
}
