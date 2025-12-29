import { Tooltip } from '@base-ui/react/tooltip';

// `props: any` will error
<Tooltip.Trigger render={(props) => <button type="button" {...props} />} />;
<Tooltip.Trigger render={(props) => <input {...props} />} />;

// Event handlers use HTMLElement, not HTMLButtonElement
<Tooltip.Trigger
  onClick={(event) => {
    // @ts-expect-error formAction does not exist on HTMLElement
    event.currentTarget.formAction.slice(0, 1);
  }}
/>;

// Can use HTMLElement properties
<Tooltip.Trigger
  onClick={(event) => {
    event.currentTarget.dataset.foo;
  }}
/>;
