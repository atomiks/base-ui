'use client';
import * as React from 'react';
import type { BaseUIComponentProps } from '../../internals/types';
import { SelectItemContext, useSelectItemContext } from '../item/SelectItemContext';
import { useSelectItemAheadContext } from '../item/SelectItemAhead';
import type { TransitionStatus } from '../../internals/useTransitionStatus';
import { ItemIndicator } from '../../utils/ItemIndicator';

const SelectItemIndicatorView = React.memo(function SelectItemIndicatorView(
  viewProps: SelectItemIndicator.Props & { forwardedRef: React.ForwardedRef<HTMLSpanElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const { selected } = useSelectItemContext();

  return <ItemIndicator {...componentProps} selected={selected} ref={forwardedRef} />;
});

/**
 * Indicates whether the select item is selected.
 * Renders a `<span>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectItemIndicator = React.memo(
  React.forwardRef(function SelectItemIndicator(
    componentProps: SelectItemIndicator.Props,
    forwardedRef: React.ForwardedRef<HTMLSpanElement>,
  ) {
    const ahead = useSelectItemAheadContext();
    const item = React.useContext(SelectItemContext);

    // A closed item only takes part in typeahead, which the indicator has no part in. An
    // unselected item renders nothing either, unless kept mounted, so it skips the view. Outside
    // an item, the view throws the missing-context error.
    if (ahead || (item && !item.selected && !componentProps.keepMounted)) {
      return null;
    }

    return <SelectItemIndicatorView {...componentProps} forwardedRef={forwardedRef} />;
  }),
);

export interface SelectItemIndicatorState {
  /**
   * Whether the item is selected.
   */
  selected: boolean;
  /**
   * The transition status of the component.
   */
  transitionStatus: TransitionStatus;
}

export interface SelectItemIndicatorProps extends BaseUIComponentProps<
  'span',
  SelectItemIndicatorState
> {
  children?: React.ReactNode;
  /**
   * Whether to keep the HTML element in the DOM when the item is not selected.
   */
  keepMounted?: boolean | undefined;
}

export namespace SelectItemIndicator {
  export type State = SelectItemIndicatorState;
  export type Props = SelectItemIndicatorProps;
}
