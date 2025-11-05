'use client';
import * as React from 'react';
import { visuallyHidden } from '@base-ui-components/utils/visuallyHidden';
import { useMergedRefs } from '@base-ui-components/utils/useMergedRefs';
import { useRefWithInit } from '@base-ui-components/utils/useRefWithInit';
import { useOnFirstRender } from '@base-ui-components/utils/useOnFirstRender';
import { useControlled } from '@base-ui-components/utils/useControlled';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';
import { useStableCallback } from '@base-ui-components/utils/useStableCallback';
import { warn } from '@base-ui-components/utils/warn';
import { useValueAsRef } from '@base-ui-components/utils/useValueAsRef';
import { useStore, Store } from '@base-ui-components/utils/store';
import {
  useClick,
  useDismiss,
  useFloatingRootContext,
  useInteractions,
  useListNavigation,
  useTypeahead,
} from '../../floating-ui-react';
import { useFieldControlValidation } from '../../field/control/useFieldControlValidation';
import { SelectRootContext, SelectFloatingContext } from './SelectRootContext';
import type { SelectRootContext as SelectRootContextType } from './SelectRootContext';
import { useFieldRootContext } from '../../field/root/FieldRootContext';
import { useLabelableContext } from '../../labelable-provider/LabelableContext';
import { useLabelableId } from '../../labelable-provider/useLabelableId';
import {
  type BaseUIChangeEventDetails,
  createChangeEventDetails,
} from '../../utils/createBaseUIEventDetails';
import { stringifyAsValue } from '../../utils/resolveValueLabel';
import { useTransitionStatus } from '../../utils/useTransitionStatus';
import { selectors, State } from '../store';
import { useOpenChangeComplete } from '../../utils/useOpenChangeComplete';
import { useFormContext } from '../../form/FormContext';
import { useField } from '../../field/useField';
import { EMPTY_ARRAY } from '../../utils/constants';
import { defaultItemEquality, findItemIndex } from '../../utils/itemEquality';

