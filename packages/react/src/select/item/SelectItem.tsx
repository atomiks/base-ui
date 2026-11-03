'use client';
import * as React from 'react';
import { useSelectPositionerMounted } from '../positioner/SelectPositionerMountedContext';
import { useSelectRootContext } from '../root/SelectRootContext';
import { useCompositeListItem } from '../../internals/composite/list/useCompositeListItem';
import type {
  BaseUIComponentProps,
  BaseUIEvent,
  HTMLProps,
  NonNativeButtonProps,
} from '../../internals/types';
import { useRenderElement } from '../../internals/useRenderElement';
import { SelectItemContext } from './SelectItemContext';
import { SelectItemAhead } from './SelectItemAhead';
import { useSelectItemRegistration } from './useSelectItemRegistration';
import { useButton } from '../../internals/use-button';
import { createChangeEventDetails } from '../../internals/createBaseUIEventDetails';
import { REASONS } from '../../internals/reasons';
import { removeItem } from '../../internals/itemEquality';
import { isVirtualClick } from '../../utils/popups/event';
import { useSelectFilterImpl } from '../filter-root/SelectFilterContext';

export interface SelectItemViewProps extends SelectItemProps {
  /** Set by the filter, which points the input's `aria-activedescendant` at the option. */
  id?: string | undefined;
}

/**
 * The open item, for the filterable select's item to wrap. Takes its ref as `forwardedRef`.
 *
 * @internal
 */
