import * as React from 'react';
import { Combobox } from '@base-ui/react/combobox';
import { benchmark, ElementTiming } from '@mui/internal-benchmark';
import { createRows, type BenchmarkRow } from './shared';

const largeItems = createRows(500, 'Row');

interface BenchmarkGroup {
  value: string;
  items: BenchmarkRow[];
}

// The same 500 rows split into 10 groups of 50. Item references are shared with `largeItems`, so
// they stay referentially stable across keystrokes.
const groupedItems: BenchmarkGroup[] = Array.from({ length: 10 }, (_unused, groupIndex) => ({
  value: `Group ${groupIndex + 1}`,
  items: largeItems.slice(groupIndex * 50, (groupIndex + 1) * 50),
}));

/**
 * Types `text` into the combobox input one character at a time, mimicking a user.
 * Each keystroke sets the controlled value via the native setter and dispatches a real
 * `InputEvent` (with `inputType`) so the component's `onChange` runs exactly as it would for a
 * typed character. Awaits a macrotask between keystrokes so React commits each keystroke's
 * render before the next, keeping the recorded render events deterministic across iterations.
 */
async function typeInto(input: HTMLInputElement, text: string) {
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    'value',
  )!.set!;

  for (let i = 1; i <= text.length; i += 1) {
    const next = text.slice(0, i);
    valueSetter.call(input, next);
    input.dispatchEvent(
      new InputEvent('input', { bubbles: true, inputType: 'insertText', data: text[i - 1] }),
    );
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => {
      setTimeout(resolve, 0);
    });
  }
}

function getBenchInput() {
  const input = document.querySelector<HTMLInputElement>('input[aria-label="combobox-bench"]');
  if (input == null) {
    throw new Error('Missing combobox benchmark input');
  }
  return input;
}

/**
 * A large, open combobox built with the documented function-children pattern. Item values and
 * labels are referentially stable, so `React.memo` on `<Combobox.Item>` can legitimately bail —
 * the only thing forcing the already-mounted items to re-render on each keystroke is whether they
 * subscribe to a context that changes per keystroke.
 */
function LargeCombobox() {
  return (
    <Combobox.Root items={largeItems} defaultOpen>
      <Combobox.Input aria-label="combobox-bench" />
      <div>
        <ElementTiming name="combobox-open" />
      </div>
      <Combobox.List>
        {(item: BenchmarkRow) => (
          <Combobox.Item key={item.id} value={item}>
            {item.label}
          </Combobox.Item>
        )}
      </Combobox.List>
    </Combobox.Root>
  );
}

/**
 * A grouped, open combobox with *rich* item children (an indicator element plus a text node),
 * built with nested `Collection`s — the common real-world shape. Here the user's render function
 * produces a fresh `children` array every keystroke, so the derived-items-context split alone is
 * not enough for `React.memo(<Combobox.Item>)` to bail; the item's `children` prop keeps changing.
 * `Combobox.Collection`'s internal memoization (plus preserved grouped item identities) is what
 * keeps the unchanged item subtrees from re-rendering here.
 */
function GroupedRichCombobox() {
  return (
    <Combobox.Root items={groupedItems} defaultOpen>
      <Combobox.Input aria-label="combobox-bench" />
      <div>
        <ElementTiming name="combobox-open" />
      </div>
      <Combobox.List>
        {(group: BenchmarkGroup) => (
          <Combobox.Group key={group.value} items={group.items}>
            <Combobox.GroupLabel>{group.value}</Combobox.GroupLabel>
            <Combobox.Collection>
              {(item: BenchmarkRow) => (
                <Combobox.Item key={item.id} value={item}>
                  <Combobox.ItemIndicator />
                  <span>{item.label}</span>
                </Combobox.Item>
              )}
            </Combobox.Collection>
          </Combobox.Group>
        )}
      </Combobox.List>
    </Combobox.Root>
  );
}

// Typing a common prefix keeps every item in the filtered set, so all 500 stay mounted across
// keystrokes. This isolates the per-keystroke re-render cost of the already-rendered items
// (no mount/unmount churn): the exact work the derived-items-context split removes.
benchmark(
  'Combobox type — 500 items, all stay mounted (type "Row ")',
  () => <LargeCombobox />,
  async ({ waitForElementTiming }) => {
    await waitForElementTiming('combobox-open');
    await typeInto(getBenchInput(), 'Row ');
  },
);

// Typing a specific query narrows the list from 500 down to ~11 items. This mixes unmount cost
// (paid on both master and the fix) with re-renders of the surviving items.
benchmark(
  'Combobox type — 500 items, narrows to ~11 (type "Row 25")',
  () => <LargeCombobox />,
  async ({ waitForElementTiming }) => {
    await waitForElementTiming('combobox-open');
    await typeInto(getBenchInput(), 'Row 25');
  },
);

// Same membership-preserving keystrokes, but grouped with rich children. Without the collection
// memoization the user's render function re-runs for every item on each keystroke (recreating the
// indicator/text elements); with it, unchanged grouped item subtrees are skipped entirely.
benchmark(
  'Combobox type — 500 grouped items, rich children, all stay mounted (type "Row ")',
  () => <GroupedRichCombobox />,
  async ({ waitForElementTiming }) => {
    await waitForElementTiming('combobox-open');
    await typeInto(getBenchInput(), 'Row ');
  },
);

// Grouped + rich children while narrowing the list. Mixes unmount cost with re-renders/skips of
// the surviving grouped items.
benchmark(
  'Combobox type — 500 grouped items, rich children, narrows to ~11 (type "Row 25")',
  () => <GroupedRichCombobox />,
  async ({ waitForElementTiming }) => {
    await waitForElementTiming('combobox-open');
    await typeInto(getBenchInput(), 'Row 25');
  },
);

// Pure open/mount cost (no typing): renders the whole open list once. Isolates the work added by
// the per-item component layers — the item wrapper split and the collection memo wrapper — so a
// mount regression can't hide inside a typing-interaction total.
benchmark('Combobox open — 500 items', () => <LargeCombobox />);

benchmark('Combobox open — 500 grouped items, rich children', () => <GroupedRichCombobox />);