/**
 * Groups all parts of the select.
 * Doesn’t render its own HTML element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectRootControlledProps<Value, Multiple>,
): React.JSX.Element;
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectRootUncontrolledProps<Value, Multiple>,
): React.JSX.Element;
export function SelectRoot<Value, Multiple extends boolean | undefined = false>(
  props: SelectRoot.Props<Value, Multiple>,
): React.JSX.Element {
  const {
    id: idProp,
    value: valueProp,
    defaultValue = null,
    onValueChange,
    open: openProp,
    defaultOpen = false,
    onOpenChange,
    name: nameProp,
    disabled: disabledProp = false,
    readOnly = false,
    required = false,
    modal = false,
    actionsRef,
    inputRef,
    onOpenChangeComplete,
    items,
    multiple = false,
    itemToStringLabel,
    itemToStringValue,
    isItemEqualToValue = defaultItemEquality,
    children,
  } = props;

  const { clearErrors } = useFormContext();
  const {
    setDirty,
    shouldValidateOnChange,
    validityData,
    validationMode,
    setFilled,
    name: fieldName,
    disabled: fieldDisabled,
  } = useFieldRootContext();
  const fieldControlValidation = useFieldControlValidation();

  const disabled = fieldDisabled || disabledProp;
  const name = fieldName ?? nameProp;

  const id = useLabelableId({ id: idProp });

  const [value, setValueUnwrapped] = useControlled({
    controlled: valueProp,
    default: multiple ? (defaultValue ?? EMPTY_ARRAY) : defaultValue,
    name: 'Select',
    state: 'value',
  });

  const [open, setOpenUnwrapped] = useControlled({
    controlled: openProp,
    default: defaultOpen,
    name: 'Select',
    state: 'open',
  });

  const listRef = React.useRef<Array<HTMLElement | null>>([]);
  const labelsRef = React.useRef<Array<string | null>>([]);
  const popupRef = React.useRef<HTMLDivElement | null>(null);
  const scrollHandlerRef = React.useRef<((el: HTMLDivElement) => void) | null>(null);
  const scrollArrowsMountedCountRef = React.useRef(0);
  const valueRef = React.useRef<HTMLSpanElement | null>(null);
  const valuesRef = React.useRef<Array<any>>([]);
  const typingRef = React.useRef(false);
  const keyboardActiveRef = React.useRef(false);
  const selectedItemTextRef = React.useRef<HTMLSpanElement | null>(null);
  const lastSelectedIndexRef = React.useRef<number | null>(null);
  const selectionRef = React.useRef({
    allowSelectedMouseUp: false,
    allowUnselectedMouseUp: false,
  });
  const hasRegisteredRef = React.useRef(false);
  const alignItemWithTriggerActiveRef = React.useRef(false);

  const { mounted, setMounted, transitionStatus } = useTransitionStatus(open);

  const store = useRefWithInit(
    () =>
      new Store<State>({
        id,
        modal,
        multiple,
        itemToStringLabel,
        itemToStringValue,
        isItemEqualToValue,
        value,
        label: '',
        open,
        mounted,
        forceMount: false,
        transitionStatus,
        items,
        touchModality: false,
        activeIndex: null,
        selectedIndex: null,
        popupProps: {},
        triggerProps: {},
        triggerElement: null,
        positionerElement: null,
        listElement: null,
        scrollUpArrowVisible: false,
        scrollDownArrowVisible: false,
        hasScrollArrows: false,
      }),
  ).current;

  const initialValueRef = React.useRef(value);
  useIsoLayoutEffect(() => {
    // Ensure the values and labels are registered for programmatic value changes.
    if (value !== initialValueRef.current) {
      store.set('forceMount', true);
    }
  }, [store, value]);

  const activeIndex = useStore(store, selectors.activeIndex);
  const selectedIndex = useStore(store, selectors.selectedIndex);

  const triggerElement = useStore(store, selectors.triggerElement);
  const positionerElement = useStore(store, selectors.positionerElement);

  const controlRef = useValueAsRef(store.state.triggerElement);
  const commitValidation = fieldControlValidation.commitValidation;

  useField({
    id,
    commitValidation,
    value,
    controlRef,
    name,
    getValue: () => value,
  });

  const prevValueRef = React.useRef(value);

  useIsoLayoutEffect(() => {
    setFilled(value !== null);
  }, [value, setFilled]);

  useIsoLayoutEffect(() => {
    if (prevValueRef.current === value) {
      return;
    }

    if (multiple) {
      // For multiple selection, update the label and keep track of the last selected
      // item via `selectedIndex`, which is needed when the popup (re)opens.
      const currentValue = Array.isArray(value) ? value : [];

      const labels = currentValue
        .map((v) => {
          const index = findItemIndex(valuesRef.current, v, isItemEqualToValue);
          return index !== -1 ? (labelsRef.current[index] ?? '') : '';
        })
        .filter(Boolean);

      const lastValue = currentValue[currentValue.length - 1];
      const lastIndex = findItemIndex(valuesRef.current, lastValue, isItemEqualToValue);

      // Store the last selected index for later use when closing the popup.
      lastSelectedIndexRef.current = lastIndex === -1 ? null : lastIndex;

      store.update({
        label: labels.join(', '),
      });
    } else {
      const index = findItemIndex(valuesRef.current, value as Value, isItemEqualToValue);

      store.update({
        selectedIndex: index === -1 ? null : index,
        label: labelsRef.current[index] ?? '',
      });
    }

    clearErrors(name);
    setDirty(value !== validityData.initialValue);
    commitValidation(value, !shouldValidateOnChange());

    if (shouldValidateOnChange()) {
      commitValidation(value);
    }
  }, [
    value,
    commitValidation,
    clearErrors,
    name,
    shouldValidateOnChange,
    validationMode,
    store,
    setDirty,
    validityData.initialValue,
    setFilled,
    multiple,
    isItemEqualToValue,
  ]);

  useIsoLayoutEffect(() => {
    prevValueRef.current = value;
  }, [value]);

  const setOpen = useStableCallback(
    (nextOpen: boolean, eventDetails: SelectRoot.ChangeEventDetails) => {
      onOpenChange?.(nextOpen, eventDetails);

      if (eventDetails.isCanceled) {
        return;
      }

      setOpenUnwrapped(nextOpen);

      // The active index will sync to the last selected index on the next open.
      if (!nextOpen && multiple) {
        store.set('selectedIndex', lastSelectedIndexRef.current);
      }

      // Workaround `enableFocusInside` in Floating UI setting `tabindex=0` of a non-highlighted
      // option upon close when tabbing out due to `keepMounted=true`:
      // https://github.com/floating-ui/floating-ui/pull/3004/files#diff-962a7439cdeb09ea98d4b622a45d517bce07ad8c3f866e089bda05f4b0bbd875R194-R199
      // This otherwise causes options to retain `tabindex=0` incorrectly when the popup is closed
      // when tabbing outside.
      if (!nextOpen && store.state.activeIndex !== null) {
        const activeOption = listRef.current[store.state.activeIndex];
        // Wait for Floating UI's focus effect to have fired
        queueMicrotask(() => {
          activeOption?.setAttribute('tabindex', '-1');
        });
      }
    },
  );

  const handleUnmount = useStableCallback(() => {
    setMounted(false);
    store.set('activeIndex', null);
    onOpenChangeComplete?.(false);
  });

  useOpenChangeComplete({
    enabled: !actionsRef,
    open,
    ref: popupRef,
    onComplete() {
      if (!open) {
        handleUnmount();
      }
    },
  });

  React.useImperativeHandle(actionsRef, () => ({ unmount: handleUnmount }), [handleUnmount]);

  const setValue = useStableCallback(
    (nextValue: any, eventDetails: SelectRoot.ChangeEventDetails) => {
      onValueChange?.(nextValue, eventDetails);

      if (eventDetails.isCanceled) {
        return;
      }

      setValueUnwrapped(nextValue);
    },
  );

  /**
   * Keeps `store.selectedIndex` and `store.label` in sync with the current `value`.
   * Does nothing until at least one item has reported its index (so that
   * `valuesRef`/`labelsRef` are populated).
   */
  const syncSelectedState = useStableCallback(() => {
    if (!hasRegisteredRef.current) {
      return;
    }

    if (multiple) {
      const currentValue = Array.isArray(value) ? value : [];

      const labels = currentValue
        .map((v) => {
          const index = findItemIndex(valuesRef.current, v, isItemEqualToValue);
          return index !== -1 ? (labelsRef.current[index] ?? '') : '';
        })
        .filter(Boolean);

      const lastValue = currentValue[currentValue.length - 1];
      const lastIndex =
        lastValue !== undefined
          ? findItemIndex(valuesRef.current, lastValue, isItemEqualToValue)
          : -1;

      // Store the last selected index for later use when closing the popup.
      lastSelectedIndexRef.current = lastIndex === -1 ? null : lastIndex;

      let computedSelectedIndex = store.state.selectedIndex;
      if (computedSelectedIndex === null) {
        computedSelectedIndex = lastIndex === -1 ? null : lastIndex;
      }

      store.update({
        selectedIndex: computedSelectedIndex,
        label: labels.join(', '),
      });
    } else {
      const index = findItemIndex(valuesRef.current, value as Value, isItemEqualToValue);
      const hasIndex = index !== -1;

      if (hasIndex || value === null) {
        store.update({
          selectedIndex: hasIndex ? index : null,
          label: hasIndex ? (labelsRef.current[index] ?? '') : '',
        });
        return;
      }

      if (process.env.NODE_ENV !== 'production') {
        if (value) {
          const stringValue =
            typeof value === 'string' || value === null ? value : JSON.stringify(value);
          warn(`The value \`${stringValue}\` is not present in the select items.`);
        }
      }
    }
  });

  /**
   * Called by each <Select.Item> once it knows its stable index. After the first
   * call, the root is able to resolve labels and selected indices.
   */
  const registerItemIndex = useStableCallback((index: number) => {
    hasRegisteredRef.current = true;

    if (multiple) {
      // Store the last selected item index so that the popup can restore focus
      // when it re-opens.
      lastSelectedIndexRef.current = index;
    }

    syncSelectedState();
  });

  // Keep store in sync whenever `value` changes after registration.
  useIsoLayoutEffect(syncSelectedState, [value, syncSelectedState]);

  const handleScrollArrowVisibility = useStableCallback(() => {
    const scroller = store.state.listElement || popupRef.current;
    if (!scroller) {
      return;
    }

    const viewportTop = scroller.scrollTop;
    const viewportBottom = scroller.scrollTop + scroller.clientHeight;
    const shouldShowUp = viewportTop > 1;
    const shouldShowDown = viewportBottom < scroller.scrollHeight - 1;

    if (store.state.scrollUpArrowVisible !== shouldShowUp) {
      store.set('scrollUpArrowVisible', shouldShowUp);
    }
    if (store.state.scrollDownArrowVisible !== shouldShowDown) {
      store.set('scrollDownArrowVisible', shouldShowDown);
    }
  });

  const floatingContext = useFloatingRootContext({
    open,
    onOpenChange: setOpen,
    elements: {
      reference: triggerElement,
      floating: positionerElement,
    },
  });

  const click = useClick(floatingContext, {
    enabled: !readOnly && !disabled,
    event: 'mousedown',
  });

  const dismiss = useDismiss(floatingContext, {
    bubbles: false,
  });

  const listNavigation = useListNavigation(floatingContext, {
    enabled: !readOnly && !disabled,
    listRef,
    activeIndex,
    selectedIndex,
    disabledIndices: EMPTY_ARRAY as number[],
    onNavigate(nextActiveIndex) {
      // Retain the highlight while transitioning out.
      if (nextActiveIndex === null && !open) {
        return;
      }

      store.set('activeIndex', nextActiveIndex);
    },
    // Implement our own listeners since `onPointerLeave` on each option fires while scrolling with
    // the `alignItemWithTrigger=true`, causing a performance issue on Chrome.
    focusItemOnHover: false,
  });

  const typeahead = useTypeahead(floatingContext, {
    enabled: !readOnly && !disabled && (open || !multiple),
    listRef: labelsRef,
    activeIndex,
    selectedIndex,
    onMatch(index) {
      if (open) {
        store.set('activeIndex', index);
      } else {
        setValue(valuesRef.current[index], createChangeEventDetails('none'));
      }
    },
    onTypingChange(typing) {
      // FIXME: Floating UI doesn't support allowing space to select an item while the popup is
      // closed and the trigger isn't a native <button>.
      typingRef.current = typing;
    },
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    listNavigation,
    typeahead,
  ]);

  useOnFirstRender(() => {
    // These should be initialized at store creation, but there is an interdependency
    // between some values used in floating hooks above.
    store.update({
      popupProps: getFloatingProps(),
      triggerProps: getReferenceProps(),
    });
  });

  useIsoLayoutEffect(() => {
    store.update({
      id,
      modal,
      multiple,
      value,
      open,
      mounted,
      transitionStatus,
      popupProps: getFloatingProps(),
      triggerProps: getReferenceProps(),
      items,
      itemToStringLabel,
      itemToStringValue,
      isItemEqualToValue,
    });
  }, [
    store,
    id,
    modal,
    multiple,
    value,
    open,
    mounted,
    transitionStatus,
    getFloatingProps,
    getReferenceProps,
    items,
    itemToStringLabel,
    itemToStringValue,
    isItemEqualToValue,
  ]);

  const rootContext: SelectRootContextType = React.useMemo(
    () => ({
      store,
      name,
      required,
      disabled,
      readOnly,
      multiple,
      itemToStringLabel,
      itemToStringValue,
      setValue,
      setOpen,
      listRef,
      popupRef,
      scrollHandlerRef,
      handleScrollArrowVisibility,
      scrollArrowsMountedCountRef,
      getItemProps,
      events: floatingContext.events,
      valueRef,
      valuesRef,
      labelsRef,
      typingRef,
      selectionRef,
      selectedItemTextRef,
      fieldControlValidation,
      registerItemIndex,
      onOpenChangeComplete,
      keyboardActiveRef,
      alignItemWithTriggerActiveRef,
      initialValueRef,
    }),
    [
      store,
      name,
      required,
      disabled,
      readOnly,
      multiple,
      itemToStringLabel,
      itemToStringValue,
      setValue,
      setOpen,
      listRef,
      popupRef,
      scrollHandlerRef,
      getItemProps,
      floatingContext.events,
      valueRef,
      valuesRef,
      labelsRef,
      typingRef,
      selectionRef,
      selectedItemTextRef,
      fieldControlValidation,
      registerItemIndex,
      onOpenChangeComplete,
      keyboardActiveRef,
      alignItemWithTriggerActiveRef,
      handleScrollArrowVisibility,
    ],
  );

  const isMultiple = multiple ?? false;
  const { controlId } = useLabelableContext();

  const ref = useMergedRefs(inputRef, fieldControlValidation.inputRef);

  const serializedValue = React.useMemo(() => {
    if (isMultiple && Array.isArray(value) && value.length === 0) {
      return '';
    }
    return stringifyAsValue(value, itemToStringValue);
  }, [isMultiple, value, itemToStringValue]);

  const hasMultipleSelection = isMultiple && Array.isArray(value) && value.length > 0;

  const hiddenInputs = React.useMemo(() => {
    if (!isMultiple || !Array.isArray(value) || !name) {
      return null;
    }

    return value.map((v) => {
      const currentSerializedValue = stringifyAsValue(v, itemToStringValue);
      return (
        <input
          key={currentSerializedValue}
          type="hidden"
          name={name}
          value={currentSerializedValue}
        />
      );
    });
  }, [isMultiple, value, name, itemToStringValue]);

  return (
    <SelectRootContext.Provider value={rootContext}>
      <SelectFloatingContext.Provider value={floatingContext}>
        {children}
        <input
          {...fieldControlValidation.getInputValidationProps({
            onFocus() {
              // Move focus to the trigger element when the hidden input is focused.
              store.state.triggerElement?.focus();
            },
            // Handle browser autofill.
            onChange(event: React.ChangeEvent<HTMLSelectElement>) {
              // Workaround for https://github.com/facebook/react/issues/9023
              if (event.nativeEvent.defaultPrevented) {
                return;
              }

              const nextValue = event.target.value;
              const details = createChangeEventDetails('none', event.nativeEvent);

              function handleChange() {
                if (isMultiple) {
                  // Browser autofill only writes a single scalar value.
                  return;
                }

                // Handle single selection: match against registered values using serialization
                const matchingValue = valuesRef.current.find((v: Value) => {
                  const candidate = stringifyAsValue(v, itemToStringValue);
                  if (candidate.toLowerCase() === nextValue.toLowerCase()) {
                    return true;
                  }
                  return false;
                });

                if (matchingValue != null) {
                  setDirty(matchingValue !== validityData.initialValue);
                  setValue?.(matchingValue, details);

                  if (shouldValidateOnChange()) {
                    fieldControlValidation.commitValidation(matchingValue);
                  }
                }
              }

              store.set('forceMount', true);
              queueMicrotask(handleChange);
            },
            id: id || controlId || undefined,
            name: isMultiple ? undefined : name,
            value: serializedValue,
            disabled,
            required: required && !hasMultipleSelection,
            readOnly,
            ref,
            style: visuallyHidden,
            tabIndex: -1,
            'aria-hidden': true,
          })}
        />
        {hiddenInputs}
      </SelectFloatingContext.Provider>
    </SelectRootContext.Provider>
  );
}

