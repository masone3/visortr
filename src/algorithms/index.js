import { bubbleSort } from "./bubbleSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";

export const ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    run: bubbleSort,
    info: {
      description:
        "Repeatedly compares neighbors and swaps them if out of order. Each pass bubbles the largest remaining value to the end.",
      best: "O(n²)",
      average: "O(n²)",
      worst: "O(n²)",
      space: "O(1)",
      note: "Best case is O(n) if you add an early exit when a pass makes no swaps (a Day 3 challenge).",
    },
  },
  merge: {
    name: "Merge Sort",
    run: mergeSort,
    info: {
      description:
        "Splits the array in half until single items remain, then merges sorted halves back together by repeatedly taking the smaller front item.",
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n log n)",
      space: "O(n)",
      note: "Always the same speed regardless of input. Stable.",
    },
  },
  quick: {
    name: "Quick Sort",
    run: quickSort,
    info: {
      description:
        "Picks a pivot, partitions the array so smaller items go left and larger go right, then recurses on each side. The pivot lands in its final spot.",
      best: "O(n log n)",
      average: "O(n log n)",
      worst: "O(n²)",
      space: "O(log n)",
      note: "Worst case happens with bad pivots, like the last element of an already-sorted array.",
    },
  },
};