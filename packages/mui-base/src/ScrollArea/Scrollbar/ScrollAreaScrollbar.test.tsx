import * as React from 'react';
import { ScrollArea } from '@base_ui/react/ScrollArea';
import { screen, fireEvent } from '@mui/internal-test-utils';
import { createRenderer } from '#test-utils';
import { expect } from 'chai';
import { describeConformance } from '../../../test/describeConformance';
import { SCROLL_TIMEOUT } from '../constants';

describe('<ScrollArea.Scrollbar />', () => {
  const { render, clock } = createRenderer();

  clock.withFakeTimers();

  describeConformance(<ScrollArea.Scrollbar />, () => ({
    refInstanceof: window.HTMLDivElement,
    render(node) {
      return render(<ScrollArea.Root>{node}</ScrollArea.Root>);
    },
  }));

  it('adds [data-hovering] attribute when viewport is hovered', async () => {
    await render(
      <ScrollArea.Root>
        <ScrollArea.Viewport data-testid="viewport">
          <div style={{ width: 1000, height: 1000 }} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" data-testid="vertical" />
        <ScrollArea.Scrollbar orientation="horizontal" data-testid="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>,
    );

    const verticalScrollbar = screen.getByTestId('vertical');
    const horizontalScrollbar = screen.getByTestId('horizontal');

    expect(verticalScrollbar).not.to.have.attribute('data-hovering');
    expect(horizontalScrollbar).not.to.have.attribute('data-hovering');

    fireEvent.mouseEnter(screen.getByTestId('viewport'));

    expect(verticalScrollbar).to.have.attribute('data-hovering', 'true');
    expect(horizontalScrollbar).to.have.attribute('data-hovering', 'true');

    fireEvent.mouseLeave(screen.getByTestId('viewport'));

    expect(verticalScrollbar).not.to.have.attribute('data-hovering');
    expect(horizontalScrollbar).not.to.have.attribute('data-hovering');
  });

  it('adds [data-scrolling] attribute when viewport is scrolled', async () => {
    await render(
      <ScrollArea.Root>
        <ScrollArea.Viewport data-testid="viewport">
          <div style={{ width: 1000, height: 1000 }} />
        </ScrollArea.Viewport>
        <ScrollArea.Scrollbar orientation="vertical" data-testid="vertical" />
        <ScrollArea.Scrollbar orientation="horizontal" data-testid="horizontal" />
        <ScrollArea.Corner />
      </ScrollArea.Root>,
    );

    const verticalScrollbar = screen.getByTestId('vertical');
    const horizontalScrollbar = screen.getByTestId('horizontal');

    expect(verticalScrollbar).not.to.have.attribute('data-scrolling');
    expect(horizontalScrollbar).not.to.have.attribute('data-scrolling');

    fireEvent.scroll(screen.getByTestId('viewport'));

    expect(verticalScrollbar).to.have.attribute('data-scrolling', 'true');
    expect(horizontalScrollbar).to.have.attribute('data-scrolling', 'true');

    clock.tick(SCROLL_TIMEOUT - 1);

    expect(verticalScrollbar).to.have.attribute('data-scrolling', 'true');
    expect(horizontalScrollbar).to.have.attribute('data-scrolling', 'true');

    clock.tick(1);

    expect(verticalScrollbar).not.to.have.attribute('data-scrolling');
    expect(horizontalScrollbar).not.to.have.attribute('data-scrolling');
  });
});