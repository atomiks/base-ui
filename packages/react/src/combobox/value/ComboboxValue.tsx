'use client';
import * as React from 'react';
import { useStore } from '@base-ui-components/utils/store';
import { useComboboxRootContext } from '../root/ComboboxRootContext';
import { resolveMultipleLabels, resolveSelectedLabel } from '../../utils/resolveValueLabel';
import { selectors } from '../store';

/**
 * The current value of the combobox.
 * Doesn't render its own HTML element.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */
export function ComboboxValue(props: ComboboxValue.Props): React.ReactElement {
  const { children: childrenProp } = props;

  const store = useComboboxRootContext();

  const itemToStringLabel = useStore(store, selectors.itemToStringLabel);
  const selectedValue = useStore(store, selectors.selectedValue);
  const items = useStore(store, selectors.items);
  const selectionMode = useStore(store, selectors.selectionMode);
  const multiple = selectionMode === 'multiple';

  let children: React.ReactNode;
  if (typeof childrenProp === 'function') {
    children = childrenProp(selectedValue);
  } else if (childrenProp != null) {
    children = childrenProp;
  } else if (multiple && Array.isArray(selectedValue)) {
    children = resolveMultipleLabels(selectedValue, items, itemToStringLabel);
  } else {
    children = resolveSelectedLabel(selectedValue, items, itemToStringLabel);
  }

  return <React.Fragment>{children}</React.Fragment>;
}

export interface ComboboxValueState {}

export interface ComboboxValueProps {
  children?: React.ReactNode | ((selectedValue: any) => React.ReactNode);
}

export namespace ComboboxValue {
  export type State = ComboboxValueState;
  export type Props = ComboboxValueProps;
}
