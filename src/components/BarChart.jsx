const CHART_WIDTH = 800;
const CHART_HEIGHT = 400;
const BAR_GAP = 2;

const COLORS = {
  default: "#38bdf8",
  comparing: "#facc15",
  swapping: "#f87171",
  sorted: "#4ade80",
};

function getColor(index, { comparing, swapping, sorted }) {
  if (swapping.includes(index)) return COLORS.swapping;
  if (comparing.includes(index)) return COLORS.comparing;
  if (sorted.includes(index)) return COLORS.sorted;
  return COLORS.default;
}

export default function BarChart({
  values,
  comparing = [],
  swapping = [],
  sorted = [],
  maxValue = 100,
}) {
  const slotWidth = CHART_WIDTH / values.length;
  const barWidth = slotWidth - BAR_GAP;

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width="100%"
      style={{ display: "block", maxWidth: CHART_WIDTH }}
    >
      {values.map((value, index) => {
        const barHeight = (value / maxValue) * CHART_HEIGHT;
        return (
          <rect
            key={index}
            x={index * slotWidth}
            y={CHART_HEIGHT - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            fill={getColor(index, { comparing, swapping, sorted })}
          />
        );
      })}
    </svg>
  );
}