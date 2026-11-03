'use client';
import * as React from 'react';
import type { BaseUIComponentProps } from '../../internals/types';
import { useSelectRootContext } from '../root/SelectRootContext';
import { popupTransitionStateMapping } from '../../utils/popups/popupStateMapping';
import type { TransitionStatus } from '../../internals/useTransitionStatus';
import { useRenderElement } from '../../internals/useRenderElement';

const SelectBackdropView = React.memo(function SelectBackdropView(
  viewProps: SelectBackdrop.Props & { forwardedRef: React.ForwardedRef<HTMLDivElement> },
) {
  const { forwardedRef, ...componentProps } = viewProps;
  const { render, className, style, ...elementProps } = componentProps;

  const store = useSelectRootContext();

  const open = store.useState('open');
  const mounted = store.useState('mounted');
  const transitionStatus = store.useState('transitionStatus');

  const state: SelectBackdropState = {
    open,
    transitionStatus,
  };

  const element = useRenderElement('div', componentProps, {
    state,
    ref: forwardedRef,
    props: [
      {
        role: 'presentation',
        hidden: !mounted,
        style: {
          userSelect: 'none',
          WebkitUserSelect: 'none',
        },
      },
      elementProps,
    ],
    stateAttributesMapping: popupTransitionStateMapping,
  });

  return element;
});

/**
 * An overlay displayed beneath the select popup.
 * Renders a `<div>` element.
 *
 * Documentation: [Base UI Select](https://base-ui.com/react/components/select)
 */
export const SelectBackdrop = React.forwardRef(function SelectBackdrop(
  componentProps: SelectBackdrop.Props,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  // While closed, render only the children, so the parts inside stay mounted without this
  // part's elements, state or effects.
  const mounted = useSelectRootContext().useState('mounted');
  if (!mounted) {
    return <React.Fragment>{componentProps.children}</React.Fragment>;
  }
  return <SelectBackdropView {...componentProps} forwardedRef={forwardedRef} />;
});

export interface SelectBackdropState {
  /**
   * Whether the component is open.
   */
  open: boolean;
  /**
   * The transition status of the component.
   */
  transitionStatus: TransitionStatus;
}

export interface SelectBackdropProps extends BaseUIComponentProps<'div', SelectBackdropState> {}

export namespace SelectBackdrop {
  export type State = SelectBackdropState;
  export type Props = SelectBackdropProps;
}
