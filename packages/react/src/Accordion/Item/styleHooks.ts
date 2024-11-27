import type { CustomStyleHookMapping } from '../../utils/getStyleHookProps';
import { collapsibleOpenStateMapping as baseMapping } from '../../utils/collapsibleOpenStateMapping';
import type { AccordionItem } from './AccordionItem';

export const accordionStyleHookMapping: CustomStyleHookMapping<AccordionItem.State> = {
  ...baseMapping,
  index: (value) => {
    return Number.isInteger(value) ? { 'data-index': String(value) } : null;
  },
  transitionStatus(value): Record<string, string> | null {
    if (value === 'entering') {
      return { 'data-starting-style': '' };
    }
    if (value === 'exiting') {
      return { 'data-ending-style': '' };
    }
    return null;
  },
  value: () => null,
};
