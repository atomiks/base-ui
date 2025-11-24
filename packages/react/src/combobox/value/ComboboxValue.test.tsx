import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { createRenderer } from '#test-utils';
import { Combobox } from '@base-ui-components/react/combobox';

describe('<Combobox.Value />', () => {
  const { render } = createRenderer();

  it('displays labels for multiple values from items array', async () => {
    const items = [
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
    ];

    await render(
      <Combobox.Root items={items} value={['apple', 'banana']} multiple>
        <div data-testid="value">
          <Combobox.Value />
        </div>
      </Combobox.Root>,
    );

    expect(screen.getByTestId('value')).to.have.text('Apple, Banana');
  });

  it('falls back to raw values when items are not provided in multiple mode', async () => {
    await render(
      <Combobox.Root value={['apple', 'banana']} multiple>
        <div data-testid="value">
          <Combobox.Value />
        </div>
      </Combobox.Root>,
    );

    expect(screen.getByTestId('value')).to.have.text('apple, banana');
  });

  it('treats array values as a single value when not in multiple mode', async () => {
    await render(
      // @ts-expect-error
      <Combobox.Root value={['apple', 'banana']}>
        <div data-testid="value">
          <Combobox.Value />
        </div>
      </Combobox.Root>,
    );

    expect(screen.getByTestId('value')).to.have.text('["apple","banana"]');
  });
});
