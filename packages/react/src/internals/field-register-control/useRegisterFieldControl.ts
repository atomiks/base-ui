'use client';
import * as React from 'react';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useFieldRootContext } from '../field-root-context/FieldRootContext';
import type { FieldControlRegistration } from './useFieldControlRegistration';

export function useRegisterFieldControl(
  controlRef: FieldControlRegistration['controlRef'],
  id: FieldControlRegistration['id'],
  value: FieldControlRegistration['value'],
  enabled: boolean,
  name?: FieldControlRegistration['name'],
  resetValue?: FieldControlRegistration['resetValue'],
  getValue?: FieldControlRegistration['getValue'],
) {
  const { registerFieldControl } = useFieldRootContext();
  const sourceRef = React.useRef<symbol | null>(null);

  if (!sourceRef.current) {
    sourceRef.current = Symbol();
  }

  useIsoLayoutEffect(() => {
    const source = sourceRef.current;

    if (!source || !enabled) {
      return undefined;
    }

    const registration: FieldControlRegistration = {
      controlRef,
      getValue,
      id,
      name,
      resetValue,
      value,
    };

    registerFieldControl(source, registration);

    return () => {
      registerFieldControl(source, undefined);
    };
  }, [controlRef, enabled, getValue, id, name, registerFieldControl, resetValue, value]);
}
