import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Select } from '@base-ui/react/select';
import { reactBenchmark, ScalarMetric } from '@mui/internal-benchmark/page';
import type { BenchmarkCdp, InteractionContext } from '@mui/internal-benchmark/page';
import { createRows } from './shared';
import type { BenchmarkRow } from './shared';

// Measures the whole life of a Select that is used through typeahead: the cost of rendering it
// closed, the item mount that focusing the trigger kicks off, typing while closed and open, and the
// unmount. Each phase is recorded on its own, so a change that moves work from one phase to another
// (for example mounting the items up front instead of on focus) shows where the cost went, not just
// whether the total changed.
//
// The checks only look at behavior (the selected value, the highlighted option), never at where the
// items live in the DOM, so the same file can measure other ways of keeping closed items around.

const MS: Intl.NumberFormatOptions = { style: 'unit', unit: 'millisecond' };

/** What each phase records. `main-thread` is the headline number; the rest explain it. */
const MEASURES = {
  // React's own render work (component functions and reconciliation), from a `<Profiler>`.
  render: { alarm: false },
  // All JavaScript: React, event handlers, effects, positioning.
  script: { alarm: false },
  // Style recalculation and layout. Items in the document cost style work even while hidden.
  layout: { alarm: false },
  // Everything the main thread was busy with.
  'main-thread': { alarm: true },
} as const;

type Measure = keyof typeof MEASURES;

const metrics = new Map<string, ScalarMetric>();

function metricOf(phase: string, measure: Measure) {
  const name = `${phase}:${measure}`;
  let metric = metrics.get(name);
  if (!metric) {
    metric = new ScalarMetric({
      name,
      format: MS,
      alarm: MEASURES[measure].alarm ? {} : undefined,
    });
    metrics.set(name, metric);
  }
  return metric;
}

// Profiler totals for the Select alone, so the harness's own wrapper isn't counted.
const profiler = { duration: 0, renders: 0 };

function onRender(_id: string, _phase: string, actualDuration: number) {
  profiler.duration += actualDuration;
  profiler.renders += 1;
}

interface Snapshot {
  render: number;
  script: number;
  layout: number;
  task: number;
}

async function snapshot(cdp: BenchmarkCdp): Promise<Snapshot> {
  const { metrics: cdpMetrics } = (await cdp.send('Performance.getMetrics')) as {
    metrics: Array<{ name: string; value: number }>;
  };
  const read = (name: string) => cdpMetrics.find((metric) => metric.name === name)!.value * 1000;
  return {
    render: profiler.duration,
    script: read('ScriptDuration'),
    layout: read('LayoutDuration') + read('RecalcStyleDuration'),
    task: read('TaskDuration'),
  };
}

function recordDifference(phase: string, before: Snapshot, after: Snapshot) {
  metricOf(phase, 'render').record(after.render - before.render);
  metricOf(phase, 'script').record(after.script - before.script);
  metricOf(phase, 'layout').record(after.layout - before.layout);
  metricOf(phase, 'main-thread').record(after.task - before.task);
}

function nextFrame() {
  // A frame, then a task after it, so the frame's rendering work has run.
  return new Promise<void>((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, 0);
    });
  });
}

/**
 * Waits until React has gone two frames without rendering. Focusing the trigger mounts the items
 * from a timeout and positioning settles over frames, so a fixed wait would either cut work off or
 * wait longer than needed.
 */
async function settle() {
  let quietFrames = 0;
  while (quietFrames < 2) {
    const renders = profiler.renders;
    // eslint-disable-next-line no-await-in-loop
    await nextFrame();
    quietFrames = profiler.renders === renders ? quietFrames + 1 : 0;
  }
}

/**
 * Runs `fn` in a task of its own. Chrome's `ScriptDuration` only counts script run by a task, not
 * script resumed from the DevTools Protocol replies the interaction awaits, so code run straight
 * from the interaction would go uncounted.
 */
function inTask(fn: () => void) {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      try {
        fn();
        resolve();
      } catch (error) {
        reject(error);
      }
    }, 0);
  });
}

/** Runs `action`, waits for its work to settle and records what it cost under `phase`. */
async function measure(cdp: BenchmarkCdp, phase: string, action: () => void | Promise<void>) {
  const before = await snapshot(cdp);
  // Marks the phase on the timeline of a `--profile` trace.
  performance.mark(`${phase}:start`);
  let result: void | Promise<void> = undefined;
  await inTask(() => {
    result = action();
  });
  await result;
  await settle();
  performance.measure(`phase:${phase}`, `${phase}:start`);
  recordDifference(phase, before, await snapshot(cdp));
}

let setShown: (shown: boolean) => void = () => {};

