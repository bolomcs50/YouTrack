import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { CategorySpendingType, Transaction } from "../../common/types";
import { EChartsOption } from "echarts";
import {
  chartColors,
  commonBarchartTooltip,
  commonYAxisLabel,
  echartDecals,
  formatCurrency,
  typeColorGradients,
} from "./echartsConfig";
import { useMediaQuery, useTheme } from "@mui/material";

const barTooltipFromatter = (params: unknown): string => {
  type AxisTooltipItem = {
    axisValueLabel?: unknown;
    name?: unknown;
    seriesName?: unknown;
    marker?: unknown;
    value?: unknown;
    percent?: unknown;
    data: { value: number; topTransactions: Transaction[] };
  };
  const items: AxisTooltipItem[] = Array.isArray(params) ? (params as AxisTooltipItem[]) : [params as AxisTooltipItem];
  if (items.length === 0) return "";

  const axisLabel = String(items[0]?.axisValueLabel ?? items[0]?.name ?? "");
  const totalValue = items.reduce((acc, p) => acc + (p.data.value as number), 0);
  const typeSeries = items
    .filter((p) => p.data.value > 0)
    .map((p) => {
      const seriesName = String(p?.seriesName ?? p?.name ?? "");
      const marker = typeof p?.marker === "string" ? p.marker : "";
      const numeric = formatCurrency(p.data.value);
      const percent = ((p.data.value / totalValue) * 100).toFixed(1);
      if (numeric == null) return `${marker}${seriesName}`;
      const topTransactions = p.data.topTransactions;
      return `${marker}${seriesName}: <span style="font-weight: 600;">${numeric} - ${percent}%</span> <br/>
            <span style="font-weight: 200; font-size: 12px;">${topTransactions
              .map((t) => `&nbsp;&nbsp;&nbsp;&nbsp;${t.actor} - ${t.amount.toFixed(2)} CHF`)
              .join("<br/>")}</span><br/>`;
    })
    .join("<br/>");

  return `${axisLabel}<br/>${typeSeries}`;
};

type ExpenseByTypeBarProps = {
  barChartData: Record<
    CategorySpendingType,
    {
      monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>;
      topTransactions: Transaction[];
    }
  >;
};

export const ExpenseByTypeBar = ({ barChartData }: ExpenseByTypeBarProps) => {
  const barChartRef = useRef<HTMLDivElement>(null);
  const barChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!barChartRef.current) return;

    const barChart = echarts.init(barChartRef.current);
    barChartInstanceRef.current = barChart;

    const barChartOption: EChartsOption = {
      series: Object.entries(barChartData).map(([expenseType, data], idx) => ({
        name: expenseType,
        type: "bar",
        itemStyle: {
          color: typeColorGradients[expenseType as CategorySpendingType],
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.45)",
          decal: echartDecals[idx],
        },
        emphasis: {
          focus: "series",
          itemStyle: {
            shadowBlur: 30,
            shadowColor: "rgba(129, 140, 248, 0.55)",
          },
        },
        data: Object.entries(data.monthYears).map(([monthYear, monthYearData]) => ({
          name: monthYear,
          value: monthYearData.amount,
          topTransactions: monthYearData.topTransactions,
          itemStyle: {
            borderRadius: monthYearData.amount > 0 ? [6, 6, 0, 0] : [0, 0, 6, 6],
          },
        })),
      })),
      grid: {
        left: "5%",
        right: "5%",
        top: "15%",
        bottom: "10%",
      },
      tooltip: {
        ...commonBarchartTooltip(isMdUp),
        formatter: barTooltipFromatter,
      },
      legend: {
        data: Object.keys(barChartData),
        textStyle: {
          color: chartColors.textPrimary,
          fontSize: 14,
        },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20,
        top: "3%",
        type: "scroll",
        itemStyle: {
          borderRadius: 6,
          borderColor: chartColors.background,
          borderWidth: 2,
          shadowColor: "rgba(0, 0, 0, 0.45)",
        },
      },
      xAxis: {
        type: "category",
        data: barChartData[CategorySpendingType.NEED]
          ? Object.keys(barChartData[CategorySpendingType.NEED].monthYears)
          : [],
        axisLine: {
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
    };
    barChart.setOption(barChartOption);

    const handleResize = () => {
      barChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      barChart.dispose();
    };
  }, [barChartData]);

  return <div ref={barChartRef} style={{ width: "100%", height: "400px" }} />;
};
