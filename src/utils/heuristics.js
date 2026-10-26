export function manhattan(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}