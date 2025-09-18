import { clamp } from '../../utils/clamp';

type RtlScrollAxisType = 'negative' | 'positive' | 'positive-descending';

let rtlScrollAxisType: RtlScrollAxisType | null = null;

function detectRtlScrollAxisType(): RtlScrollAxisType {
  if (typeof document === 'undefined') {
    return 'positive';
  }

  const container = document.createElement('div');
  const child = document.createElement('div');

  container.style.width = '100px';
  container.style.height = '100px';
  container.style.overflow = 'scroll';
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.direction = 'rtl';

  child.style.width = '200px';
  child.style.height = '200px';

  container.appendChild(child);
  document.body.appendChild(container);

  let axisType: RtlScrollAxisType;

  if (container.scrollLeft > 0) {
    axisType = 'positive-descending';
  } else {
    container.scrollLeft = 1;
    axisType = container.scrollLeft === 0 ? 'negative' : 'positive';
  }

  document.body.removeChild(container);

  return axisType;
}

export function getRtlScrollAxisType(): RtlScrollAxisType {
  if (rtlScrollAxisType === null) {
    rtlScrollAxisType = detectRtlScrollAxisType();
  }

  return rtlScrollAxisType;
}

export function getRtlScrollOffset(
  viewport: HTMLElement,
  maxScrollLeft: number,
): number {
  const axisType = getRtlScrollAxisType();
  const safeMax = Math.max(0, maxScrollLeft);

  if (axisType === 'negative') {
    return clamp(-viewport.scrollLeft, 0, safeMax);
  }

  return clamp(safeMax - viewport.scrollLeft, 0, safeMax);
}

export function setRtlScrollLeft(
  viewport: HTMLElement,
  offsetFromRight: number,
  maxScrollLeft: number,
): void {
  const axisType = getRtlScrollAxisType();
  const safeMax = Math.max(0, maxScrollLeft);
  const clampedOffset = clamp(offsetFromRight, 0, safeMax);

  if (axisType === 'negative') {
    viewport.scrollLeft = -clampedOffset;
    return;
  }

  viewport.scrollLeft = safeMax - clampedOffset;
}
