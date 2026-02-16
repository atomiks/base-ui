'use client';
import type * as React from 'react';
import { ComboboxStatus } from '../../combobox/status/ComboboxStatus';
import type {
  ComboboxStatusProps,
  ComboboxStatusState,
} from '../../combobox/status/ComboboxStatus';

/**
 * Displays a status message whose content changes are announced politely to screen readers.
 * Useful for conveying the status of an asynchronously loaded list.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteStatus = ComboboxStatus as AutocompleteStatus;

export interface AutocompleteStatus {
  (componentProps: AutocompleteStatusProps): React.JSX.Element;
}

export interface AutocompleteStatusProps extends ComboboxStatusProps {}

export interface AutocompleteStatusState extends ComboboxStatusState {}

export namespace AutocompleteStatus {
  export type Props = AutocompleteStatusProps;
  export type State = AutocompleteStatusState;
}
