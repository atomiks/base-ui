'use client';
import type * as React from 'react';
import { Separator } from '../../separator/Separator';
import type { SeparatorProps, SeparatorState } from '../../separator/Separator';

/**
 * A separator element accessible to screen readers.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteSeparator = Separator as AutocompleteSeparator;

export interface AutocompleteSeparator {
  (componentProps: AutocompleteSeparatorProps): React.JSX.Element;
}

export interface AutocompleteSeparatorProps extends SeparatorProps {}

export interface AutocompleteSeparatorState extends SeparatorState {}

export namespace AutocompleteSeparator {
  export type Props = AutocompleteSeparatorProps;
  export type State = AutocompleteSeparatorState;
}
