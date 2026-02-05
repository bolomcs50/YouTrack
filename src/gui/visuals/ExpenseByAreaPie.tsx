import * as echarts from "echarts";
import { useEffect, useMemo, useRef } from "react";
import { AreaId, CategoryId, Transaction } from "../../common/types";
import { EChartsOption } from "echarts/types/dist/echarts";
import { areaColorGradients, areaShades, chartColors, echartDecals, formatCurrency } from "./echartsConfig";
import { getAreaCategories } from "../../common/utils";
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

type ExpenseByAreaPieProps = {
  pieChartData: Record<AreaId, { total: number; topTransactions: Transaction[] }>;
  pieChartDrilldownData: Record<CategoryId, { total: number; topTransactions: Transaction[] }>;
  currentDrilldown: AreaId | null;
  setCurrentDrilldown: (areaId: AreaId | null) => void;
};

export const ExpenseByAreaPie = ({
  pieChartData,
  pieChartDrilldownData,
  currentDrilldown,
  setCurrentDrilldown,
}: ExpenseByAreaPieProps) => {
  const pieChartRef = useRef<HTMLDivElement>(null);
  const pieChartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const currentPieChartData = useMemo(() => {
    if (!currentDrilldown) return pieChartData;
    const selectedAreaCategories = getAreaCategories(currentDrilldown);
    return selectedAreaCategories.reduce(
      (acc, categoryId) => {
        acc[categoryId] = pieChartDrilldownData[categoryId as CategoryId];
        return acc;
      },
      {} as Record<CategoryId, { total: number; topTransactions: Transaction[] }>,
    );
  }, [currentDrilldown, pieChartData, pieChartDrilldownData]);

  useEffect(() => {
    if (!pieChartRef.current) return;

    const pieChart = echarts.init(pieChartRef.current);
    pieChartInstanceRef.current = pieChart;

    const pieChartOption: EChartsOption = {
      series: {
        type: "pie",
        radius: ["40%", "70%"],
        data: Object.entries(currentPieChartData).map(([areaId, data], idx) => ({
          name: areaId,
          value: data.total,
          topTransactions: data.topTransactions,
          itemStyle: {
            color: currentDrilldown
              ? areaShades[currentDrilldown as AreaId][idx]
              : areaColorGradients[areaId as AreaId],
          },
        })),
        top: "10%",
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
        type: "scroll",
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

    pieChart.on("click", function (event) {
      if (event.name && !currentDrilldown) {
        setCurrentDrilldown(event.name as AreaId);
      }
    });

    const handleResize = () => {
      pieChart.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      pieChart.dispose();
    };
  }, [currentPieChartData, currentDrilldown, setCurrentDrilldown, isMdUp]);

  return <div ref={pieChartRef} style={{ width: "100%", height: "400px" }} />;
};
