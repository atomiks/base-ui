'use client';
import * as React from 'react';
import { BaseUIComponentProps } from '../../utils/types';
import { useRenderElement } from '../../utils/useRenderElement';
import {
  useComboboxDerivedItemsContext,
  useComboboxRootContext,
} from '../root/ComboboxRootContext';
import { useComboboxDescriptionElementId } from '../utils/useComboboxDescriptionElementId';

/**
 * Renders its children only when the list is empty.
 * Requires the `items` prop on the root component.
 * Announces changes politely to screen readers.
 * Renders a `<div>` element.
 */
export const ComboboxEmpty = React.forwardRef(function ComboboxEmpty(
  componentProps: ComboboxEmpty.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, id: idProp, children: childrenProp, ...elementProps } = componentProps;

  const { filteredItems } = useComboboxDerivedItemsContext();
  const store = useComboboxRootContext();

  const isEmpty = filteredItems.length === 0;
  const children = isEmpty ? childrenProp : null;

  const id = useComboboxDescriptionElementId('emptyElementId', idProp, isEmpty);

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, store.state.emptyRef],
    props: [
      {
        id,
        children,
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': true,
      },
      elementProps,
    ],
  });
});

export interface ComboboxEmptyState {}

export interface ComboboxEmptyProps extends BaseUIComponentProps<'div', ComboboxEmpty.State> {}

export namespace ComboboxEmpty {
  export type State = ComboboxEmptyState;
  export type Props = ComboboxEmptyProps;
}
