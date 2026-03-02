import { Combobox } from '@base-ui/react/combobox';
import { createRenderer, describeConformance } from '#test-utils';
import { screen, waitFor } from '@mui/internal-test-utils';
import { expect } from 'chai';

describe('<Combobox.Status />', () => {
  const { render } = createRenderer();

  describeConformance(<Combobox.Status />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<Combobox.Root>{node}</Combobox.Root>);
    },
  }));

  it('renders only when open', async () => {
    const { user } = await render(
      <Combobox.Root>
        <Combobox.Input data-testid="input" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.Status />
              <Combobox.List>
                <Combobox.Item value="a">a</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    );

    expect(screen.queryByRole('status')).to.equal(null);
    await user.click(screen.getByTestId('input'));
    await waitFor(() => expect(screen.getByRole('status')).not.to.equal(null));
  });

  it('sets aria-describedby on the input to the status id', async () => {
    const { user } = await render(
      <Combobox.Root>
        <Combobox.Input data-testid="input" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                <Combobox.Item value="a">a</Combobox.Item>
              </Combobox.List>
              <Combobox.Status>Results are limited</Combobox.Status>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    );

    await user.click(screen.getByTestId('input'));

    await screen.findByRole('listbox');
    const input = screen.getByTestId('input');
    const status = screen.getByRole('status');

    expect(status.id).not.to.equal('');
    expect(input).to.have.attribute('aria-describedby', status.id);
  });

  it('appends status id to existing aria-describedby on the input', async () => {
    const { user } = await render(
      <Combobox.Root>
        <Combobox.Input data-testid="input" aria-describedby="existing-description" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup>
              <Combobox.List>
                <Combobox.Item value="a">a</Combobox.Item>
              </Combobox.List>
              <Combobox.Status id="status-id">Results are limited</Combobox.Status>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>,
    );

    await user.click(screen.getByTestId('input'));

    await screen.findByRole('listbox');
    expect(screen.getByTestId('input')).to.have.attribute(
      'aria-describedby',
      'existing-description status-id',
    );
  });
});
