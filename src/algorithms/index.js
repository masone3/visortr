import { bubbleSort } from "./bubbleSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";

export const ALGORITHMS = {
  bubble: { name: "Bubble Sort", run: bubbleSort },
  merge: { name: "Merge Sort", run: mergeSort },
  quick: { name: "Quick Sort", run: quickSort },
};