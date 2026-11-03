'use client';
import * as React from 'react';
import { useSelectPositionerMounted } from '../positioner/SelectPositionerMountedContext';
import type { BaseUIComponentProps, HTMLProps } from '../../internals/types';
import { useSelectRootContext } from '../root/SelectRootContext';
import { useSelectPositionerContext } from '../positioner/SelectPositionerContext';
import { useRenderElement } from '../../internals/useRenderElement';
import { styleDisableScrollbar } from '../../utils/styles';
import { LIST_FUNCTIONAL_STYLES } from '../popup/utils';
import { useSelectFilterImpl } from '../filter-root/SelectFilterContext';

const SelectListView = React.memo(function SelectListView(
  viewProps: SelectList.Props & { forwardedRef: React.ForwardedRef<HTMLDivElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const { render, className, style, ...elementProps } = componentProps;

  const store = useSelectRootContext();
  const multiple = store.useState('multiple');
  const readOnly = store.useState('readOnly');
  const { alignItemWithTriggerActive } = useSelectPositionerContext();

  const hasScrollArrows = store.useState('hasScrollArrows');
  const openMethod = store.useState('openMethod');
  const id = store.useState('id');

  const defaultProps: HTMLProps = {
    id: `${id}-list`,
    role: 'listbox',
    'aria-multiselectable': multiple || undefined,
    'aria-readonly': readOnly || undefined,
    onScroll(event) {
      store.context.scrollHandlerRef.current?.(event.currentTarget);
    },
    ...(alignItemWithTriggerActive && {
      style: LIST_FUNCTIONAL_STYLES,
    }),
    className:
      hasScrollArrows && openMethod !== 'touch' ? styleDisableScrollbar.className : undefined,
  };

  const setListElement = store.useStateSetter('listElement');

  return useRenderElement('div', componentProps, {
    ref: [forwardedRef, setListElement],
    props: [defaultProps, elementProps],
  });
});

/**
 * A container for the select items.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectList = React.forwardRef(function SelectList(
  componentProps: SelectList.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const filterImpl = useSelectFilterImpl();
  // While closed, render only the children, so the parts inside stay mounted without this
  // part's elements, state or effects.
  const mounted = useSelectPositionerMounted() !== false;
  if (!mounted) {
    return <React.Fragment>{componentProps.children}</React.Fragment>;
  }
  if (filterImpl) {
    return <filterImpl.List {...componentProps} ref={forwardedRef} />;
  }
  return <SelectListView {...componentProps} forwardedRef={forwardedRef} />;
});

export interface SelectListProps extends BaseUIComponentProps<'div', SelectListState> {}

export interface SelectListState {}

export namespace SelectList {
  export type Props = SelectListProps;
  export type State = SelectListState;
}
