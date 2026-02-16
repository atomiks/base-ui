'use client';
import type * as React from 'react';
import { ComboboxGroupLabel } from '../../combobox/group-label/ComboboxGroupLabel';
import type {
  ComboboxGroupLabelProps,
  ComboboxGroupLabelState,
} from '../../combobox/group-label/ComboboxGroupLabel';

/**
 * An accessible label that is automatically associated with its parent group.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteGroupLabel = ComboboxGroupLabel as AutocompleteGroupLabel;

export interface AutocompleteGroupLabel {
  (componentProps: AutocompleteGroupLabelProps): React.JSX.Element;
}

export interface AutocompleteGroupLabelProps extends ComboboxGroupLabelProps {}

export interface AutocompleteGroupLabelState extends ComboboxGroupLabelState {}

export namespace AutocompleteGroupLabel {
  export type Props = AutocompleteGroupLabelProps;
  export type State = AutocompleteGroupLabelState;
}
