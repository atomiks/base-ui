import * as React from 'react';
import { expect } from 'vitest';
import { act } from '@testing-library/react';
import { createRenderer } from '#test-utils';
import { CompositeList } from './CompositeList';
import { useCompositeListItem } from './useCompositeListItem';

describe('<CompositeList /> deep subtree registration', () => {
  const { render } = createRenderer();

  function Item(props: { label: string }) {
    const { ref, index } = useCompositeListItem();
    return <div ref={ref} data-testid={props.label} data-index={index} />;
  }

  it('registers an item mounted by a deep subtree state update', async () => {
    const elementsRef = {
      current: [] as Array<HTMLElement | null>,
    };

    let addItem: () => void;
    function DeepSection() {
      const [extra, setExtra] = React.useState(false);
      addItem = () => setExtra(true);
      return extra ? <Item label="extra" /> : null;
    }

    const { getByTestId } = await render(
      <CompositeList elementsRef={elementsRef}>
        <Item label="a" />
        <DeepSection />
        <Item label="b" />
      </CompositeList>,
    );

    expect(elementsRef.current).toHaveLength(2);

    act(() => {
      addItem!();
    });

    expect(elementsRef.current).toHaveLength(3);
    expect(getByTestId('extra')).toHaveAttribute('data-index', '1');
    expect(getByTestId('b')).toHaveAttribute('data-index', '2');
  });
});
