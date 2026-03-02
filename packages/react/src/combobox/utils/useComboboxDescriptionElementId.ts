'use client';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { useBaseUiId } from '../../utils/useBaseUiId';
import { useComboboxRootContext } from '../root/ComboboxRootContext';

export function useComboboxDescriptionElementId(
  elementIdName: 'emptyElementId' | 'statusElementId',
  idProp: string | undefined,
  enabled: boolean = true,
) {
  const store = useComboboxRootContext();
  const id = useBaseUiId(idProp);

  useIsoLayoutEffect(() => {
    if (!enabled) {
      return undefined;
    }

    store.set(elementIdName, id);
    return () => {
      store.set(elementIdName, undefined);
    };
  }, [enabled, elementIdName, id, store]);

  return id;
}
