export function generateRandomArray(size, min = 10, max = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}

let nextId = 0;

export function createItems(size, min = 10, max = 100) {
  return generateRandomArray(size, min, max).map((value) => ({
    id: nextId++,
    value,
  }));
}