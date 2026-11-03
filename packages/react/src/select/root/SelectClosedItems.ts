import type * as React from 'react';

interface ClosedItem {
  value: any;
  label: string | undefined;
  /** The item's `Select.ItemText`, whose text labels the item when it has no `label`. */
  textRef: React.RefObject<HTMLElement | null>;
}

/**
 * The items of a closed select. They render into a fragment outside the document and don't
 * register with the list, so the root reads their labels and values from the fragment, in DOM
 * order, only when it needs them.
 */
export class SelectClosedItems {
  fragment: DocumentFragment | null = null;

  private items = new WeakMap<Element, ClosedItem>();

  private changed = true;

  set(element: Element, item: ClosedItem) {
    this.items.set(element, item);
    this.changed = true;
  }

  delete(element: Element) {
    this.items.delete(element);
    this.changed = true;
  }

  /**
   * Refills the list refs from the fragment when items changed since the last read, labelling
   * items as the open list does. Returns whether it refilled them.
   */
  read(
    elementsRef: React.RefObject<Array<HTMLElement | null>>,
    labelsRef: React.RefObject<Array<string | null>>,
    valuesRef: React.RefObject<any[]>,
  ) {
    if (!this.changed || this.fragment == null) {
      return false;
    }
    this.changed = false;

    const elements: Array<HTMLElement | null> = [];
    const labels: Array<string | null> = [];
    const values: any[] = [];

    const collect = (parent: ParentNode) => {
      for (let node = parent.firstElementChild; node; node = node.nextElementSibling) {
        const item = this.items.get(node);
        if (item) {
          elements.push(node as HTMLElement);
          labels.push(item.label ?? item.textRef.current?.textContent ?? node.textContent);
          values.push(item.value);
        } else {
          collect(node);
        }
      }
    };
    collect(this.fragment);

    elementsRef.current = elements;
    labelsRef.current = labels;
    valuesRef.current = values;
    return true;
  }
}
