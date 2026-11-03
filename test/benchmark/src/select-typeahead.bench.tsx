import * as React from 'react';
import { reactBenchmark } from '@mui/internal-benchmark/page';
import { createRows } from './shared';
import { SelectHarness, selectLifecycle } from './select-typeahead-lifecycle';

// The Select typeahead steps on React's profiling build, which the harness mounts with: render
// times are reported alongside script and layout. `select-typeahead-production.bench.tsx` runs the
// same steps on React's production build.

[100, 500, 2000].forEach((count) => {
  const items = createRows(count, 'Option');
  reactBenchmark(
    `Select typeahead lifecycle (${count} options)`,
    () => <SelectHarness items={items} />,
    selectLifecycle(count, true),
    // The harness only mounts the empty wrapper; every phase is a custom metric.
    { reactRecordingPaused: true },
  );
});
