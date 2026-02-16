'use client';
import type * as React from 'react';
import { ComboboxPositioner } from '../../combobox/positioner/ComboboxPositioner';
import type {
  ComboboxPositionerProps,
  ComboboxPositionerState,
} from '../../combobox/positioner/ComboboxPositioner';

/**
 * Positions the popup against the input.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompletePositioner = ComboboxPositioner as AutocompletePositioner;

export interface AutocompletePositioner {
  (componentProps: AutocompletePositionerProps): React.JSX.Element;
}

export interface AutocompletePositionerProps extends ComboboxPositionerProps {}

export interface AutocompletePositionerState extends ComboboxPositionerState {}

export namespace AutocompletePositioner {
  export type Props = AutocompletePositionerProps;
  export type State = AutocompletePositionerState;
}
