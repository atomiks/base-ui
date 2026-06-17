import { expect, vi } from 'vitest';
import { Combobox } from '@base-ui/react/combobox';
import { createRenderer } from '#test-utils';
import { screen, waitFor } from '@mui/internal-test-utils';

describe('<Combobox.Collection />', () => {
  const { render } = createRenderer();

  it('renders filtered items', async () => {
    await render(
      <Combobox.Root items={['alpha', 'beta', 'alpine']} defaultOpen>
        <Combobox.Input />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                <Combobox.Collection>
                  {(item) => (
                    <Combobox.Item key={item} value={item} data-testid={`item-${item}`}>
                      {item}
                    </Combobox.Item>
                  )}
                </Combobox.Collection>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    );

    expect(screen.getByTestId('item-alpha')).not.toBe(null);
    expect(screen.getByTestId('item-beta')).not.toBe(null);
    expect(screen.getByTestId('item-alpine')).not.toBe(null);
  });

  describe('item subtree memoization', () => {
    it('does not re-run flat item renderers on a membership-preserving keystroke', async () => {
      const renderItemSpy = vi.fn();
      // Every label contains "a", so typing it keeps the visible membership unchanged.
      const items = ['Apple', 'Apricot', 'Avocado'];

      const { user } = await render(
        <Combobox.Root items={items} defaultOpen>
          <Combobox.Input data-testid="input" />
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  <Combobox.Collection>
                    {(item: string) => {
                      renderItemSpy(item);
                      return (
                        <Combobox.Item key={item} value={item}>
                          <Combobox.ItemIndicator />
                          <span>{item}</span>
                        </Combobox.Item>
                      );
                    }}
                  </Combobox.Collection>
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>,
      );

      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(3));

      renderItemSpy.mockClear();

      await user.type(screen.getByTestId('input'), 'a');

      await waitFor(() => expect(screen.getByTestId('input')).toHaveValue('a'));
      expect(screen.getAllByRole('option')).toHaveLength(3);
      expect(renderItemSpy).not.toHaveBeenCalled();
    });

    it('does not re-run grouped item renderers on a membership-preserving keystroke', async () => {
      const renderItemSpy = vi.fn();
      // Every label contains "a", so typing it keeps the visible membership unchanged.
      const items = [
        {
          value: 'Fruits',
          items: [
            { id: 'apple', label: 'Apple' },
            { id: 'apricot', label: 'Apricot' },
          ],
        },
        {
          value: 'Vegetables',
          items: [
            { id: 'carrot', label: 'Carrot' },
            { id: 'kale', label: 'Kale' },
          ],
        },
      ];

      const { user } = await render(
        <Combobox.Root items={items} defaultOpen>
          <Combobox.Input data-testid="input" />
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  {(group: { value: string; items: Array<{ id: string; label: string }> }) => (
                    <Combobox.Group key={group.value} items={group.items}>
                      <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
                      <Combobox.Collection>
                        {(item: { id: string; label: string }) => {
                          renderItemSpy(item.id);
                          return (
                            <Combobox.Item key={item.id} value={item}>
                              <Combobox.ItemIndicator />
                              <span>{item.label}</span>
                            </Combobox.Item>
                          );
                        }}
                      </Combobox.Collection>
                    </Combobox.Group>
                  )}
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>,
      );

      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(4));

      renderItemSpy.mockClear();

      await user.type(screen.getByTestId('input'), 'a');

      await waitFor(() => expect(screen.getByTestId('input')).toHaveValue('a'));
      expect(screen.getAllByRole('option')).toHaveLength(4);
      expect(renderItemSpy).not.toHaveBeenCalled();
    });

    it('renders the correct items after a keystroke removes items from the middle', async () => {
      // "a" matches Apple and Avocado, but not Cherry (which sits between them).
      const items = ['Apple', 'Cherry', 'Avocado'];

      const { user } = await render(
        <Combobox.Root items={items} defaultOpen>
          <Combobox.Input data-testid="input" />
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  <Combobox.Collection>
                    {(item: string) => (
                      <Combobox.Item key={item} value={item}>
                        {item}
                      </Combobox.Item>
                    )}
                  </Combobox.Collection>
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>,
      );

      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(3));

      await user.type(screen.getByTestId('input'), 'a');

      await waitFor(() => expect(screen.getAllByRole('option')).toHaveLength(2));
      expect(screen.getByRole('option', { name: 'Apple' })).not.toBe(null);
      expect(screen.getByRole('option', { name: 'Avocado' })).not.toBe(null);
      expect(screen.queryByRole('option', { name: 'Cherry' })).toBe(null);
    });

    it('renders the correct items after the items prop is reordered', async () => {
      const itemsA = ['Apple', 'Banana', 'Cherry'];
      const itemsB = ['Cherry', 'Banana', 'Apple'];

      const { setProps } = await render(
        <Combobox.Root items={itemsA} defaultOpen>
          <Combobox.Input data-testid="input" />
          <Combobox.Portal>
            <Combobox.Positioner>
              <Combobox.Popup>
                <Combobox.List>
                  <Combobox.Collection>
                    {(item: string) => (
                      <Combobox.Item key={item} value={item}>
                        {item}
                      </Combobox.Item>
                    )}
                  </Combobox.Collection>
                </Combobox.List>
              </Combobox.Popup>
            </Combobox.Positioner>
          </Combobox.Portal>
        </Combobox.Root>,
      );

      await waitFor(() =>
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(itemsA),
      );

      await setProps({ items: itemsB });

      await waitFor(() =>
        expect(screen.getAllByRole('option').map((option) => option.textContent)).toEqual(itemsB),
      );
    });
  });
});
