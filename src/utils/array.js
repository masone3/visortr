export function generateRandomArray(size, min = 10, max = 100) {
  return Array.from({ length: size }, () =>
    Math.floor(Math.random() * (max - min + 1)) + min
  );
}