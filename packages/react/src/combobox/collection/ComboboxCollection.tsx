'use client';
import * as React from 'react';
import { useComboboxDerivedItemsContext } from '../root/ComboboxRootContext';
import { useGroupCollectionContext } from './GroupCollectionContext';

const MemoizedCollectionItem = React.memo(function MemoizedCollectionItem(props: {
  item: any;
  index: number;
  renderItem: (item: any, index: number) => React.ReactNode;
}): React.ReactNode {
  const { item, index, renderItem } = props;
  return renderItem(item, index);
});

/**
 * Renders filtered list items.
 * Doesn't render its own HTML element.
 *
 * If rendering a flat list, pass a function child to the `List` component instead, which implicitly wraps it.
 *
 * Documentation: [Base UI Combobox](https://base-ui.com/react/components/combobox)
 */
export function ComboboxCollection(props: ComboboxCollection.Props): React.JSX.Element | null {
  const { children } = props;

  const { filteredItems } = useComboboxDerivedItemsContext();
  const groupContext = useGroupCollectionContext();

  const itemsToRender = groupContext ? groupContext.items : filteredItems;

  if (!itemsToRender) {
    return null;
  }

  return (
    <React.Fragment>
      {itemsToRender.map((item, index) => (
        // `Collection` re-renders from its own context subscription (not its parent), so the
        // user's `children` render function keeps a stable reference across keystrokes. Wrapping
        // each item in a memoized renderer lets React skip re-invoking `children` (and recreating
        // the item's subtree) when the item's identity is preserved across a keystroke.
        //
        // The key is the item's index rather than a value derived from the item. Filtering only
        // ever removes items (it preserves their relative order), and `Combobox.Item` derives all
        // of its visible state from props and the store on each render rather than holding local
        // state, so an index key reconciles correctly while still bailing out for the common
        // membership-preserving keystroke. See the tests for removal/reorder coverage.
        <MemoizedCollectionItem key={index} item={item} index={index} renderItem={children} />
      ))}
    </React.Fragment>
  );
}

export interface ComboboxCollectionState {}

export interface ComboboxCollectionProps {
  children: (item: any, index: number) => React.ReactNode;
}

export namespace ComboboxCollection {
  export type State = ComboboxCollectionState;
  export type Props = ComboboxCollectionProps;
}
