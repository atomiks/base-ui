'use client';
import type * as React from 'react';
import { ComboboxRow } from '../../combobox/row/ComboboxRow';
import type { ComboboxRowProps, ComboboxRowState } from '../../combobox/row/ComboboxRow';

/**
 * Displays a single row of items in a grid list.
 * Enable `grid` on the root component to turn the listbox into a grid.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteRow = ComboboxRow as AutocompleteRow;

export interface AutocompleteRow {
  (componentProps: AutocompleteRowProps): React.JSX.Element;
}

export interface AutocompleteRowProps extends ComboboxRowProps {}

export interface AutocompleteRowState extends ComboboxRowState {}

export namespace AutocompleteRow {
  export type Props = AutocompleteRowProps;
  export type State = AutocompleteRowState;
}
