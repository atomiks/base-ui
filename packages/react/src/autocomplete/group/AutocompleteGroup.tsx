'use client';
import type * as React from 'react';
import { ComboboxGroup } from '../../combobox/group/ComboboxGroup';
import type { ComboboxGroupProps, ComboboxGroupState } from '../../combobox/group/ComboboxGroup';

/**
 * Groups related items with the corresponding label.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteGroup = ComboboxGroup as AutocompleteGroup;

export interface AutocompleteGroup {
  (componentProps: AutocompleteGroupProps): React.JSX.Element;
}

export interface AutocompleteGroupProps extends ComboboxGroupProps {}

export interface AutocompleteGroupState extends ComboboxGroupState {}

export namespace AutocompleteGroup {
  export type Props = AutocompleteGroupProps;
  export type State = AutocompleteGroupState;
}
