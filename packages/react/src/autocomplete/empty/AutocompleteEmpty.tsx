'use client';
import type * as React from 'react';
import { ComboboxEmpty } from '../../combobox/empty/ComboboxEmpty';
import type { ComboboxEmptyProps, ComboboxEmptyState } from '../../combobox/empty/ComboboxEmpty';

/**
 * Renders its children only when the list is empty.
 * Requires the `items` prop on the root component.
 * Announces changes politely to screen readers.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteEmpty = ComboboxEmpty as AutocompleteEmpty;

export interface AutocompleteEmpty {
  (componentProps: AutocompleteEmptyProps): React.JSX.Element;
}

export interface AutocompleteEmptyProps extends ComboboxEmptyProps {}

export interface AutocompleteEmptyState extends ComboboxEmptyState {}

export namespace AutocompleteEmpty {
  export type Props = AutocompleteEmptyProps;
  export type State = AutocompleteEmptyState;
}
