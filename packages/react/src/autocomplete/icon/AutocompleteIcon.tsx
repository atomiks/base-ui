'use client';
import type * as React from 'react';
import { ComboboxIcon } from '../../combobox/icon/ComboboxIcon';
import type { ComboboxIconProps, ComboboxIconState } from '../../combobox/icon/ComboboxIcon';

/**
 * An icon that indicates that the trigger button opens the popup.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteIcon = ComboboxIcon as AutocompleteIcon;

export interface AutocompleteIcon {
  (componentProps: AutocompleteIconProps): React.JSX.Element;
}

export interface AutocompleteIconProps extends ComboboxIconProps {}

export interface AutocompleteIconState extends ComboboxIconState {}

export namespace AutocompleteIcon {
  export type Props = AutocompleteIconProps;
  export type State = AutocompleteIconState;
}
