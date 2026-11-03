'use client';
import * as React from 'react';
import { useSelectPositionerMounted } from '../positioner/SelectPositionerMountedContext';
import { FilterDropdownClear } from '../../filter-dropdown/clear/FilterDropdownClear';
import type {
  FilterDropdownClearProps,
  FilterDropdownClearState,
} from '../../filter-dropdown/clear/FilterDropdownClear';
import { useSelectFilterPart } from '../filter-root/SelectFilterContext';

const SelectClearView = React.forwardRef(function SelectClearView(
  props: SelectClear.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  useSelectFilterPart('Clear');
  return <FilterDropdownClear {...props} ref={forwardedRef} />;
});

/**
 * A button that clears the input text.
 * Requires the select to be wrapped in `Select.FilterProvider`.
 * Renders a `<button>` element when the input has text.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectClear = React.forwardRef(function SelectClear(
  componentProps: SelectClear.Props,
  forwardedRef: React.ForwardedRef<HTMLButtonElement>,
) {
  // Nothing here takes part in typeahead, so it renders nothing while the select is closed.
  if (useSelectPositionerMounted() === false) {
    return null;
  }
  return <SelectClearView {...componentProps} ref={forwardedRef} />;
});

export interface SelectClearState extends FilterDropdownClearState {}
export interface SelectClearProps extends FilterDropdownClearProps {}

export namespace SelectClear {
  export type State = SelectClearState;
  export type Props = SelectClearProps;
}