interface SelectRootCommonProps<Value> {
  children?: React.ReactNode;
  /**
   * A ref to access the hidden input element.
   */
  inputRef?: React.Ref<HTMLInputElement>;
  /**
   * Identifies the field when a form is submitted.
   */
  name?: string;
  /**
   * The id of the Select.
   */
  id?: string;
  /**
   * Whether the user must choose a value before submitting a form.
   * @default false
   */
  required?: boolean;
  /**
   * Whether the user should be unable to choose a different option from the select popup.
   * @default false
   */
  readOnly?: boolean;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean;
  /**
   * Whether multiple items can be selected.
   * @default false
   */
  multiple?: boolean;
  /**
   * The value of the select. Use when controlled.
   */
  value?: Value;
  /**
   * Event handler called when the value of the select changes.
   */
  onValueChange?: (value: Value, eventDetails: SelectRootChangeEventDetails) => void;
  /**
   * The uncontrolled value of the select when it’s initially rendered.
   *
   * To render a controlled select, use the `value` prop instead.
   * @default null
   */
  defaultValue?: Value | null;
  /**
   * Whether the select popup is initially open.
   *
   * To render a controlled select popup, use the `open` prop instead.
   * @default false
   */
  defaultOpen?: boolean;
  /**
   * Event handler called when the select popup is opened or closed.
   */
  onOpenChange?: (open: boolean, eventDetails: SelectRootChangeEventDetails) => void;
  /**
   * Event handler called after any animations complete when the select popup is opened or closed.
   */
  onOpenChangeComplete?: (open: boolean) => void;
  /**
   * Whether the select popup is currently open.
   */
  open?: boolean;
  /**
   * Determines if the select enters a modal state when open.
   * - `true`: user interaction is limited to the select: document page scroll is locked and and pointer interactions on outside elements are disabled.
   * - `false`: user interaction with the rest of the document is allowed.
   * @default true
   */
  modal?: boolean;
  /**
   * A ref to imperative actions.
   * - `unmount`: When specified, the select will not be unmounted when closed.
   * Instead, the `unmount` function must be called to unmount the select manually.
   * Useful when the select's animation is controlled by an external library.
   */
  actionsRef?: React.RefObject<SelectRootActions>;
  /**
   * Data structure of the items rendered in the select popup.
   * When specified, `<Select.Value>` renders the label of the selected item instead of the raw value.
   * @example
   * ```tsx
   * const items = {
   *   sans: 'Sans-serif',
   *   serif: 'Serif',
   *   mono: 'Monospace',
   *   cursive: 'Cursive',
   * };
   * <Select.Root items={items} />
   * ```
   */
  items?: Record<string, React.ReactNode> | ReadonlyArray<{ label: React.ReactNode; value: Value }>;
  /**
   * When the item values are objects (`<Select.Item value={object}>`), this function converts the object value to a string representation for display in the trigger.
   * If the shape of the object is `{ value, label }`, the label will be used automatically without needing to specify this prop.
   */
  itemToStringLabel?: (itemValue: Value) => string;
  /**
   * When the item values are objects (`<Select.Item value={object}>`), this function converts the object value to a string representation for form submission.
   * If the shape of the object is `{ value, label }`, the value will be used automatically without needing to specify this prop.
   */
  itemToStringValue?: (itemValue: Value) => string;
  /**
   * Custom comparison logic used to determine if a select item value matches the current selected value. Useful when item values are objects without matching referentially.
   * Defaults to `Object.is` comparison.
   */
  isItemEqualToValue?: (itemValue: Value, value: Value) => boolean;
}

