'use client';
import type * as React from 'react';
import { ComboboxTrigger } from '../../combobox/trigger/ComboboxTrigger';
import type {
  ComboboxTriggerProps,
  ComboboxTriggerState,
} from '../../combobox/trigger/ComboboxTrigger';

/**
 * A button that opens the popup.
 * Renders a `<button>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteTrigger = ComboboxTrigger as AutocompleteTrigger;

export interface AutocompleteTrigger {
  (componentProps: AutocompleteTriggerProps): React.JSX.Element;
}

export interface AutocompleteTriggerProps extends ComboboxTriggerProps {}

export interface AutocompleteTriggerState extends ComboboxTriggerState {}

export namespace AutocompleteTrigger {
  export type Props = AutocompleteTriggerProps;
  export type State = AutocompleteTriggerState;
}
