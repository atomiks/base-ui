import { expect, vi } from 'vitest';
import * as React from 'react';
import { Form } from '@base-ui/react/form';
import { Field } from '@base-ui/react/field';
import { Fieldset } from '@base-ui/react/fieldset';
import { NumberField } from '@base-ui/react/number-field';
import { Switch } from '@base-ui/react/switch';
import { Radio } from '@base-ui/react/radio';
import { RadioGroup } from '@base-ui/react/radio-group';
import { Checkbox } from '@base-ui/react/checkbox';
import { CheckboxGroup } from '@base-ui/react/checkbox-group';
import {
  createRenderer,
  fireEvent,
  flushMicrotasks,
  screen,
  waitFor,
} from '@mui/internal-test-utils';
import { describeConformance } from '../../test/describeConformance';

describe('<Form />', () => {
  const { render } = createRenderer();

  describeConformance(<Form />, () => ({
    refInstanceof: window.HTMLFormElement,
    render,
  }));

  it('does not submit if there are errors', async () => {
    const onSubmit = vi.fn();

    const { user } = render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Field.Control required />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button>Submit</button>
      </Form>,
    );

    const submit = screen.getByRole('button');

    await user.click(submit);

    expect(screen.getByTestId('error')).toBeInTheDocument();
    expect(onSubmit.mock.calls.length > 0).toBe(false);
  });

  it('submits when a valid async validator is pending', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });
    const validate = vi.fn(() => new Promise<null>(() => {}));

    render(
      <Form onSubmit={onSubmit}>
        <Field.Root validate={validate}>
          <Field.Control />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(validate).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not submit if an unnamed registered field control is invalid', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    const { user } = render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Switch.Root required />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByRole('switch')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('error')).toBeInTheDocument();
  });

  it('clears invalid state for an unnamed registered field control on change', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    const { user } = render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Switch.Root required />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    const submit = screen.getByRole('button', { name: 'Submit' });
    const switchControl = screen.getByRole('switch');

    await user.click(submit);

    expect(onSubmit).not.toHaveBeenCalled();
    expect(switchControl).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('error')).toBeInTheDocument();

    await user.click(switchControl);

    expect(switchControl).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('error')).toBe(null);

    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('keeps same-name field validity scoped on submit', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    const { user } = render(
      <Form onSubmit={onSubmit}>
        <Field.Root name="shared">
          <Switch.Root required data-testid="first" />
          <Field.Error data-testid="first-error" />
        </Field.Root>
        <Field.Root name="shared">
          <Switch.Root required defaultChecked data-testid="second" />
          <Field.Error data-testid="second-error" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(onSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('first')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('first-error')).toBeInTheDocument();
    expect(screen.getByTestId('second')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('second-error')).toBe(null);
  });

  it('removes the previous registered field id when another control takes over', async () => {
    const onSubmit = vi.fn((event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
    });

    const { user } = render(
      <Form onSubmit={onSubmit}>
        <Field.Root>
          <Switch.Root required data-testid="first" />
          <Switch.Root required defaultChecked data-testid="second" />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    const submit = screen.getByRole('button', { name: 'Submit' });

    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(screen.queryByTestId('error')).toBe(null);
    expect(screen.getByTestId('first')).not.toHaveAttribute('aria-invalid');
    expect(screen.getByTestId('second')).not.toHaveAttribute('aria-invalid');
  });

  it('unmounted fields should be removed from the form', async () => {
    const submitSpy = vi.fn((event) => event.preventDefault());
    function App() {
      const [checked, setChecked] = React.useState(true);

      return (
        <Form onSubmit={submitSpy}>
          <Field.Root name="name">
            <Field.Control defaultValue="Alice" />
          </Field.Root>

          <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)} />

          {checked && (
            <Field.Root name="email">
              <Field.Control defaultValue="" required data-testid="email" />
            </Field.Root>
          )}

          <button>Submit</button>
        </Form>
      );
    }

    const { user } = await render(<App />);

    const submit = screen.getByText('Submit');

    await user.click(submit);
    expect(submitSpy.mock.calls.length).toBe(0);
    expect(screen.getByTestId('email')).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('checkbox'));
    await user.click(submit);
    expect(submitSpy.mock.calls.length).toBe(1);
  });

  it('excludes disabled fieldset fields from validation and onFormSubmit values', async () => {
    const handleSubmit = vi.fn();

    render(
      <Form onFormSubmit={handleSubmit}>
        <Fieldset.Root disabled>
          <Field.Root name="disabled">
            <Field.Control required data-testid="disabled" />
          </Field.Root>
        </Fieldset.Root>
        <Field.Root name="enabled">
          <Field.Control defaultValue="sent" />
        </Field.Root>
        <button type="submit">Submit</button>
      </Form>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.lastCall?.[0]).toEqual({ enabled: 'sent' });
    expect(screen.getByTestId('disabled')).not.toHaveAttribute('aria-invalid');
  });

  it('clears invalid UI when a fieldset field becomes disabled', async () => {
    const handleSubmit = vi.fn();

    function App() {
      const [disabled, setDisabled] = React.useState(false);

      return (
        <Form onFormSubmit={handleSubmit}>
          <Fieldset.Root disabled={disabled}>
            <Field.Root name="disabled">
              <Field.Control required data-testid="control" />
              <Field.Error data-testid="error" />
            </Field.Root>
          </Fieldset.Root>
          <button type="button" onClick={() => setDisabled(true)}>
            Disable
          </button>
          <button type="submit">Submit</button>
        </Form>
      );
    }

    const { user } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('control')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByTestId('error')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Disable' }));

    expect(screen.getByTestId('control')).toBeDisabled();
    expect(screen.getByTestId('control')).not.toHaveAttribute('aria-invalid');
    expect(screen.queryByTestId('error')).toBe(null);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.lastCall?.[0]).toEqual({});
  });

  it('clears invalid attributes when a field control becomes disabled', async () => {
    const handleSubmit = vi.fn();

    function App() {
      const [disabled, setDisabled] = React.useState(false);

      return (
        <Form onFormSubmit={handleSubmit}>
          <Field.Root name="disabled">
            <Field.Control disabled={disabled} required data-testid="control" />
          </Field.Root>
          <button type="button" onClick={() => setDisabled(true)}>
            Disable
          </button>
          <button type="submit">Submit</button>
        </Form>
      );
    }

    const { user } = render(<App />);

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(screen.getByTestId('control')).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('button', { name: 'Disable' }));

    expect(screen.getByTestId('control')).toBeDisabled();
    expect(screen.getByTestId('control')).not.toHaveAttribute('aria-invalid');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.lastCall?.[0]).toEqual({});
  });

  it('re-registers field controls when they become enabled again', async () => {
    const handleSubmit = vi.fn();

    function App() {
      const [disabled, setDisabled] = React.useState(false);

      return (
        <Form onFormSubmit={handleSubmit}>
          <Field.Root name="control">
            <Field.Control disabled={disabled} required data-testid="control" />
          </Field.Root>
          <button type="button" onClick={() => setDisabled(true)}>
            Disable
          </button>
          <button type="button" onClick={() => setDisabled(false)}>
            Enable
          </button>
          <button type="submit">Submit</button>
        </Form>
      );
    }

    const { user } = render(<App />);
    const submit = screen.getByRole('button', { name: 'Submit' });

    await user.click(submit);

    expect(handleSubmit).not.toHaveBeenCalled();
    expect(screen.getByTestId('control')).toHaveAttribute('aria-invalid', 'true');

    await user.click(screen.getByRole('button', { name: 'Disable' }));
    await user.click(submit);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit.mock.lastCall?.[0]).toEqual({});

    await user.click(screen.getByRole('button', { name: 'Enable' }));
    await user.click(submit);

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('control')).toHaveAttribute('aria-invalid', 'true');

    await user.type(screen.getByTestId('control'), 'sent');
    await user.click(submit);

    expect(handleSubmit).toHaveBeenCalledTimes(2);
    expect(handleSubmit.mock.lastCall?.[0]).toEqual({ control: 'sent' });
  });

  describe('prop: errors', () => {
    it('should mark <Field.Control> as invalid and populate <Field.Error>', () => {
      render(
        <Form errors={{ foo: 'bar' }}>
          <Field.Root name="foo">
            <Field.Control />
            <Field.Error data-testid="error" />
          </Field.Root>
        </Form>,
      );

      expect(screen.getByTestId('error')).toHaveTextContent('bar');
      expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
    });

    it('should not mark <Field.Control> as invalid if no error is provided', () => {
      render(
        <Form>
          <Field.Root name="foo">
            <Field.Control />
            <Field.Error data-testid="error" />
          </Field.Root>
        </Form>,
      );

      expect(screen.queryByTestId('error')).toBe(null);
      expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
    });

    function App() {
      const [errors, setErrors] = React.useState<Form.Props['errors']>({});

      return (
        <Form
          errors={errors}
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const name = formData.get('name') as string;
            const age = formData.get('age') as string;

            setErrors({
              ...(name === '' && { name: 'Name is required' }),
              ...(age === '' && { age: 'Age is required' }),
            });
          }}
        >
          <Field.Root name="name">
            <Field.Control data-testid="name" />
            <Field.Error data-testid="name-error" />
          </Field.Root>
          <Field.Root name="age">
            <Field.Control data-testid="age" />
            <Field.Error data-testid="age-error" />
          </Field.Root>
          <button type="submit">Submit</button>
        </Form>
      );
    }

    it('focuses the first invalid field only on submit', async () => {
      const { user } = render(<App />);

      const submit = screen.getByRole('button');
      const name = screen.getByTestId('name');
      const age = screen.getByTestId('age');

      await user.click(submit);

      expect(name).toHaveFocus();

      fireEvent.change(name, { target: { value: 'John' } });

      expect(age).not.toHaveFocus();

      await user.click(submit);

      expect(age).toHaveFocus();

      fireEvent.change(age, { target: { value: '42' } });

      await user.click(submit);

      expect(age).not.toHaveFocus();
    });

    it('does not swap focus immediately on change after two submissions', async () => {
      const { user } = render(<App />);

      const submit = screen.getByRole('button');
      const name = screen.getByTestId('name');
      const age = screen.getByTestId('age');

      await user.click(submit);

      expect(name).toHaveFocus();

      await user.click(submit);

      fireEvent.change(name, { target: { value: 'John' } });

      expect(age).not.toHaveFocus();
    });

    it('removes errors upon change', async () => {
      render(<App />);

      const name = screen.getByTestId('name');
      const age = screen.getByTestId('age');

      fireEvent.click(screen.getByText('Submit'));

      expect(screen.queryByTestId('name-error')).not.toBe(null);
      expect(screen.queryByTestId('age-error')).not.toBe(null);

      fireEvent.change(name, { target: { value: 'John' } });
      fireEvent.change(age, { target: { value: '42' } });
      expect(screen.queryByTestId('name-error')).toBe(null);
      expect(screen.queryByTestId('age-error')).toBe(null);
    });

    it('runs field validation on first change after Form error is set', async () => {
      const validateSpy = vi.fn((value: unknown) => {
        if (value === 'abcd') {
          return 'field error';
        }
        return null;
      });

      function Test() {
        const [errors, setErrors] = React.useState<Form.Props['errors']>({});

        return (
          <Form
            errors={errors}
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              const name = formData.get('name') as string;

              if (name === 'abcde') {
                setErrors({ name: 'submit error' });
              } else {
                setErrors({});
              }
            }}
          >
            <Field.Root name="name" validate={validateSpy}>
              <Field.Control data-testid="name" />
              <Field.Error data-testid="name-error" />
            </Field.Root>
            <button type="submit">Submit</button>
          </Form>
        );
      }

      const { user } = render(<Test />);

      const input = screen.getByTestId('name');
      await user.click(input);
      await user.keyboard('abcde');
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      expect(screen.queryByTestId('name-error')).not.toBe(null);
      expect(screen.getByTestId('name-error')).toHaveTextContent('submit error');

      validateSpy.mockClear();

      await user.click(input);
      // value changes from 'abcde' to 'abcd'
      await user.keyboard('{Backspace}');
      expect(validateSpy.mock.calls.length).toBe(1);
      expect(screen.queryByTestId('name-error')).not.toBe(null);
      expect(screen.getByTestId('name-error')).toHaveTextContent('field error');
    });

    it('runs field validation on change when invalid prop is true and validationMode is onChange', async () => {
      const validateSpy = vi.fn(() => 'field error');

      function Test() {
        return (
          <Form errors={{ name: 'server error' }}>
            <Field.Root name="name" invalid validate={validateSpy} validationMode="onChange">
              <Field.Control data-testid="name" />
              <Field.Error data-testid="name-error" />
            </Field.Root>
          </Form>
        );
      }

      const { user } = render(<Test />);

      const input = screen.getByTestId('name');
      expect(screen.getByTestId('name-error')).toHaveTextContent('server error');

      await user.click(input);
      await user.keyboard('a');

      expect(validateSpy.mock.calls.length).toBe(1);
      expect(screen.getByTestId('name-error')).toHaveTextContent('field error');
      expect(input).toHaveAttribute('aria-invalid', 'true');
    });

    it('does not run field validation on change for onBlur mode when invalid prop is true', async () => {
      const validateSpy = vi.fn(() => 'field error');

      function Test() {
        return (
          <Form errors={{ name: 'server error' }}>
            <Field.Root name="name" invalid validate={validateSpy} validationMode="onBlur">
              <Field.Control data-testid="name" />
              <Field.Error data-testid="name-error" />
            </Field.Root>
          </Form>
        );
      }

      const { user } = render(<Test />);

      const input = screen.getByTestId('name');
      expect(screen.getByTestId('name-error')).toHaveTextContent('server error');

      await user.click(input);
      await user.keyboard('a');
      expect(validateSpy.mock.calls.length).toBe(0);
      expect(screen.queryByTestId('name-error')).toBe(null);

      await user.tab();
      expect(validateSpy.mock.calls.length).toBe(1);
      expect(screen.getByTestId('name-error')).toHaveTextContent('field error');
    });
  });

  describe('prop: onFormSubmit', () => {
    it('runs when the form is submitted', async () => {
      const submitSpy = vi.fn((formValues, eventDetails) => ({ formValues, eventDetails }));

      function App() {
        return (
          <Form onFormSubmit={submitSpy}>
            <Field.Root name="username">
              <Field.Control defaultValue="alice132" />
            </Field.Root>
            <Field.Root name="quantity">
              <NumberField.Root defaultValue={5}>
                <NumberField.Input />
              </NumberField.Root>
            </Field.Root>
            <button type="submit">submit</button>
          </Form>
        );
      }

      render(<App />);

      fireEvent.click(screen.getByText('submit'));

      expect(submitSpy.mock.calls.length).toBe(1);
      expect(submitSpy.mock.results.at(-1)?.value.formValues).toEqual({
        username: 'alice132',
        quantity: 5,
      });
      expect(submitSpy.mock.results.at(-1)?.value.eventDetails.event.defaultPrevented).toBe(true);
    });

    it('does not run when the form is invalid', async () => {
      const submitSpy = vi.fn();

      function App() {
        return (
          <Form onFormSubmit={submitSpy}>
            <Field.Root name="username">
              <Field.Control defaultValue="" required />
              <Field.Error data-testid="error" />
            </Field.Root>
            <button type="submit">submit</button>
          </Form>
        );
      }
      render(<App />);
      expect(screen.queryByTestId('error')).toBe(null);
      fireEvent.click(screen.getByText('submit'));
      expect(submitSpy.mock.calls.length).toBe(0);
      expect(screen.queryByTestId('error')).not.toBe(null);
    });
  });

  it('clears Base UI field state on native reset', async () => {
    render(
      <Form>
        <Field.Root data-testid="field">
          <Field.Control required defaultValue="Alice" data-testid="input" />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </Form>,
    );

    const field = screen.getByTestId('field');
    const input = screen.getByTestId<HTMLInputElement>('input');

    fireEvent.change(input, { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('data-invalid', '');
    expect(field).toHaveAttribute('data-dirty', '');
    expect(screen.getByTestId('error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(input).not.toHaveAttribute('aria-invalid');
    });

    expect(input).toHaveValue('Alice');
    expect(field).not.toHaveAttribute('data-invalid');
    expect(field).not.toHaveAttribute('data-dirty');
    expect(screen.queryByTestId('error')).toBe(null);
  });

  it('resets registered switch state on native reset', async () => {
    render(
      <Form>
        <Field.Root data-testid="field">
          <Switch.Root defaultChecked required />
          <Field.Error data-testid="error" />
        </Field.Root>
        <button type="submit">Submit</button>
        <button type="reset">Reset</button>
      </Form>,
    );

    const field = screen.getByTestId('field');
    const switchControl = screen.getByRole('switch');

    fireEvent.click(switchControl);
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(switchControl).toHaveAttribute('aria-checked', 'false');
    expect(switchControl).toHaveAttribute('aria-invalid', 'true');
    expect(field).toHaveAttribute('data-invalid', '');
    expect(field).toHaveAttribute('data-dirty', '');
    expect(screen.getByTestId('error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(switchControl).toHaveAttribute('aria-checked', 'true');
    });

    expect(switchControl).not.toHaveAttribute('aria-invalid');
    expect(field).not.toHaveAttribute('data-invalid');
    expect(field).not.toHaveAttribute('data-dirty');
    expect(screen.queryByTestId('error')).toBe(null);
  });

  it('resets registered radio group state on native reset', async () => {
    render(
      <Form>
        <Field.Root data-testid="field">
          <RadioGroup defaultValue="red">
            <Radio.Root value="red" data-testid="red" />
            <Radio.Root value="green" data-testid="green" />
          </RadioGroup>
        </Field.Root>
        <button type="reset">Reset</button>
      </Form>,
    );

    const field = screen.getByTestId('field');
    const red = screen.getByTestId('red');
    const green = screen.getByTestId('green');

    fireEvent.click(green);

    await waitFor(() => {
      expect(field).toHaveAttribute('data-dirty', '');
    });

    expect(red).toHaveAttribute('aria-checked', 'false');
    expect(green).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(red).toHaveAttribute('aria-checked', 'true');
    });

    expect(green).toHaveAttribute('aria-checked', 'false');
    expect(field).not.toHaveAttribute('data-dirty');
  });

  it('resets registered checkbox group state on native reset', async () => {
    render(
      <Form>
        <Field.Root name="colors" data-testid="field">
          <CheckboxGroup defaultValue={['red']}>
            <Checkbox.Root value="red" data-testid="red" />
            <Checkbox.Root value="green" data-testid="green" />
          </CheckboxGroup>
        </Field.Root>
        <button type="reset">Reset</button>
      </Form>,
    );

    const field = screen.getByTestId('field');
    const red = screen.getByTestId('red');
    const green = screen.getByTestId('green');

    fireEvent.click(green);

    await waitFor(() => {
      expect(field).toHaveAttribute('data-dirty', '');
    });

    expect(red).toHaveAttribute('aria-checked', 'true');
    expect(green).toHaveAttribute('aria-checked', 'true');

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));

    await waitFor(() => {
      expect(green).toHaveAttribute('aria-checked', 'false');
    });

    expect(red).toHaveAttribute('aria-checked', 'true');
    expect(field).not.toHaveAttribute('data-dirty');
  });

  it('does not mark a controlled checkbox group dirty after resetting to an equal array', async () => {
    function App() {
      const [value, setValue] = React.useState(['red']);

      return (
        <React.Fragment>
          <Form>
            <Field.Root name="colors" data-testid="field">
              <CheckboxGroup value={value} onValueChange={setValue}>
                <Checkbox.Root value="red" data-testid="red" />
                <Checkbox.Root value="green" data-testid="green" />
              </CheckboxGroup>
            </Field.Root>
            <button type="reset">Reset</button>
          </Form>
          <button type="button" onClick={() => setValue(['red'])}>
            Clone value
          </button>
        </React.Fragment>
      );
    }

    render(<App />);

    const field = screen.getByTestId('field');

    fireEvent.click(screen.getByRole('button', { name: 'Clone value' }));
    expect(field).not.toHaveAttribute('data-dirty');

    fireEvent.click(screen.getByRole('button', { name: 'Reset' }));
    await flushMicrotasks();

    expect(field).not.toHaveAttribute('data-dirty');
  });

  it('does not submit when invalid prop remains true even if validate returns null', async () => {
    const submitSpy = vi.fn();
    const validateSpy = vi.fn(() => null);

    const { user } = render(
      <Form onSubmit={submitSpy}>
        <Field.Root name="name" invalid validate={validateSpy} validationMode="onChange">
          <Field.Control data-testid="name" />
          <Field.Error data-testid="name-error" />
        </Field.Root>
        <button type="submit">submit</button>
      </Form>,
    );

    const input = screen.getByTestId('name');
    await user.click(input);
    await user.keyboard('o');

    expect(validateSpy.mock.calls.length).toBe(1);

    await user.click(screen.getByText('submit'));

    expect(submitSpy.mock.calls.length).toBe(0);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });

  describe('prop: noValidate', () => {
    it('should disable native validation if set to true (default)', () => {
      render(<Form data-testid="form" />);
      expect(screen.getByTestId('form')).toHaveAttribute('novalidate');
    });

    it('should enable native validation if set to false', () => {
      render(<Form noValidate={false} data-testid="form" />);
      expect(screen.getByTestId('form')).not.toHaveAttribute('novalidate');
    });
  });

  describe('prop: actionsRef', () => {
    it('validates the form when the `validate` method is called', async () => {
      function App() {
        const actionsRef = React.useRef<Form.Actions>(null);
        return (
          <div>
            <Form actionsRef={actionsRef}>
              <Field.Root name="username">
                <Field.Control defaultValue="" required />
                <Field.Error data-testid="error" />
              </Field.Root>
              <Field.Root name="quantity" validate={() => 'error'}>
                <NumberField.Root defaultValue={5}>
                  <NumberField.Input />
                </NumberField.Root>
                <Field.Error data-testid="error" />
              </Field.Root>
              <button type="submit">submit</button>
            </Form>
            <button type="button" onClick={() => actionsRef.current?.validate()}>
              validate
            </button>
          </div>
        );
      }

      const { user } = await render(<App />);

      expect(screen.queryByTestId('error')).toBe(null);

      await user.click(screen.getByText('validate'));

      await expect(screen.queryAllByTestId('error').length).toBe(2);
    });

    it('validates a field when the `validate` method is called with the field name', async () => {
      function App() {
        const actionsRef = React.useRef<Form.Actions>(null);
        return (
          <div>
            <Form actionsRef={actionsRef}>
              <Field.Root name="username">
                <Field.Control defaultValue="" required />
                <Field.Error data-testid="error" />
              </Field.Root>
              <Field.Root name="quantity" validate={() => 'number field error'}>
                <NumberField.Root defaultValue={5}>
                  <NumberField.Input />
                </NumberField.Root>
                <Field.Error data-testid="error" />
              </Field.Root>
              <button type="submit">submit</button>
            </Form>
            <button type="button" onClick={() => actionsRef.current?.validate('quantity')}>
              validate
            </button>
          </div>
        );
      }

      const { user } = await render(<App />);

      expect(screen.queryByTestId('error')).toBe(null);

      await user.click(screen.getByText('validate'));

      await expect(screen.queryByTestId('error')).toHaveTextContent('number field error');
    });
  });
});