type SelectValueType<Value, Multiple extends boolean | undefined> = Multiple extends true
  ? Value[]
  : Value;

type SelectRootBaseProps<Value, Multiple extends boolean | undefined> = Omit<
  SelectRootCommonProps<Value>,
  'multiple' | 'value' | 'defaultValue' | 'onValueChange'
> & {
  /**
   * Whether multiple items can be selected.
   * @default false
   */
  multiple?: Multiple;
  /**
   * The uncontrolled value of the select when it’s initially rendered.
   *
   * To render a controlled select, use the `value` prop instead.
   * @default null
   */
  defaultValue?: SelectValueType<Value, Multiple> | null;
};

type SelectRootControlledProps<Value, Multiple extends boolean | undefined> = SelectRootBaseProps<
  Value,
  Multiple
> & {
  /**
   * The value of the select. Use when controlled.
   */
  value: SelectValueType<Value, Multiple>;
  /**
   * Event handler called when the value of the select changes.
   */
  onValueChange?: (
    value: SelectValueType<Value, Multiple>,
    eventDetails: SelectRootChangeEventDetails,
  ) => void;
};

type SelectRootUncontrolledProps<Value, Multiple extends boolean | undefined> = SelectRootBaseProps<
  Value,
  Multiple
> & {
  /**
   * The value of the select. Use when controlled.
   */
  value?: undefined;
  /**
   * Event handler called when the value of the select changes.
   */
  onValueChange?: (
    value: SelectValueType<Value, Multiple> | (Multiple extends true ? never : null),
    eventDetails: SelectRootChangeEventDetails,
  ) => void;
};

export type SelectRootConditionalProps<Value, Multiple extends boolean | undefined = false> =
  | SelectRootControlledProps<Value, Multiple>
  | SelectRootUncontrolledProps<Value, Multiple>;

export type SelectRootProps<
  Value,
  Multiple extends boolean | undefined = false,
> = SelectRootConditionalProps<Value, Multiple>;

export interface SelectRootState {}

export interface SelectRootActions {
  unmount: () => void;
}

export type SelectRootChangeEventReason =
  | 'trigger-press'
  | 'outside-press'
  | 'escape-key'
  | 'window-resize'
  | 'item-press'
  | 'focus-out'
  | 'list-navigation'
  | 'cancel-open'
  | 'none';

export type SelectRootChangeEventDetails = BaseUIChangeEventDetails<SelectRootChangeEventReason>;

export namespace SelectRoot {
  export type Props<Value, Multiple extends boolean | undefined = false> = SelectRootProps<
    Value,
    Multiple
  >;
  export type State = SelectRootState;
  export type Actions = SelectRootActions;
  export type ChangeEventReason = SelectRootChangeEventReason;
  export type ChangeEventDetails = SelectRootChangeEventDetails;
}
