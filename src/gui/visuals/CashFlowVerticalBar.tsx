import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { EChartsOption } from "echarts";
import {
  chartColors,
  formatCurrency,
  cashFlowGradients,
  commonYAxisLabel,
  commonBarchartTooltip,
} from "./echartsConfig";
import { useMediaQuery, useTheme } from "@mui/material";

// Extract starting colors from gradients for legend
const incomeColor = (cashFlowGradients.income as echarts.graphic.LinearGradient).colorStops[0].color;
const expensesColor = (cashFlowGradients.expenses as echarts.graphic.LinearGradient).colorStops[0].color;

const verticalBarTooltipFormatter = (params: unknown): string => {
  type TooltipItem = {
    axisValueLabel?: unknown;
    name?: unknown;
    value?: unknown;
    marker?: unknown;
    seriesName?: unknown;
    data?: { value: number };
  };
  const items: TooltipItem[] = Array.isArray(params) ? (params as TooltipItem[]) : [params as TooltipItem];
  if (items.length === 0) return "";

  const axisLabel = String(items[0]?.axisValueLabel ?? items[0]?.name ?? "");
  const tooltipText = items
    .map((item) => {
      const seriesName = String(item?.seriesName ?? item?.name ?? "");
      const marker = typeof item?.marker === "string" ? item.marker : "";
      const value = item.data?.value ?? item.value;
      const formattedValue = typeof value === "number" ? formatCurrency(value) : "";
      return `${marker}${seriesName}: <span style="font-weight: 600;">${formattedValue}</span>`;
    })
    .join("<br/>");

  return `${axisLabel}<br/>${tooltipText}`;
};

type CashFlowVerticalBarProps = {
  monthlyIncomes: number[];
  monthlyExpenses: number[];
  monthYears: string[];
};

export const CashFlowVerticalBar = ({ monthlyIncomes, monthlyExpenses, monthYears }: CashFlowVerticalBarProps) => {
  const verticalBarChartRef = useRef<HTMLDivElement>(null);
  const verticalBarChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!verticalBarChartRef.current) return;

    const verticalBarChart = echarts.init(verticalBarChartRef.current);
    verticalBarChartInstanceRef.current = verticalBarChart;

    const verticalBarChartOption: EChartsOption = {
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
      tooltip: {
        ...commonBarchartTooltip(isMdUp),
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        formatter: verticalBarTooltipFormatter,
      },
      legend: {
        data: ["Income", "Expenses"],
        textStyle: {
          color: chartColors.textPrimary,
          fontSize: 14,
        },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20,
        top: "3%",
        itemStyle: {
          borderRadius: 6,
          borderColor: chartColors.background,
          borderWidth: 2,
          shadowColor: "rgba(0, 0, 0, 0.45)",
        },
      },
      grid: {
        left: "5%",
        right: "5%",
        top: "15%",
        bottom: "10%",
      },
      xAxis: {
        type: "category",
        data: monthYears,
        axisLine: {
          lineStyle: {
            color: chartColors.textSecondary,
          },
        },
        axisTick: {
          lineStyle: {
            color: chartColors.textSecondary,
          },
        },
        axisLabel: {
          color: chartColors.textSecondary,
          fontSize: 12,
          rotate: 60,
        },
      },
      yAxis: {
        type: "value",
        axisLine: {
          lineStyle: {
            color: chartColors.textSecondary,
          },
        },
        axisTick: {
          lineStyle: {
            color: chartColors.textSecondary,
          },
        },
        axisLabel: commonYAxisLabel(isMdUp),
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.05)",
            type: "dashed" as const,
          },
        },
      },
      series: [
        {
          name: "Income",
          type: "bar",
          color: incomeColor,
          data: monthlyIncomes.map((income) => ({
            value: income,
            itemStyle: {
              color: cashFlowGradients.income,
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.45)",
            },
          })),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 30,
              shadowColor: "rgba(34, 197, 94, 0.55)",
            },
          },
        },
        {
          name: "Expenses",
          type: "bar",
          color: expensesColor,
          data: monthlyExpenses.map((expense) => ({
            value: expense,
            itemStyle: {
              color: cashFlowGradients.expenses,
              borderRadius: [4, 4, 0, 0],
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.45)",
            },
          })),
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 30,
              shadowColor: "rgba(239, 68, 68, 0.55)",
            },
          },
        },
      ],
    };

    verticalBarChart.setOption(verticalBarChartOption);

    const handleResize = () => {
      verticalBarChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      verticalBarChart.dispose();
    };
  }, [monthlyIncomes, monthlyExpenses, monthYears]);

  return <div ref={verticalBarChartRef} style={{ width: "100%", height: "400px" }} />;
};
