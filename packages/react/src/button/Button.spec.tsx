import { Button } from '@base-ui/react/button';

<Button />;
<Button type="submit" form="form-id" name="action" />;

<Button nativeButton={false} render={<span />} />;
<Button nativeButton={false} render={(props) => <div {...props} />} />;
<Button nativeButton={false} disabled render={<span />} />;

// @ts-expect-error native buttons only
<Button nativeButton={false} type="submit" render={<span />} />;
// @ts-expect-error native buttons only
<Button nativeButton={false} form="form-id" render={<span />} />;
// @ts-expect-error native buttons only
<Button nativeButton={false} name="action" render={<span />} />;

// Event handlers: nativeButton={true} (default) has HTMLButtonElement with formAction
<Button
  onClick={(event) => {
    event.currentTarget.formAction.slice(0, 1);
  }}
/>;

// Event handlers: nativeButton={false} uses HTMLElement without formAction
<Button
  nativeButton={false}
  onClick={(event) => {
    // @ts-expect-error formAction does not exist on HTMLElement
    event.currentTarget.formAction.slice(0, 1);
  }}
  render={<div />}
/>;
