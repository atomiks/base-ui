'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { BaseUIComponentProps } from '../../utils/types';
import { useBaseUiId } from '../../utils/useBaseUiId';
import { useRenderElement } from '../../utils/useRenderElement';
import { useComboboxRootContext } from '../root/ComboboxRootContext';

/**
 * Displays a status message whose content changes are announced politely to screen readers.
 * Useful for conveying the status of an asynchronously loaded list.
 * Renders a `<div>` element.
 */
export const ComboboxStatus = React.forwardRef(function ComboboxStatus(
  componentProps: ComboboxStatus.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { render, className, id: idProp, ...elementProps } = componentProps;

  const store = useComboboxRootContext();
  const id = useBaseUiId(idProp);

  useIsoLayoutEffect(() => {
    store.set('statusElementId', id);
    return () => {
      store.set('statusElementId', undefined);
    };
  }, [store, id]);

  return useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: [
      {
        id,
        role: 'status',
        'aria-live': 'polite',
        'aria-atomic': true,
      },
      elementProps,
    ],
  });
});

export interface ComboboxStatusState {}

export interface ComboboxStatusProps extends BaseUIComponentProps<'div', ComboboxStatus.State> {}

export namespace ComboboxStatus {
  export type State = ComboboxStatusState;
  export type Props = ComboboxStatusProps;
}
