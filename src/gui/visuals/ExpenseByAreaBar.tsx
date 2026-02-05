import * as echarts from "echarts";
import { useEffect, useMemo, useRef } from "react";
import { AreaId, CategoryId, Transaction } from "../../common/types";
import { EChartsOption } from "echarts";
import {
  areaColorGradients,
  areaShades,
  chartColors,
  commonBarchartTooltip,
  commonYAxisLabel,
  echartDecals,
  formatCurrency,
} from "./echartsConfig";
import { getAreaCategories } from "../../common/utils";
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

  const totalValue = items.reduce((acc, p) => acc + (p.data.value as number), 0);
  if (totalValue === 0) return "";
  const axisLabel = String(items[0]?.axisValueLabel ?? items[0]?.name ?? "");
  const typeSeries = items
    .filter((p) => p.data.value > 0)
    .map((p) => {
      const seriesName = String(p?.seriesName ?? p?.name ?? "");
      const marker = typeof p?.marker === "string" ? p.marker : "";
      const numeric = formatCurrency(p.data.value);
      if (numeric == null) return `${marker}${seriesName}`;
      const topTransactions = p.data.topTransactions;
      return `${marker}${seriesName}: <span style="font-weight: 600;">${numeric}</span> <br/>
            <span style="font-weight: 200; font-size: 12px;">${topTransactions
              .map((t) => `&nbsp;&nbsp;&nbsp;&nbsp;${t.actor} - ${t.amount.toFixed(2)} CHF`)
              .join("<br/>")}</span><br/>`;
    })
    .join("<br/>");

  return `${axisLabel}<br/>${typeSeries}`;
};

type ExpenseByAreaBarProps = {
  barChartData: Record<AreaId, { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }> }>;
  barChartDrilldownData: Record<
    CategoryId,
    { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }> }
  >;
  currentDrilldown: AreaId | null;
  setCurrentDrilldown: (areaId: AreaId | null) => void;
};

export const ExpenseByAreaBar = ({
  barChartData,
  barChartDrilldownData,
  currentDrilldown,
  setCurrentDrilldown,
}: ExpenseByAreaBarProps) => {
  const barChartRef = useRef<HTMLDivElement>(null);
  const barChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const currentBarChartData = useMemo(() => {
    if (!currentDrilldown) return barChartData;
    const selectedAreaCategories = getAreaCategories(currentDrilldown);
    return selectedAreaCategories.reduce(
      (acc, categoryId) => {
        acc[categoryId] = barChartDrilldownData[categoryId as CategoryId];
        return acc;
      },
      {} as Record<CategoryId, { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }> }>,
    );
  }, [currentDrilldown, barChartData, barChartDrilldownData]);

  useEffect(() => {
    if (!barChartRef.current) return;

    const barChart = echarts.init(barChartRef.current);
    barChartInstanceRef.current = barChart;

    const barChartOption: EChartsOption = {
      toolbox: {
        show: true,
        orient: "vertical",
        showTitle: false,
        top: "10%",
        feature: {
          magicType: {
            show: true,
            type: ["stack"],
            iconStyle: { borderColor: chartColors.textSecondary },
          },
        },
      },
      series: Object.entries(currentBarChartData).map(([areaId, data], idx) => ({
        name: areaId,
        type: "bar",
        itemStyle: {
          color: currentDrilldown ? areaShades[currentDrilldown as AreaId][idx] : areaColorGradients[areaId as AreaId],
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
            borderRadius: 2,
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
        data: Object.keys(currentBarChartData),
        selected: Object.keys(currentBarChartData).reduce(
          (acc, key) => {
            if ([AreaId.HOUSING, AreaId.FOOD, AreaId.HEALTH].includes(key as AreaId) || currentDrilldown !== null) {
              acc[key] = true;
            } else {
              acc[key] = false;
            }
            return acc;
          },
          {} as Record<string, boolean>,
        ),
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
        data: barChartData[AreaId.HOUSING] ? Object.keys(barChartData[AreaId.HOUSING].monthYears) : [],
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
      graphic: [
        {
          type: "text",
          left: 0,
          top: "3%",
          cursor: "pointer",
          style: {
            borderColor: chartColors.textSecondary,
            borderWidth: 1,
            padding: 8,
            borderRadius: 6,
            text: "Back",
            fontSize: 18,
            fill: chartColors.textSecondary,
            fontWeight: 600,
          },
          invisible: currentDrilldown === null,
          onclick: function () {
            setCurrentDrilldown(null);
          },
        },
      ],
    };
    barChart.setOption(barChartOption);

    barChart.on("click", function (event) {
      if (event.seriesName && !currentDrilldown) {
        setCurrentDrilldown(event.seriesName as AreaId);
      }
    });

    const handleResize = () => {
      barChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      barChart.dispose();
    };
  }, [barChartData, currentBarChartData, currentDrilldown, setCurrentDrilldown]);

  return <div ref={barChartRef} style={{ width: "100%", height: "400px" }} />;
};
