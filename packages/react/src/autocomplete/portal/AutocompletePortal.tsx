'use client';
import type * as React from 'react';
import { ComboboxPortal } from '../../combobox/portal/ComboboxPortal';
import type { ComboboxPortalProps } from '../../combobox/portal/ComboboxPortal';

/**
 * A portal element that moves the popup to a different part of the DOM.
 * By default, the portal element is appended to `<body>`.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompletePortal = ComboboxPortal as AutocompletePortal;

export interface AutocompletePortal {
  (componentProps: AutocompletePortalProps): React.JSX.Element | null;
}

export interface AutocompletePortalProps extends ComboboxPortalProps {}

export interface AutocompletePortalState {}

export namespace AutocompletePortal {
  export type Props = AutocompletePortalProps;
  export type State = AutocompletePortalState;
}
