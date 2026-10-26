export class MinHeap {
  constructor() {
    this.data = [];
    this.counter = 0;
  }

  get size() {
    return this.data.length;
  }

  push(value, priority) {
    this.data.push({ value, priority, order: this.counter++ });
    this.#siftUp(this.data.length - 1);
  }

  pop() {
    if (this.data.length === 0) return undefined;

    const top = this.data[0];
    const last = this.data.pop();

    if (this.data.length > 0) {
      this.data[0] = last;
      this.#siftDown(0);
    }

    return { value: top.value, priority: top.priority };
  }

  values() {
    return this.data.map((entry) => entry.value);
  }

  #less(a, b) {
    if (a.priority !== b.priority) return a.priority < b.priority;
    return a.order < b.order;
  }

  #swap(i, j) {
    [this.data[i], this.data[j]] = [this.data[j], this.data[i]];
  }

  #siftUp(index) {
    let i = index;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!this.#less(this.data[i], this.data[parent])) break;
      this.#swap(i, parent);
      i = parent;
    }
  }

  #siftDown(index) {
    let i = index;
    const n = this.data.length;

    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;

      if (left < n && this.#less(this.data[left], this.data[smallest])) {
        smallest = left;
      }
      if (right < n && this.#less(this.data[right], this.data[smallest])) {
        smallest = right;
      }

      if (smallest === i) break;
      this.#swap(i, smallest);
      i = smallest;
    }
  }
}