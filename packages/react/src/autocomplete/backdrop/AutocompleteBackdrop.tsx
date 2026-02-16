'use client';
import type * as React from 'react';
import { ComboboxBackdrop } from '../../combobox/backdrop/ComboboxBackdrop';
import type {
  ComboboxBackdropProps,
  ComboboxBackdropState,
} from '../../combobox/backdrop/ComboboxBackdrop';

/**
 * An overlay displayed beneath the popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteBackdrop = ComboboxBackdrop as AutocompleteBackdrop;

export interface AutocompleteBackdrop {
  (componentProps: AutocompleteBackdropProps): React.JSX.Element;
}

export interface AutocompleteBackdropProps extends ComboboxBackdropProps {}

export interface AutocompleteBackdropState extends ComboboxBackdropState {}

export namespace AutocompleteBackdrop {
  export type Props = AutocompleteBackdropProps;
  export type State = AutocompleteBackdropState;
}
