'use client';
import type * as React from 'react';
import { ComboboxList } from '../../combobox/list/ComboboxList';
import type { ComboboxListProps, ComboboxListState } from '../../combobox/list/ComboboxList';

/**
 * A list container for the items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteList = ComboboxList as AutocompleteList;

export interface AutocompleteList {
  (componentProps: AutocompleteListProps): React.JSX.Element;
}

export interface AutocompleteListProps extends ComboboxListProps {}

export interface AutocompleteListState extends ComboboxListState {}

export namespace AutocompleteList {
  export type Props = AutocompleteListProps;
  export type State = AutocompleteListState;
}
