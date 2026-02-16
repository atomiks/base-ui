'use client';
import type * as React from 'react';
import { ComboboxPopup } from '../../combobox/popup/ComboboxPopup';
import type { ComboboxPopupProps, ComboboxPopupState } from '../../combobox/popup/ComboboxPopup';

/**
 * A container for the list.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompletePopup = ComboboxPopup as AutocompletePopup;

export interface AutocompletePopup {
  (componentProps: AutocompletePopupProps): React.JSX.Element;
}

export interface AutocompletePopupProps extends ComboboxPopupProps {}

export interface AutocompletePopupState extends ComboboxPopupState {}

export namespace AutocompletePopup {
  export type Props = AutocompletePopupProps;
  export type State = AutocompletePopupState;
}
