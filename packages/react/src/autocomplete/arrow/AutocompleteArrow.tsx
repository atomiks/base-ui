'use client';
import type * as React from 'react';
import { ComboboxArrow } from '../../combobox/arrow/ComboboxArrow';
import type { ComboboxArrowProps, ComboboxArrowState } from '../../combobox/arrow/ComboboxArrow';

/**
 * Displays an element positioned against the anchor.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteArrow = ComboboxArrow as AutocompleteArrow;

export interface AutocompleteArrow {
  (componentProps: AutocompleteArrowProps): React.JSX.Element;
}

export interface AutocompleteArrowProps extends ComboboxArrowProps {}

export interface AutocompleteArrowState extends ComboboxArrowState {}

export namespace AutocompleteArrow {
  export type Props = AutocompleteArrowProps;
  export type State = AutocompleteArrowState;
}
