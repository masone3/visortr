export function bubbleSort(input) {
  const arr = [...input];
  const steps = [];
  const sorted = [];

  function record(extra = {}) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      ...extra,
    });
  }

  record();

  for (let end = arr.length - 1; end > 0; end--) {
    for (let i = 0; i < end; i++) {
      record({ comparing: [i, i + 1] });

      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        record({ swapping: [i, i + 1] });
      }
    }
    sorted.push(end);
  }

  if (arr.length > 0) sorted.push(0);
  record();

  return steps;
}