export function quickSort(input) {
  const arr = [...input];
  const steps = [];
  const sorted = [];

  function record(extra = {}) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      range: null,
      pivot: null,
      ...extra,
    });
  }

  function swap(i, j) {
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  function partition(lo, hi) {
    const range = [lo, hi];
    const pivotValue = arr[hi].value;
    let store = lo;

    record({ pivot: hi, range });

    for (let i = lo; i < hi; i++) {
      record({ pivot: hi, comparing: [i, hi], range });

      if (arr[i].value < pivotValue) {
        if (i !== store) {
          swap(i, store);
          record({ pivot: hi, swapping: [i, store], range });
        }
        store++;
      }
    }

    if (store !== hi) {
      swap(store, hi);
      record({ pivot: store, swapping: [store, hi], range });
    }

    sorted.push(store);
    record({ range });
    return store;
  }

  function sort(lo, hi) {
    if (lo > hi) return;
    if (lo === hi) {
      sorted.push(lo);
      record();
      return;
    }
    const p = partition(lo, hi);
    sort(lo, p - 1);
    sort(p + 1, hi);
  }

  record();
  sort(0, arr.length - 1);
  record();

  return steps;
}