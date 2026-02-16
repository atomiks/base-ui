'use client';
import type * as React from 'react';
import { ComboboxInput } from '../../combobox/input/ComboboxInput';
import type { ComboboxInputProps, ComboboxInputState } from '../../combobox/input/ComboboxInput';

/**
 * A text input to search for items in the list.
 * Renders an `<input>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteInput = ComboboxInput as AutocompleteInput;

export interface AutocompleteInput {
  (componentProps: AutocompleteInputProps): React.JSX.Element;
}

export interface AutocompleteInputProps extends ComboboxInputProps {}

export interface AutocompleteInputState extends ComboboxInputState {}

export namespace AutocompleteInput {
  export type Props = AutocompleteInputProps;
  export type State = AutocompleteInputState;
}
