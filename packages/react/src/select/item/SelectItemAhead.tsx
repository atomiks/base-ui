'use client';
import * as React from 'react';
import { useSelectRootContext } from '../root/SelectRootContext';
import type { SelectItem } from './SelectItem';

export interface SelectItemAheadContext {
  /** Set by `Select.ItemText`, whose text then labels the item. */
  textRef: React.RefObject<HTMLElement | null>;
}

/**
 * Present inside an item while the select is closed. Its parts then skip their own rendering:
 * `Select.ItemText` only renders its text for the item's label, and the rest render nothing.
 */
export const SelectItemAheadContext = React.createContext<SelectItemAheadContext | undefined>(
  undefined,
);

export function useSelectItemAheadContext() {
  return React.useContext(SelectItemAheadContext);
}

/**
 * An item while the select is closed. It renders only a bare `<span>` into the fragment outside
 * the document and records its value and label against it, for the root to read when typeahead
 * or autofill needs the list.
 */
export function SelectItemAhead(props: SelectItem.Props) {
  const { value = null, label, disabled = false, children } = props;

  const store = useSelectRootContext();
  const textRef = React.useRef<HTMLElement | null>(null);
  const elementRef = React.useRef<HTMLSpanElement | null>(null);

  const ref = React.useCallback(
    (element: HTMLSpanElement | null) => {
      const { closedItems } = store.context;
      if (elementRef.current) {
        closedItems.delete(elementRef.current);
      }
      elementRef.current = element;
      if (element) {
        closedItems.set(element, { value, label, textRef });
      }
    },
    [store, value, label],
  );

  const contextValue = React.useMemo(() => ({ textRef }), []);

  return (
    // `aria-disabled` is what typeahead checks to skip disabled items.
    <span ref={ref} aria-disabled={disabled || undefined}>
      {label == null && (
        <SelectItemAheadContext.Provider value={contextValue}>
          {children}
        </SelectItemAheadContext.Provider>
      )}
    </span>
  );
}
