export type ItemEqualityComparer<Item = any, Value = Item> = (
  itemValue: Item,
  selectedValue: Value,
) => boolean;

export const defaultItemEquality: ItemEqualityComparer = (itemValue, selectedValue) =>
  Object.is(itemValue, selectedValue);

export function compareItemEquality<Item, Value>(
  itemValue: Item,
  selectedValue: Value,
  comparer: ItemEqualityComparer<Item, Value>,
): boolean {
  if (itemValue == null || selectedValue == null) {
    return Object.is(itemValue, selectedValue);
  }
  return comparer(itemValue, selectedValue);
}

export function selectedValueIncludes<Item, Value>(
  selectedValues: readonly Item[] | undefined | null,
  itemValue: Value,
  comparer: ItemEqualityComparer<Value, Item>,
): boolean {
  if (!selectedValues || selectedValues.length === 0) {
    return false;
  }
  return selectedValues.some((selectedValue) => {
    if (selectedValue === undefined) {
      return false;
    }
    return compareItemEquality(itemValue, selectedValue, comparer);
  });
}

export function findItemIndex<Item, Value>(
  itemValues: readonly Item[] | undefined | null,
  selectedValue: Value,
  comparer: ItemEqualityComparer<Item, Value>,
): number {
  if (!itemValues || itemValues.length === 0) {
    return -1;
  }
  return itemValues.findIndex((itemValue) => {
    if (itemValue === undefined) {
      return false;
    }
    return compareItemEquality(itemValue, selectedValue, comparer);
  });
}

export function getLatestSelectedValue<Value>(
  selectedValue: Value | readonly Value[] | undefined,
  multiple: boolean,
): Value | undefined {
  if (!multiple) {
    return selectedValue as Value | undefined;
  }

  if (!Array.isArray(selectedValue) || selectedValue.length === 0) {
    return undefined;
  }

  return selectedValue[selectedValue.length - 1];
}

export function findSelectedItemIndex<Item, Value>(
  itemValues: readonly Item[] | undefined | null,
  selectedValue: Value | readonly Value[] | undefined,
  multiple: boolean,
  comparer: ItemEqualityComparer<Item, Value>,
): number {
  const latestSelectedValue = getLatestSelectedValue(selectedValue, multiple);
  if (latestSelectedValue === undefined) {
    return -1;
  }

  return findItemIndex(itemValues, latestSelectedValue, comparer);
}

export function isItemSelected<Item, Value>(
  itemValue: Item,
  selectedValue: Value | readonly Value[] | undefined,
  multiple: boolean,
  comparer: ItemEqualityComparer<Item, Value>,
): boolean {
  const latestSelectedValue = getLatestSelectedValue(selectedValue, multiple);
  return (
    latestSelectedValue !== undefined &&
    compareItemEquality(itemValue, latestSelectedValue, comparer)
  );
}

export function removeItem<Item, Value>(
  selectedValues: readonly Item[],
  itemValue: Value,
  comparer: ItemEqualityComparer<Value, Item>,
): Item[] {
  return selectedValues.filter(
    (selectedValue) => !compareItemEquality(itemValue, selectedValue, comparer),
  );
}