export const SelectItemView = React.memo(function SelectItemView(
  viewProps: SelectItemViewProps & { forwardedRef: React.ForwardedRef<HTMLElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const {
    render,
    className,
    style,
    value: itemValue = null,
    label,
    disabled: disabledProp = false,
    nativeButton = false,
    ...elementProps
  } = componentProps;

  const textRef = React.useRef<HTMLElement | null>(null);
  const listItem = useCompositeListItem({
    guess: true,
    label,
    textRef,
  });

  const store = useSelectRootContext();
  const {
    props: itemProps,
    multiple,
    disabled: selectDisabled,
    readOnly,
    isItemEqualToValue,
  } = store.useState('itemRoot');
  const disabled = selectDisabled || disabledProp;
  const highlighted = store.useState('isActive', listItem.index);
  const activeWhileOpen = store.useState('isActiveWhileOpen', listItem.index);
  const selected = store.useState('isSelected', itemValue);
  const selectedByFocus = store.useState('isSelectedByFocus', listItem.index);

  const index = listItem.index;

  const itemRef = React.useRef<HTMLDivElement | null>(null);

  useSelectItemRegistration({
    store,
    index,
    itemValue,
    multiple,
    isItemEqualToValue,
    textRef,
  });

  const pointerTypeRef = React.useRef<'mouse' | 'touch' | 'pen'>('mouse');
  const allowMouseSelectionRef = React.useRef(false);

  const { getButtonProps, buttonRef } = useButton({
    disabled,
    focusableWhenDisabled: true,
    native: nativeButton,
    composite: true,
  });

  const state: SelectItemState = {
    disabled,
    selected,
    highlighted,
  };

  function commitSelection(event: MouseEvent | KeyboardEvent | PointerEvent) {
    // A forced-open select (`open`/`defaultOpen`) can still receive item activations even
    // when the root is disabled or read-only, so guard the commit here too.
    if (selectDisabled || readOnly) {
      return;
    }

    const selectedValue = store.state.selectedValue;
    if (multiple) {
      const currentValue = Array.isArray(selectedValue) ? selectedValue : [];
      const nextValue = selected
        ? removeItem(currentValue, itemValue, isItemEqualToValue)
        : [...currentValue, itemValue];
      store.context.setValue(nextValue, createChangeEventDetails(REASONS.itemPress, event));
    } else {
      store.context.setValue(itemValue, createChangeEventDetails(REASONS.itemPress, event));
      store.setOpen(false, createChangeEventDetails(REASONS.itemPress, event));
    }
  }

  function resetDragMovement() {
    store.context.selectionRef.current.dragY = 0;
  }

  const defaultProps: HTMLProps = {
    role: 'option',
    'aria-selected': selected,
    tabIndex: activeWhileOpen ? 0 : -1,
    onKeyDown(event: BaseUIEvent<React.KeyboardEvent>) {
      store.set('activeIndex', index);

      if (event.key === ' ' && store.context.typingRef.current) {
        // `useButton` skips Space activation for `role="option"` items when the keydown
        // is `defaultPrevented`, keeping typeahead spaces from committing a selection.
        event.preventDefault();
      }
    },
    onClick(event) {
      const isMouseClick = pointerTypeRef.current !== 'touch';
      const clickPointerType = (event.nativeEvent as PointerEvent).pointerType;
      const isVirtualMouseClick =
        isMouseClick &&
        isVirtualClick(event.nativeEvent) &&
        // Generic no-pointer `detail === 0` clicks stay tied to highlight state. Virtual
        // clicks that carry browser pointer data, including an empty string from assistive
        // technology, can activate unhighlighted items.
        (clickPointerType !== undefined || highlighted);
      // With alignItemWithTrigger, opening can place an item under the cursor. Real mouse
      // clicks must start on the item, while virtual clicks represent explicit keyboard or
      // assistive technology activation. A filterable popup never covers the trigger, and a
      // screen reader cursor (Safari VoiceOver) presses options without highlighting them.
      const isInvalidMouseClick =
        !store.context.filterable &&
        isMouseClick &&
        !isVirtualMouseClick &&
        !allowMouseSelectionRef.current;

      allowMouseSelectionRef.current = false;

      if (disabled || isInvalidMouseClick) {
        return;
      }

      commitSelection(event.nativeEvent);
    },
    onPointerEnter(event) {
      pointerTypeRef.current = event.pointerType;
    },
    onPointerMove(event) {
      if (event.pointerType === 'mouse' && event.buttons === 1) {
        const selection = store.context.selectionRef.current;
        selection.dragY += event.movementY;

        if (selection.dragY ** 2 >= 64) {
          selection.allowUnselectedMouseUp = true;
        }
      }
    },
    onPointerDown(event) {
      pointerTypeRef.current = event.pointerType;
      allowMouseSelectionRef.current = true;
      resetDragMovement();
    },
    onMouseUp() {
      resetDragMovement();

      if (disabled || pointerTypeRef.current === 'touch') {
        return;
      }

      // Regular clicks are committed by the click event.
      if (allowMouseSelectionRef.current) {
        return;
      }

      const disallowSelectedMouseUp =
        !store.context.selectionRef.current.allowSelectedMouseUp && selected;
      const disallowUnselectedMouseUp =
        !store.context.selectionRef.current.allowUnselectedMouseUp && !selected;

      if (disallowSelectedMouseUp || disallowUnselectedMouseUp) {
        return;
      }

      allowMouseSelectionRef.current = true;
      // Drag selection has no mousedown on the item. Focus it before the synthetic click so
      // arrow-key navigation continues from the selected item.
      if (!store.context.filterable) {
        itemRef.current?.focus({ preventScroll: true });
      }
      itemRef.current?.click();
      allowMouseSelectionRef.current = false;
    },
  };

  const element = useRenderElement('div', componentProps, {
    ref: [buttonRef, forwardedRef, listItem.ref, itemRef],
    state,
    props: [itemProps, defaultProps, elementProps, getButtonProps],
  });

  const contextValue: SelectItemContext = React.useMemo(
    () => ({
      selected,
      index,
      textRef,
      selectedByFocus,
    }),
    [selected, index, textRef, selectedByFocus],
  );

  return <SelectItemContext.Provider value={contextValue}>{element}</SelectItemContext.Provider>;
});

/**
 * An individual option in the select popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectItem = React.memo(
  React.forwardRef(function SelectItem(
    componentProps: SelectItem.Props,
    forwardedRef: React.ForwardedRef<HTMLElement>,
  ) {
    const filterImpl = useSelectFilterImpl();
    const mounted = useSelectPositionerMounted() !== false;

    if (mounted) {
      if (filterImpl) {
        return <filterImpl.Item {...componentProps} ref={forwardedRef} />;
      }
      return <SelectItemView {...componentProps} forwardedRef={forwardedRef} />;
    }

    // While closed, the item only takes part in typeahead.
    return <SelectItemAhead {...componentProps} />;
  }),
);

export interface SelectItemState {
  /**
   * Whether the item should ignore user interaction.
   */
  disabled: boolean;
  /**
   * Whether the item is selected.
   */
  selected: boolean;
  /**
   * Whether the item is highlighted.
   */
  highlighted: boolean;
}

export interface SelectItemProps
  extends NonNativeButtonProps, Omit<BaseUIComponentProps<'div', SelectItemState>, 'id'> {
  children?: React.ReactNode;
  /**
   * A unique value that identifies this select item.
   * @default null
   */
  value?: any;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean | undefined;
  /**
   * Overrides the text used for keyboard text navigation and filtering inside `Select.FilterProvider`.
   *
   * Defaults to the item text content if not provided.
   */
  label?: string | undefined;
}

export namespace SelectItem {
  export type State = SelectItemState;
  export type Props = SelectItemProps;
}
