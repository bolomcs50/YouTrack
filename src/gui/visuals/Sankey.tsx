import * as echarts from "echarts";
import { useContext, useEffect, useMemo, useRef } from "react";
import { TransactionsContext } from "../components/TransactionsContext";
import { ActivityType, AreaId, CategoryId } from "../../common/types";
import { DEFAULT_CATEGORIES } from "../../common/constants";
import { areaColorGradients, areaShades, chartColors, commonBarchartTooltip, formatCurrency } from "./echartsConfig";
import { getAreaCategories } from "../../common/utils";
import { useMediaQuery, useTheme } from "@mui/material";

type EChartsOption = echarts.EChartsOption;

const sankeyLabelFormatter = (params: unknown): string => {
  type SeriesLabelParams = {
    name: string;
    value: number;
  };
  const items: SeriesLabelParams[] = Array.isArray(params)
    ? (params as SeriesLabelParams[])
    : [params as SeriesLabelParams];

  return items
    .map((item) => {
      const name = String(item?.name ?? "");
      const value = formatCurrency(item?.value, 0);
      return `${name} \n ${value}`;
    })
    .join("\n");
};

const sankeyTooltipFormatter = (params: unknown): string => {
  type SeriesTooltipParams = {
    name: string;
    value: number;
  };
  const items: SeriesTooltipParams[] = Array.isArray(params)
    ? (params as SeriesTooltipParams[])
    : [params as SeriesTooltipParams];
  return items.map((item) => `${item.name}: ${formatCurrency(item.value)}`).join("<br/>");
};

export function Sankey() {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const { relevantTransactions, relevantExpenseTransactions } = useContext(TransactionsContext);

  const { overallTotalsByArea, overallTotalsByCategory, totalIncome, totalExpenses } = useMemo(() => {
    const overallTotalsByArea: Record<AreaId, number> = {} as Record<AreaId, number>;
    const overallTotalsByCategory: Record<CategoryId, number> = {} as Record<CategoryId, number>;

    relevantExpenseTransactions.forEach((transaction) => {
      if (!transaction.category) return;
      const categoryId = transaction.category as CategoryId;
      const category = DEFAULT_CATEGORIES[categoryId];
      const area = category.area as AreaId;

      overallTotalsByArea[area] = (overallTotalsByArea[area] || 0) + (transaction.amount || 0);
      overallTotalsByCategory[categoryId] = (overallTotalsByCategory[categoryId] || 0) + (transaction.amount || 0);
    });

    const totalIncome = relevantTransactions
      .filter((transaction) => transaction.activityType === ActivityType.CREDIT)
      .reduce((acc, transaction) => acc + (transaction.amount || 0), 0);
    const totalExpenses = relevantExpenseTransactions.reduce((acc, transaction) => acc + (transaction.amount || 0), 0);

    return {
      overallTotalsByArea,
      overallTotalsByCategory,
      totalIncome,
      totalExpenses,
    };
  }, [relevantTransactions, relevantExpenseTransactions]);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    chartInstanceRef.current = myChart;

    const data = {
      nodes: [{ name: "Budget", itemStyle: { color: areaColorGradients[AreaId.UNCATEGORIZED] } }],
      links: [] as { source: string; target: string; value: number }[],
    };

    for (const area of Object.keys(overallTotalsByArea)) {
      data.nodes.push({ name: area, itemStyle: { color: areaColorGradients[area as AreaId] } });
      data.links.push({
        source: "Budget",
        target: area,
        value: overallTotalsByArea[area as AreaId] ?? 0,
      });
    }

    data.nodes.push({ name: "Savings", itemStyle: { color: areaColorGradients[AreaId.INVESTMENT] } });
    data.links.push({
      source: "Budget",
      target: "Savings",
      value: totalIncome - totalExpenses,
    });

    // We manually compose the nodes for expense categories in order of their area, so that the sankey diagram is more readable.
    // To keep this order, we set layoutIterations to 0.
    for (const area of Object.keys(overallTotalsByArea)) {
      const areaCategoryIds = getAreaCategories(area as AreaId);
      areaCategoryIds.forEach((categoryId, index) => {
        const cat = DEFAULT_CATEGORIES[categoryId];
        if (
          data.nodes.find((node) => node.name === cat.name) ||
          cat.area === cat.name ||
          !overallTotalsByCategory[categoryId]
        ) {
          return;
        }
        data.nodes.push({ name: cat.name, itemStyle: { color: areaShades[cat.area as AreaId][index] } });
        data.links.push({
          source: cat.area,
          target: cat.name,
          value: overallTotalsByCategory[categoryId] ?? 0,
        });
      });
    }

    const option: EChartsOption = {
      tooltip: {
        ...commonBarchartTooltip(isMdUp),
        trigger: "item",
        triggerOn: "mousemove",
        formatter: sankeyTooltipFormatter,
      },
      series: [
        {
          type: "sankey",
          data: data.nodes,
          links: data.links,
          layoutIterations: 0,
          emphasis: {
            focus: "adjacency",
          },
          top: "10%",
          left: "5%",
          right: "5%",
          nodeAlign: "left",
          nodeGap: 44,
          label: {
            color: chartColors.textPrimary,
            fontSize: 14,
            fontWeight: "bold",
            position: "top",
            formatter: sankeyLabelFormatter,
          },
          itemStyle: {
            borderWidth: 2,
            borderColor: "rgba(255, 255, 255, 0.12)",
            shadowBlur: 12,
            shadowColor: "rgba(0, 0, 0, 0.35)",
          },
          lineStyle: {
            curveness: 0.7,
            color: "target",
            opacity: 1,
          },
        },
      ],
      toolbox: {
        bottom: "3%",
        feature: {
          saveAsImage: {
            show: true,
            title: "Save as Image",
            iconStyle: { borderColor: chartColors.textSecondary },
            pixelRatio: 4,
            name: "sankey",
          },
        },
      },
    };

    myChart.setOption(option);

    // Handle window resize
    const handleResize = () => {
      myChart.resize();
    };
    window.addEventListener("resize", handleResize);

    // Cleanup function
    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [overallTotalsByCategory, overallTotalsByArea, totalIncome, totalExpenses, isMdUp]);

  return <div ref={chartRef} style={{ width: "100%", height: "600px" }} />;
}
