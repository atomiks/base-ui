import { createChangeEventDetails } from '../../internals/createBaseUIEventDetails';
import { REASONS } from '../../internals/reasons';
import { findItemIndex } from '../../internals/itemEquality';
import type { SelectStore } from '../store';

/**
 * Drops a selected value whose item is no longer among `values`. A single value falls back to the
 * initial value when its item is still there, or to `null`; a multiple value keeps the rest.
 */
export function resetMissingSelectedValue(
  store: SelectStore,
  values: readonly any[],
  value: any,
  multiple: boolean,
) {
  const { isItemEqualToValue, initialValueRef, setValue, selectedItemTextRef } = store.context;
  const eventDetails = createChangeEventDetails(REASONS.none);

  if (!multiple && value != null) {
    if (findItemIndex(values, value, isItemEqualToValue) !== -1) {
      return;
    }

    const initialValue = initialValueRef.current;
    const hasInitial =
      initialValue != null && findItemIndex(values, initialValue, isItemEqualToValue) !== -1;
    const nextValue = hasInitial ? initialValue : null;
    setValue(nextValue, eventDetails);

    if (nextValue === null) {
      store.set('selectedIndex', null);
      selectedItemTextRef.current = null;
    }
    return;
  }

  if (multiple && Array.isArray(value)) {
    const nextValue = value.filter(
      (selectedItemValue) => findItemIndex(values, selectedItemValue, isItemEqualToValue) !== -1,
    );
    if (nextValue.length === value.length) {
      return;
    }

    setValue(nextValue, eventDetails);

    if (nextValue.length === 0) {
      store.set('selectedIndex', null);
      selectedItemTextRef.current = null;
    }
  }
}
