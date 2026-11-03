'use client';
import * as React from 'react';
import { useSelectPositionerMounted } from '../positioner/SelectPositionerMountedContext';
import type { BaseUIComponentProps } from '../../internals/types';
import { SelectGroupContext } from './SelectGroupContext';
import { useRenderElement } from '../../internals/useRenderElement';
import { useSelectFilterImpl } from '../filter-root/SelectFilterContext';

const SelectGroupView = React.memo(function SelectGroupView(
  viewProps: SelectGroup.Props & { forwardedRef: React.ForwardedRef<HTMLDivElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const { render, className, style, ...elementProps } = componentProps;

  const [labelId, setLabelId] = React.useState<string | undefined>();

  const contextValue: SelectGroupContext = React.useMemo(
    () => ({
      labelId,
      setLabelId,
    }),
    [labelId, setLabelId],
  );

  const element = useRenderElement('div', componentProps, {
    ref: forwardedRef,
    props: [
      {
        role: 'group',
        'aria-labelledby': labelId,
      },
      elementProps,
    ],
  });

  return <SelectGroupContext.Provider value={contextValue}>{element}</SelectGroupContext.Provider>;
});

/**
 * The open group, taking a ref, for the filterable select's group to wrap.
 *
 * @internal
 */
export const SelectGroupPlain = React.forwardRef(function SelectGroupPlain(
  componentProps: SelectGroup.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  return <SelectGroupView {...componentProps} forwardedRef={forwardedRef} />;
});

/**
 * Groups related select items with the corresponding label.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectGroup = React.forwardRef(function SelectGroup(
  componentProps: SelectGroup.Props,
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
    return <filterImpl.Group {...componentProps} ref={forwardedRef} />;
  }
  return <SelectGroupView {...componentProps} forwardedRef={forwardedRef} />;
});

export interface SelectGroupState {}

export interface SelectGroupProps extends BaseUIComponentProps<'div', SelectGroupState> {}

export namespace SelectGroup {
  export type State = SelectGroupState;
  export type Props = SelectGroupProps;
}
