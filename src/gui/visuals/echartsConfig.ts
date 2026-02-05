import * as echarts from "echarts";
import { AreaId, CategorySpendingType } from "../../common/types";

/**
 * Shared ECharts configuration for dark mode theme
 * Provides consistent styling across all charts in the application
 */

// Theme colors matching the app's dark mode palette
export const chartColors = {
  textPrimary: "#f1f5f9", // Slate-100
  textSecondary: "#cbd5e1", // Slate-300
  background: "#0f172a", // Slate-900
  border: "rgba(129, 140, 248, 0.5)",
};

/**
 * Creates a gradient color for chart segments
 */
function createGradient(startColor: string, endColor: string): echarts.graphic.LinearGradient {
  return new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    { offset: 0, color: startColor },
    { offset: 1, color: endColor },
  ]);
}

export const typeColorGradients: Record<CategorySpendingType, echarts.graphic.LinearGradient> = {
  [CategorySpendingType.NEED]: createGradient("#ef4444", "#7f1d1d"),
  [CategorySpendingType.WANT]: createGradient("#eab308", "#a16207"),
  [CategorySpendingType.SAVING]: createGradient("#2563eb", "#1e293b"),
};

// Define 15 clearly different decal objects for echarts graphs
export const echartDecals = [
  { symbol: "circle", symbolSize: 1 },
  { symbol: "rect", dashArrayX: [4, 0], dashArrayY: [8, 4], rotation: 0 },
  { symbol: "diamond", symbolSize: 2 },
  { symbol: "rect", dashArrayX: [8, 4], dashArrayY: [8, 0], rotation: 0 },
  { symbol: "rect", dashArrayX: [4, 8], dashArrayY: [8, 4], rotation: Math.PI / 4 },
  { symbol: "rect", dashArrayX: [4, 8], dashArrayY: [8, 4], rotation: -Math.PI / 4 },
  { symbol: "circle", symbolSize: 1, dashArrayX: [4, 10], dashArrayY: [4, 10] },
  { symbol: "rect", dashArrayX: [4, 4], dashArrayY: [4, 4], rotation: 0 },
  { symbol: "rect", dashArrayX: [8, 8], dashArrayY: [8, 8], rotation: 0 },
  {
    symbol: "triangle",
    symbolSize: 6,

    dashArrayX: [6, 8],
    dashArrayY: [10, 6],
    rotation: 0,
  },
  {
    symbol: "triangle",
    symbolSize: 6,

    dashArrayX: [6, 8],
    dashArrayY: [10, 6],
    rotation: Math.PI,
  },

  { symbol: "rect", symbolSize: 3, dashArrayX: [3, 6], dashArrayY: [3, 6] },
  { symbol: "rect", symbolSize: 7, dashArrayX: [7, 8], dashArrayY: [7, 8] },
  {
    symbol: "path://M0,2 L2,0 L4,2 L6,0",
    symbolSize: 6,

    dashArrayX: [8, 6],
    dashArrayY: [4, 3],
    rotation: 0,
  },
  { symbol: "ring", symbolSize: 8, dashArrayX: [10, 12], dashArrayY: [10, 12] },
];

/**
 * Cash flow gradients for income and expenses
 */
export const cashFlowGradients = {
  income: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    { offset: 0, color: "#22c55e" },
    { offset: 1, color: "#15803d" },
  ]),
  expenses: new echarts.graphic.LinearGradient(0, 0, 1, 1, [
    { offset: 0, color: "#ef4444" },
    { offset: 1, color: "#7f1d1d" },
  ]),
};

