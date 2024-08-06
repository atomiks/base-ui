import * as React from 'react';
import * as Field from '@base_ui/react/Field';
import * as Checkbox from '@base_ui/react/Checkbox';
import * as Switch from '@base_ui/react/Switch';
import * as NumberField from '@base_ui/react/NumberField';
import * as Slider from '@base_ui/react/Slider';
import { createRenderer, screen } from '@mui/internal-test-utils';
import { expect } from 'chai';
import { describeConformance } from '../../../test/describeConformance';

describe('<Field.Description />', () => {
  const { render } = createRenderer();

  describeConformance(<Field.Description />, () => ({
    inheritComponent: 'p',
    refInstanceof: window.HTMLParagraphElement,
    render(node) {
      return render(<Field.Root>{node}</Field.Root>);
    },
  }));

  it('should set aria-describedby on the control automatically', () => {
    render(
      <Field.Root>
        <Field.Control />
        <Field.Description>Message</Field.Description>
      </Field.Root>,
    );

    expect(screen.getByRole('textbox')).to.have.attribute(
      'aria-describedby',
      screen.getByText('Message').id,
    );
  });

  describe('component integration', () => {
    describe('Checkbox', () => {
      it('supports Checkbox', () => {
        render(
          <Field.Root>
            <Checkbox.Root data-testid="button" />
            <Field.Description data-testid="description" />
          </Field.Root>,
        );

        expect(screen.getAllByRole('checkbox')[0]).to.have.attribute(
          'aria-describedby',
          screen.getByTestId('description').id,
        );
      });
    });

    describe('Switch', () => {
      it('supports Switch', () => {
        render(
          <Field.Root>
            <Switch.Root data-testid="button" />
            <Field.Description data-testid="description" />
          </Field.Root>,
        );

        expect(screen.getByRole('checkbox')).to.have.attribute(
          'aria-describedby',
          screen.getByTestId('description').id,
        );
      });
    });

    describe('NumberField', () => {
      it('supports NumberField', () => {
        render(
          <Field.Root>
            <NumberField.Root>
              <NumberField.Input />
            </NumberField.Root>
            <Field.Description data-testid="description" />
          </Field.Root>,
        );

        expect(screen.getByRole('textbox')).to.have.attribute(
          'aria-describedby',
          screen.getByTestId('description').id,
        );
      });
    });

    describe('Slider', () => {
      it('supports Slider', () => {
        render(
          <Field.Root>
            <Slider.Root data-testid="slider">
              <Slider.Control />
            </Slider.Root>
            <Field.Description data-testid="description" />
          </Field.Root>,
        );

        expect(screen.getByTestId('slider')).to.have.attribute(
          'aria-describedby',
          screen.getByTestId('description').id,
        );
      });
    });
  });
});