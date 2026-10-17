export function mergeSort(input) {
  const arr = [...input];
  const steps = [];

  function record(extra = {}) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [],
      range: null,
      ...extra,
    });
  }

  function merge(lo, mid, hi) {
    const range = [lo, hi];
    let k = lo;
    let leftRemaining = mid - lo + 1;
    let rightRemaining = hi - mid;

    while (leftRemaining > 0 && rightRemaining > 0) {
      const leftPos = k;
      const rightPos = k + leftRemaining;

      record({ comparing: [leftPos, rightPos], range });

      if (arr[leftPos].value <= arr[rightPos].value) {
        leftRemaining--;
      } else {
        const [item] = arr.splice(rightPos, 1);
        arr.splice(k, 0, item);
        rightRemaining--;
        record({ swapping: [k], range });
      }
      k++;
    }

    record({ range });
  }

  function sort(lo, hi) {
    if (lo >= hi) return;
    const mid = Math.floor((lo + hi) / 2);
    sort(lo, mid);
    sort(mid + 1, hi);
    merge(lo, mid, hi);
  }

  record();
  sort(0, arr.length - 1);
  record({ sorted: arr.map((_, i) => i) });

  return steps;
}