export const areaColorGradients: Record<AreaId, echarts.graphic.LinearGradient> = {
  [AreaId.HOUSING]: createGradient("#a78bfa", "#7c3aed"), // purple
  [AreaId.FOOD]: createGradient("#34d399", "#15803d"), // green
  [AreaId.HEALTH]: createGradient("#60a5fa", "#2563eb"), // blue
  [AreaId.TRANSPORTATION]: createGradient("#fb7185", "#be185d"), // red-pink
  [AreaId.SHOPPING]: createGradient("#fde68a", "#f59e42"), // yellow-orange
  [AreaId.ENTERTAINMENT]: createGradient("#f472b6", "#db2777"), // pink-magenta
  [AreaId.INVESTMENT]: createGradient("#2dd4bf", "#0f766e"), // teal
  [AreaId.UNCATEGORIZED]: createGradient("#94a3b8", "#475569"), // gray-blue
};

// Per-area shade palettes (light → dark-ish) for distinguishing categories within an area.
export const areaShades: Record<AreaId, echarts.graphic.LinearGradient[]> = {
  [AreaId.HOUSING]: [
    createGradient("#7c3aed", "#7c3aed"),
    createGradient("#a78bfa", "#a78bfa"),
    createGradient("#c4b5fd", "#c4b5fd"),
    createGradient("#ede9fe", "#ede9fe"),
  ],
  [AreaId.FOOD]: [
    createGradient("#15803d", "#15803d"),
    createGradient("#22c55e", "#22c55e"),
    createGradient("#4ade80", "#4ade80"),
    createGradient("#bbf7d0", "#bbf7d0"),
  ],
  [AreaId.HEALTH]: [
    createGradient("#2563eb", "#2563eb"),
    createGradient("#60a5fa", "#60a5fa"),
    createGradient("#93c5fd", "#93c5fd"),
    createGradient("#dbeafe", "#dbeafe"),
  ],
  [AreaId.TRANSPORTATION]: [
    createGradient("#ea580c", "#ea580c"),
    createGradient("#fb923c", "#fb923c"),
    createGradient("#fdba74", "#fdba74"),
    createGradient("#ffedd5", "#ffedd5"),
  ],
  [AreaId.SHOPPING]: [
    createGradient("#b45309", "#b45309"),
    createGradient("#f59e42", "#f59e42"),
    createGradient("#fde68a", "#fde68a"),
    createGradient("#fef3c7", "#fef3c7"),
  ],
  [AreaId.ENTERTAINMENT]: [
    createGradient("#db2777", "#db2777"),
    createGradient("#f472b6", "#f472b6"),
    createGradient("#fbcfe8", "#fbcfe8"),
    createGradient("#fdf2f8", "#fdf2f8"),
  ],
  [AreaId.INVESTMENT]: [
    createGradient("#0f766e", "#0f766e"),
    createGradient("#2dd4bf", "#2dd4bf"),
    createGradient("#5eead4", "#5eead4"),
    createGradient("#ccfbf1", "#ccfbf1"),
  ],
  [AreaId.UNCATEGORIZED]: [
    createGradient("#475569", "#475569"),
    createGradient("#94a3b8", "#94a3b8"),
    createGradient("#cbd5e1", "#cbd5e1"),
    createGradient("#f1f5f9", "#f1f5f9"),
  ],
};

export function formatCurrency(value: number, fractionDigits: number = 2): string {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CHF",
    minimumFractionDigits: fractionDigits,
    maximumFractionDigits: fractionDigits,
  });
  return formatter.format(value);
}

export function commonYAxisLabel(isMdUp: boolean) {
  return isMdUp
    ? {
        color: chartColors.textSecondary,
        fontSize: 12,
        formatter: (value: unknown) => {
          const num = typeof value === "number" ? value : Number(value);
          return formatCurrency(num);
        },
      }
    : {
        // On small screen, hide y axis labels completely
        formatter: () => "",
      };
}

export function commonBarchartTooltip(isMdUp: boolean): echarts.TooltipComponentOption {
  return {
    backgroundColor: "rgba(30, 41, 59, 0.95)",
    borderColor: chartColors.border,
    borderWidth: 2,
    textStyle: {
      color: chartColors.textPrimary,
      fontSize: 14,
    },
    axisPointer: {
      type: "shadow",
    },
    // On small screen, show tiiltip below the chart
    ...(isMdUp ? {} : { position: ["5%", "100%"] }),
  };
}
