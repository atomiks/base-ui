'use client';
import * as React from 'react';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { useEnhancedEffect } from '../../utils/useEnhancedEffect';
import { useId } from '../../utils/useId';
import { useFieldRootContext } from '../Root/FieldRootContext';
import { useFieldControlValidation } from './useFieldControlValidation';

interface UseFieldControlParameters {
  id?: string;
  name?: string;
}

/**
 *
 * API:
 *
 * - [useFieldControl API](https://mui.com/base-ui/api/use-field-control/)
 */
export function useFieldControl(params: UseFieldControlParameters) {
  const { id: idProp, name } = params;

  const { setControlId, labelId, disabled } = useFieldRootContext();

  const { getValidationProps, getInputValidationProps, commitValidation, inputRef } =
    useFieldControlValidation();

  const id = useId(idProp);

  useEnhancedEffect(() => {
    setControlId(id);
    return () => {
      setControlId(undefined);
    };
  }, [id, setControlId]);

  const getControlProps = React.useCallback(
    (externalProps = {}) =>
      mergeReactProps<'input'>(getValidationProps(getInputValidationProps(externalProps)), {
        id,
        disabled,
        name,
        ref: inputRef,
        'aria-labelledby': labelId,
        onBlur(event) {
          commitValidation(event.currentTarget.value);
        },
      }),
    [
      getValidationProps,
      getInputValidationProps,
      id,
      disabled,
      name,
      inputRef,
      labelId,
      commitValidation,
    ],
  );

  return React.useMemo(
    () => ({
      getControlProps,
    }),
    [getControlProps],
  );
}
