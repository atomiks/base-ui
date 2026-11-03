'use client';
import * as React from 'react';
import type { BaseUIComponentProps } from '../../internals/types';
import { useSelectRootContext } from '../root/SelectRootContext';
import { useSelectItemContext } from '../item/SelectItemContext';
import { useSelectItemAheadContext } from '../item/SelectItemAhead';
import { useRenderElement } from '../../internals/useRenderElement';

const SelectItemTextView = React.memo(function SelectItemTextView(
  viewProps: SelectItemText.Props & { forwardedRef: React.ForwardedRef<HTMLDivElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const { index, textRef, selectedByFocus } = useSelectItemContext();
  const store = useSelectRootContext();

  const { render, className, style, ...elementProps } = componentProps;

  const localRef = React.useCallback(
    (node: HTMLElement | null) => {
      if (!node) {
        return;
      }

      if (index === 0) {
        store.context.firstItemTextRef.current = node;
      }
      if (selectedByFocus) {
        store.context.selectedItemTextRef.current = node;
      }
    },
    [store, index, selectedByFocus],
  );

  const element = useRenderElement('div', componentProps, {
    ref: [localRef, forwardedRef, textRef],
    props: elementProps,
  });

  return element;
});

/**
 * A text label of the select item.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectItemText = React.memo(
  React.forwardRef(function SelectItemText(
    componentProps: SelectItemText.Props,
    forwardedRef: React.ForwardedRef<HTMLDivElement>,
  ) {
    const ahead = useSelectItemAheadContext();

    // In a closed item, render just the text for the item to register for typeahead.
    if (ahead) {
      return <span ref={ahead.textRef}>{componentProps.children}</span>;
    }

    return <SelectItemTextView {...componentProps} forwardedRef={forwardedRef} />;
  }),
);

export interface SelectItemTextState {}

export interface SelectItemTextProps extends BaseUIComponentProps<'div', SelectItemTextState> {}

export namespace SelectItemText {
  export type State = SelectItemTextState;
  export type Props = SelectItemTextProps;
}
