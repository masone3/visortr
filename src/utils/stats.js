export function computeStats(steps) {
  let comparisons = 0;
  let swaps = 0;

  return steps.map((step) => {
    if (step.comparing.length > 0) comparisons++;
    if (step.swapping.length > 0) swaps++;
    return { comparisons, swaps };
  });
}