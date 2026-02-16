'use client';
import type * as React from 'react';
import { ComboboxClear } from '../../combobox/clear/ComboboxClear';
import type { ComboboxClearProps, ComboboxClearState } from '../../combobox/clear/ComboboxClear';

/**
 * Clears the value when clicked.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteClear = ComboboxClear as AutocompleteClear;

export interface AutocompleteClear {
  (componentProps: AutocompleteClearProps): React.JSX.Element;
}

export interface AutocompleteClearProps extends ComboboxClearProps {}

export interface AutocompleteClearState extends ComboboxClearState {}

export namespace AutocompleteClear {
  export type Props = AutocompleteClearProps;
  export type State = AutocompleteClearState;
}
