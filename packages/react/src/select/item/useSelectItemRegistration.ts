'use client';
import type * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { compareItemEquality, resolveSelectedIndex } from '../../internals/itemEquality';
import type { SelectStore } from '../store';

/**
 * Publishes an item's value at its index and claims the selected index when it holds the
 * selected value. Items do this whether the popup is mounted or not, so the root always knows
 * the list.
 */
export function useSelectItemRegistration(params: {
  store: SelectStore;
  index: number;
  itemValue: any;
  multiple: boolean;
  isItemEqualToValue: (itemValue: any, selectedValue: any) => boolean;
  /** The element that aligns the popup with the trigger. Only for items in the popup. */
  textRef?: React.RefObject<HTMLElement | null> | undefined;
  /** Whether a virtualized list gives the item its index, with values from the filtered `items`. */
  virtualized?: boolean | undefined;
}) {
  const { store, index, itemValue, multiple, isItemEqualToValue, textRef, virtualized } = params;

  useIsoLayoutEffect(() => {
    // A virtualized list's values come from the filtered `items`, not the mounted items.
    if (virtualized) {
      return undefined;
    }
    const values = store.context.valuesRef.current;
    values[index] = itemValue;
    // Filtering can move this item into the highlighted index.
    if (index === store.state.activeIndex) {
      store.context.syncHighlight();
    }

    return () => {
      delete values[index];
    };
  }, [index, itemValue, store, virtualized]);

  useIsoLayoutEffect(() => {
    const selectedValue = store.state.selectedValue;

    const currentIndex = store.state.selectedIndex;
    let nextIndex = currentIndex;
    let claims: boolean;
    if (multiple && Array.isArray(selectedValue)) {
      // The claiming item also owns the text ref that aligns the popup.
      nextIndex = resolveSelectedIndex(
        index,
        itemValue,
        store.context.valuesRef.current,
        selectedValue,
        isItemEqualToValue,
        currentIndex,
      );
      claims = nextIndex === index;
      if (textRef && index === currentIndex && !claims) {
        store.context.selectedItemTextRef.current = null;
      }
    } else {
      claims =
        selectedValue !== undefined &&
        compareItemEquality(itemValue, selectedValue, isItemEqualToValue);
      if (claims) {
        nextIndex = index;
      } else if (index === currentIndex) {
        // The index is stale: the value changed while the items were being replaced, as when
        // the popup opens in the same update. The item that holds the value claims it instead.
        nextIndex = null;
        if (textRef) {
          store.context.selectedItemTextRef.current = null;
        }
      }
    }
    store.set('selectedIndex', nextIndex);

    // Make sure SelectPopup can measure the selected item on first open.
    // SelectItemText can still update this ref later when focus moves.
    if (claims && textRef?.current) {
      store.context.selectedItemTextRef.current = textRef.current;
    }
  }, [index, multiple, isItemEqualToValue, store, itemValue, textRef]);
}
