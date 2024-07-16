---
productId: base-ui
title: React Field component and hook
components: FieldRoot, FieldLabel, FieldMessage, FieldControl, FieldValidity
githubLabel: 'component: field'
packageName: '@base_ui/react'
---

# Field

<p class="description">Fields represent an individual section of a form containing an associated control and label, as well as any description or validation messages.</p>

{{"component": "@mui/docs/ComponentLinkHeader", "design": false}}

{{"component": "modules/components/ComponentPageTabs.js"}}

{{"demo": "UnstyledFieldIntroduction", "defaultCodeOpen": false, "bg": "gradient"}}

## Installation

Base UI components are all available as a single package.

<codeblock storageKey="package-manager">

```bash npm
npm install @base_ui/react
```

```bash yarn
yarn add @base_ui/react
```

```bash pnpm
pnpm add @base_ui/react
```

</codeblock>

Once you have the package installed, import the component.

```ts
import * as Field from '@base_ui/react/Field';
```

## Anatomy

Fields are implemented using a collection of related components:

- `<Field.Root />` is a top-level component that wraps all other components.
- `<Field.Control />` renders the control when not using a native Base UI component.
- `<Field.Label />` renders a label for the control.
- `<Field.Message />` renders an optional message for the control to describe it or show validation errors.
- `<Field.Validity />` is an optional render prop component that enables reading raw `ValidityState` to render custom JSX.

```jsx
<Field.Root>
  <Field.Control />
  <Field.Label />
  <Field.Message />
  <Field.Validity />
</Field.Root>
```

## Accessibility

All Base UI components are aware of Base UI's `Field` component. The label and description are automatically wired to it:

```jsx
<Field.Root>
  <Checkbox.Root>
    <Checkbox.Indicator />
  </Checkbox.Root>
  <Field.Label>My checkbox</Field.Label>
  <Field.Message>My description</Field.Message>
</Field.Root>
```

When using a native control like `input` which is not aware of `Field` natively, use `Field.Control`, which renders an `input` by default:

```jsx
<Field.Root>
  <Field.Control />
  <Field.Label>My input</Field.Label>
  <Field.Message>My description</Field.Message>
</Field.Root>
```

The `render` prop allows you to pass a custom component or tag, different from `input`:

```jsx
<Field.Control render={<select />} />
```

## Validation

When adding native HTML validation props like `required` or `pattern`, the `show` prop on `Field.Message` will show the message only if the constraint validation fails:

```jsx
<Field.Root>
  <Field.Label>My input</Field.Label>
  <Field.Control required />
  <Field.Message show="valueMissing" />
</Field.Root>
```

The `children` by default is the browser's native message, which is automatically internationalized. You may pass custom `children` instead:

```jsx
<Field.Root>
  <Field.Label>My input</Field.Label>
  <Field.Control required />
  <Field.Message show="valueMissing">Input is required</Field.Message>
</Field.Root>
```

For the list of supported `show` strings, visit [`ValidityState` on MDN](https://developer.mozilla.org/en-US/docs/Web/API/ValidityState#instance_properties).

### Custom validation

In addition to the native HTML constraint validation, you can also add custom validation by passing a function that receives the control's `value` as a first argument:

```jsx
<Field.Root>
  <Field.Control type="password" />
  <Field.Label>Password</Field.Label>
  <Field.Message show={(value) => value === 'password'}>
    Cannot literally use `password` as your password.
  </Field.Message>
</Field.Root>
```

- For Base UI Input components, this represents the component's value type. For `NumberField` or `Slider`, it's `number | null`, while for `Checkbox` and `Switch`, it's `boolean`.
- For native elements, it is always the native `element.value` DOM property.