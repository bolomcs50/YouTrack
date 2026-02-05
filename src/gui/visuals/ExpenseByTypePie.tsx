import * as echarts from "echarts";
import { useEffect, useRef } from "react";
import { CategorySpendingType, Transaction } from "../../common/types";
import { EChartsOption } from "echarts/types/dist/echarts";
import { chartColors, formatCurrency, typeColorGradients, echartDecals } from "./echartsConfig";
import { useMediaQuery, useTheme } from "@mui/material";

const pieTooltipFromatter = (params: unknown): string => {
  type PieTooltipItem = {
    name?: unknown;
    value?: unknown;
    marker?: unknown;
    percent?: unknown;
    data: { value: number; topTransactions: Transaction[] };
    color: { colorStops: { color: string }[] };
  };
  const items: PieTooltipItem[] = Array.isArray(params) ? (params as PieTooltipItem[]) : [params as PieTooltipItem];
  if (items.length === 0) return "";
  const tooltipText = items
    .map((item) => {
      const name = String(item?.name ?? "");
      const marker = typeof item?.marker === "string" ? item.marker : "";
      const value = formatCurrency(item.data.value);
      const percent = String((item?.percent as number)?.toFixed(1) ?? "");
      const topTransactions = item.data.topTransactions;
      const color = item.color.colorStops[0].color;

      return `${marker}${name}: <span style="font-weight: 600;"> <span style="color: ${color};">${value}</span> - ${percent}%</span> <br/>
          <span style="font-weight: 200; font-size: 12px;">${topTransactions
            .map((t) => `&nbsp;&nbsp;&nbsp;&nbsp;${t.actor} - ${t.amount.toFixed(2)} CHF`)
            .join("<br/>")}</span>`;
    })
    .join("<br/>");
  return tooltipText;
};

type ExpenseByTypePieProps = {
  pieChartData: Record<CategorySpendingType, { total: number; topTransactions: Transaction[] }>;
};

export const ExpenseByTypePie = ({ pieChartData }: ExpenseByTypePieProps) => {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const pieChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    if (!pieChartRef.current) return;

    const pieChart = echarts.init(pieChartRef.current);
    pieChartInstanceRef.current = pieChart;

    const pieChartOption: EChartsOption = {
      series: {
        type: "pie",
        radius: ["40%", "70%"],
        data: Object.entries(pieChartData).map(([expenseType, data]) => ({
          name: expenseType,
          value: data.total,
          topTransactions: data.topTransactions,
          itemStyle: {
            color: typeColorGradients[expenseType as CategorySpendingType],
          },
        })),
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 6,
          borderColor: chartColors.background,
          borderWidth: 2,
          shadowBlur: 10,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 30,
            shadowColor: "rgba(129, 140, 248, 0.6)",
            borderWidth: 4,
          },
          label: {
            show: true,
            fontSize: 24,
            fontWeight: "bold",
            color: chartColors.textPrimary,
          },
        },
      },
      tooltip: {
        trigger: "item",
        position: isMdUp ? ["0%", "40%"] : "bottom",
        backgroundColor: "rgba(30, 41, 59, 0.95)",
        borderWidth: 2,
        textStyle: {
          color: chartColors.textPrimary,
          fontSize: 14,
        },
        formatter: pieTooltipFromatter,
      },
      legend: {
        textStyle: {
          color: chartColors.textPrimary,
          fontSize: 14,
        },
        itemWidth: 14,
        itemHeight: 14,
        itemGap: 20,
        top: "3%",
      },
      aria: {
        enabled: true,
        decal: {
          show: true,
          decals: echartDecals,
        },
      },
    };

    pieChart.setOption(pieChartOption);

    const handleResize = () => {
      pieChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      pieChart.dispose();
    };
  }, [pieChartData]);

  return <div ref={pieChartRef} style={{ width: "100%", height: "400px" }} />;
};
