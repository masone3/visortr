let nextId = 0;

function toItems(values) {
  return values.map((value) => ({ id: nextId++, value }));
}

export function createItems(size, min = 10, max = 100) {
  return toItems(generateRandomArray(size, min, max));
}

export function createSortedItems(size, min = 10, max = 100) {
  const values = generateRandomArray(size, min, max).sort((a, b) => a - b);
  return toItems(values);
}