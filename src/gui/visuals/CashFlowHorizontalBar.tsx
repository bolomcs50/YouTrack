import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { EChartsOption } from "echarts";
import { chartColors, commonBarchartTooltip, formatCurrency, cashFlowGradients } from "./echartsConfig";
import { useMediaQuery, useTheme } from "@mui/material";

const horizontalBarTooltipFormatter = (params: unknown): string => {
  type TooltipItem = {
    name?: unknown;
    value?: unknown;
    marker?: unknown;
    seriesName?: unknown;
    color: { colorStops: { color: string }[] };
    data?: { value: number; name?: string };
  };
  const items: TooltipItem[] = Array.isArray(params) ? (params as TooltipItem[]) : [params as TooltipItem];
  if (items.length === 0) return "";

  const tooltipText = items
    .filter((item) => item.value !== 0)
    .map((item) => {
      const name = String(item?.name ?? item?.seriesName ?? "");
      const marker = typeof item?.marker === "string" ? item.marker : "";
      const value = item.value ?? item.value;
      const formattedValue = typeof value === "number" ? formatCurrency(value) : "";
      // Get color from item.color - ECharts provides this
      const color = item.color.colorStops[0].color;
      const colorStyle = color ? `color: ${color};` : "";
      return `${marker}${name}: <span style="font-weight: 600; ${colorStyle}">${formattedValue}</span>`;
    })
    .join("<br/>");

  return tooltipText;
};

type CashFlowHorizontalBarProps = {
  totalIncome: number;
  totalExpenses: number;
};

export const CashFlowHorizontalBar = ({ totalIncome, totalExpenses }: CashFlowHorizontalBarProps) => {
  const horizontalBarChartRef = useRef<HTMLDivElement>(null);
  const horizontalBarChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!horizontalBarChartRef.current) return;

    const horizontalBarChart = echarts.init(horizontalBarChartRef.current);
    horizontalBarChartInstanceRef.current = horizontalBarChart;

    const horizontalBarChartOption: EChartsOption = {
      aria: {
        enabled: true,
        decal: {
          show: true,
        },
      },
      tooltip: {
        ...commonBarchartTooltip(isMdUp),
        axisPointer: {
          type: "shadow",
        },
        formatter: horizontalBarTooltipFormatter,
      },
      grid: {
        left: "20%",
        right: "10%",
        top: "15%",
        bottom: "10%",
      },
      xAxis: {
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
        axisLabel: {
          color: chartColors.textSecondary,
          fontSize: 12,
          rotate: 60,
          formatter: (value: unknown) => {
            const num = typeof value === "number" ? value : Number(value);
            return formatCurrency(num);
          },
        },
        splitLine: {
          lineStyle: {
            color: "rgba(255, 255, 255, 0.05)",
            type: "dashed" as const,
          },
        },
      },
      yAxis: {
        type: "category",
        data: ["Expenses", "Income"],
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
          color: chartColors.textPrimary,
          fontSize: 14,
          fontWeight: 600,
        },
      },
      series: [
        {
          name: "Expenses",
          type: "bar",
          data: [totalExpenses, 0],
          itemStyle: {
            color: cashFlowGradients.expenses,
            borderRadius: [0, 4, 4, 0],
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.45)",
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 30,
              shadowColor: cashFlowGradients.expenses.colorStops[0].color,
            },
          },
        },
        {
          name: "Income",
          type: "bar",
          data: [0, totalIncome],
          itemStyle: {
            color: cashFlowGradients.income,
            borderRadius: [0, 4, 4, 0],
            shadowBlur: 10,
            shadowColor: "rgba(0, 0, 0, 0.45)",
          },
          emphasis: {
            focus: "series",
            itemStyle: {
              shadowBlur: 30,
              shadowColor: cashFlowGradients.income.colorStops[0].color,
            },
          },
        },
      ],
    };

    horizontalBarChart.setOption(horizontalBarChartOption);

    const handleResize = () => {
      horizontalBarChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      horizontalBarChart.dispose();
    };
  }, [totalIncome, totalExpenses, isMdUp]);

  return <div ref={horizontalBarChartRef} style={{ width: "100%", height: "400px" }} />;
};
