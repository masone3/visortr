import { motion } from "framer-motion";

const CHART_WIDTH = 800;
const CHART_HEIGHT = 400;
const BAR_GAP = 2;
const MAX_MOVE_SECONDS = 0.3;

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
  items,
  comparing = [],
  swapping = [],
  sorted = [],
  range = null,
  maxValue = 100,
  stepDelay = 100,
}) {
  const slotWidth = CHART_WIDTH / items.length;
  const barWidth = slotWidth - BAR_GAP;
  const moveSeconds = Math.min(MAX_MOVE_SECONDS, (stepDelay / 1000) * 0.9);

  return (
    <svg
      viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
      width="100%"
      style={{ display: "block", maxWidth: CHART_WIDTH }}
    >
      {items.map((item, index) => {
        const barHeight = (item.value / maxValue) * CHART_HEIGHT;
        return (
          <motion.rect
            key={item.id}
            y={CHART_HEIGHT - barHeight}
            width={barWidth}
            height={barHeight}
            rx={2}
            initial={false}
            animate={{
              x: index * slotWidth,
              fill: getColor(index, { comparing, swapping, sorted }),
              opacity: inactive ? 0.25 : 1,
            }}
            transition={{ duration: moveSeconds, ease: "easeInOut" }}
          />
        );
      })}
    </svg>
  );
}