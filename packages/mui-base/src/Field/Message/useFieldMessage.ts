import * as React from 'react';
import { mergeReactProps } from '../../utils/mergeReactProps';
import { useId } from '../../utils/useId';
import { useEnhancedEffect } from '../../utils/useEnhancedEffect';
import { useFieldRootContext } from '../Root/FieldRootContext';

interface UseFieldMessageParameters {
  id: string | undefined;
  rendered: boolean;
}

/**
 *
 * API:
 *
 * - [useFieldMessage API](https://mui.com/base-ui/api/use-field-message/)
 */
export function useFieldMessage(params: UseFieldMessageParameters) {
  const { id: idProp, rendered } = params;

  const { setMessageIds, validityData } = useFieldRootContext();

  const id = useId(idProp);

  useEnhancedEffect(() => {
    if (!rendered || !id) {
      return undefined;
    }

    setMessageIds((v) => v.concat(id));

    return () => {
      setMessageIds((v) => v.filter((item) => item !== id));
    };
  }, [rendered, id, setMessageIds]);

  const getMessageProps = React.useCallback(
    (externalProps = {}) =>
      mergeReactProps<'p'>(externalProps, {
        id,
        children: validityData?.validityMessage,
      }),
    [id, validityData],
  );

  return React.useMemo(
    () => ({
      getMessageProps,
    }),
    [getMessageProps],
  );
}