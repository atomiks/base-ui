import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import { benchmark } from '@mui/internal-benchmark/page';
import { createRows } from './shared';
import { SelectHarness, selectLifecycle } from './select-typeahead-lifecycle';

// The Select typeahead steps on React's production build. `reactBenchmark()` always mounts with
// React's profiling build, whose per-component logging and timing inflate the cost of every
// component, so these cases mount the harness themselves. The production build doesn't report
// render time, so only script, layout and main-thread time are recorded.

[100, 500, 2000].forEach((count) => {
  const items = createRows(count, 'Option');
  const run = selectLifecycle(count, false);

  benchmark(`Select typeahead lifecycle, production React (${count} options)`, async (context) => {
    const container = document.createElement('div');
    document.body.append(container);
    const root = ReactDOMClient.createRoot(container);
    ReactDOM.flushSync(() => {
      root.render(<SelectHarness items={items} />);
    });

    try {
      await run(context);
    } finally {
      root.unmount();
      container.remove();
    }
  });
});
