import { bubbleSort } from "./bubbleSort";
import { mergeSort } from "./mergeSort";

export const ALGORITHMS = {
  bubble: { name: "Bubble Sort", run: bubbleSort },
  merge: { name: "Merge Sort", run: mergeSort },
};