function SelectHarness(props: { items: BenchmarkRow[] }) {
  const { items } = props;
  const [shown, setShownState] = React.useState(false);
  setShown = setShownState;

  return (
    <div>
      <button type="button" data-benchmark="outside">
        Outside
      </button>
      {shown && (
        <React.Profiler id="select" onRender={onRender}>
          <Select.Root items={items}>
            <Select.Trigger aria-label="Select typeahead benchmark">
              <Select.Value placeholder="Choose option" />
              <Select.Icon>v</Select.Icon>
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner sideOffset={8}>
                <Select.Popup>
                  <Select.List>
                    {items.map((item) => (
                      <Select.Item key={item.id} value={item.value}>
                        <Select.ItemIndicator />
                        <Select.ItemText>{item.label}</Select.ItemText>
                      </Select.Item>
                    ))}
                  </Select.List>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </React.Profiler>
      )}
    </div>
  );
}

function getTrigger() {
  const trigger = document.querySelector<HTMLElement>('[aria-label="Select typeahead benchmark"]');
  if (trigger == null) {
    throw new Error('Missing select benchmark trigger');
  }
  return trigger;
}

function getOutside() {
  return document.querySelector<HTMLElement>('[data-benchmark="outside"]')!;
}

function pressKey(key: string) {
  const target = document.activeElement ?? document.body;
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
}

/**
 * Types `text` into whatever has focus, one key per task, so each keystroke's update commits on its
 * own, as it would for a person typing. Typeahead's reset window is 750ms, far longer than this
 * takes.
 */
async function type(text: string) {
  for (let index = 0; index < text.length; index += 1) {
    // eslint-disable-next-line no-await-in-loop
    await inTask(() => pressKey(text[index]));
  }
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Select typeahead benchmark: ${message}`);
  }
}

function expectValue(label: string) {
  const text = getTrigger().textContent ?? '';
  assert(text.includes(label), `expected the value to be "${label}", got "${text}"`);
}

const CYCLE_PRESSES = 20;

function selectLifecycle(count: number) {
  // Labels typed in full. Typeahead matches by prefix, so the selection moves through earlier
  // matches ("Option 1", "Option 2", "Option 25") on the way to the label.
  const closedLabel = `Option ${Math.ceil(count / 2)}`;
  const openLabel = `Option ${Math.ceil(count / 4)}`;
  const cycledLabel = `Option ${Math.ceil(count / 2) + CYCLE_PRESSES}`;

  return async ({ cdp }: InteractionContext) => {
    profiler.duration = 0;
    profiler.renders = 0;
    // The domain slows down painting while enabled, so it's on only for this interaction.
    await cdp.send('Performance.enable');
    await settle();
    const start = await snapshot(cdp);

    // Rendering the closed Select.
    await measure(cdp, 'mount', () => {
      ReactDOM.flushSync(() => setShown(true));
    });

    // Focusing the trigger. Today this is where the items mount, ready for typeahead.
    await measure(cdp, 'focus', () => {
      getTrigger().focus();
    });
    assert(document.activeElement === getTrigger(), 'the trigger did not take focus');

    // Typing a label while closed selects each match as it goes.
    await measure(cdp, 'typeahead-closed', () => type(closedLabel));
    expectValue(closedLabel);

    // Leaving and coming back. Blurring also ends the typeahead session, so the next one starts
    // fresh.
    await measure(cdp, 'blur', () => {
      getOutside().focus();
    });
    await measure(cdp, 'refocus', () => {
      getTrigger().focus();
    });

    // Opening the popup with its items already mounted.
    await measure(cdp, 'open', () => {
      getTrigger().click();
    });
    assert(getTrigger().getAttribute('aria-expanded') === 'true', 'the popup did not open');

    // Typing while open moves the highlight instead of the value.
    await measure(cdp, 'typeahead-open', () => type(openLabel));
    const highlighted = document.querySelector('[role="option"][data-highlighted]');
    assert(
      highlighted?.textContent === openLabel,
      `expected "${openLabel}" to be highlighted, got "${highlighted?.textContent}"`,
    );

    await measure(cdp, 'close', () => {
      pressKey('Escape');
    });
    assert(getTrigger().getAttribute('aria-expanded') === 'false', 'the popup did not close');
    expectValue(closedLabel);

    // Ends the typing session from the open popup without measuring it: `blur` covers that.
    getOutside().focus();
    getTrigger().focus();
    await settle();

    // Pressing the same first letter repeatedly steps through the matching items one at a time,
    // as in a native <select>, starting after the selected value.
    await measure(cdp, 'cycle-closed', () => type('o'.repeat(CYCLE_PRESSES)));
    expectValue(cycledLabel);

    await measure(cdp, 'unmount', () => {
      ReactDOM.flushSync(() => setShown(false));
    });

    recordDifference('total', start, await snapshot(cdp));
    await cdp.send('Performance.disable');
  };
}

[100, 500, 2000].forEach((count) => {
  const items = createRows(count, 'Option');
  reactBenchmark(
    `Select typeahead lifecycle (${count} options)`,
    () => <SelectHarness items={items} />,
    selectLifecycle(count),
    // The harness only mounts the empty wrapper; every phase above is a custom metric.
    { reactRecordingPaused: true },
  );
});
