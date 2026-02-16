'use client';
import type * as React from 'react';
import type { BaseUIComponentProps, NonNativeButtonProps } from '../../utils/types';
import { ComboboxItem } from '../../combobox/item/ComboboxItem';
import type { ComboboxItemState } from '../../combobox/item/ComboboxItem';

/**
 * An individual item in the list.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Autocomplete](https://base-ui.com/react/components/autocomplete)
 */
export const AutocompleteItem = ComboboxItem as AutocompleteItem;

export interface AutocompleteItem {
  (componentProps: AutocompleteItemProps): React.JSX.Element;
}

export interface AutocompleteItemState extends Omit<ComboboxItemState, 'selected'> {}

export interface AutocompleteItemProps
  extends NonNativeButtonProps, Omit<BaseUIComponentProps<'div', AutocompleteItem.State>, 'id'> {
  children?: React.ReactNode;
  /**
   * An optional click handler for the item when chosen.
   * It fires when clicking the item with the pointer, as well as when pressing `Enter` with the keyboard if the item is highlighted when the `Input` or `List` element has focus.
   */
  onClick?: BaseUIComponentProps<'div', AutocompleteItemState>['onClick'] | undefined;
  /**
   * The index of the item in the list. Improves performance when specified by avoiding the need to calculate the index automatically from the DOM.
   */
  index?: number | undefined;
  /**
   * A unique value that identifies this item.
   * @default null
   */
  value?: any;
  /**
   * Whether the component should ignore user interaction.
   * @default false
   */
  disabled?: boolean | undefined;
}

export namespace AutocompleteItem {
  export type State = AutocompleteItemState;
  export type Props = AutocompleteItemProps;
}
