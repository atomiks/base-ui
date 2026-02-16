import * as React from 'react';
import { Autocomplete } from '@base-ui/react/autocomplete';

<Autocomplete.Root items={['apple']}>
  <Autocomplete.List>
    <Autocomplete.Item
      value="apple"
      className={(state) => {
        state.disabled;
        state.highlighted;
        // @ts-expect-error selected state is not exposed by Autocomplete.Item
        state.selected;
        return undefined;
      }}
      render={(props, state) => {
        state.disabled;
        state.highlighted;
        // @ts-expect-error selected state is not exposed by Autocomplete.Item
        state.selected;
        return <div {...props} />;
      }}
    >
      apple
    </Autocomplete.Item>
  </Autocomplete.List>
</Autocomplete.Root>;
