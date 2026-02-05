import { useContext, useEffect, useState } from "react";
import { TransactionsContext } from "../components/TransactionsContext";
import { AreaId, CategoryId, Transaction } from "../../common/types";
import { DEFAULT_CATEGORIES } from "../../common/constants";
import { Grid } from "@mui/material";
import { ExpenseByAreaBar } from "./ExpenseByAreaBar";
import { ExpenseByAreaPie } from "./ExpenseByAreaPie";
import { getAllMonthYears } from "../../common/utils";

// How many transactions to show in each bar tooltip
const TOP_TRANSACTIONS_COUNT = 3;

// This component controls the state and pushes it down into the charts, as another 2 separate components
export function ExpensesByArea() {
  const { relevantExpenseTransactions, timePeriod } = useContext(TransactionsContext);

  const [barChartData, setBarChartData] = useState<
    Record<
      AreaId,
      { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>; topTransactions: Transaction[] }
    >
  >(
    {} as Record<
      AreaId,
      { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>; topTransactions: Transaction[] }
    >,
  );

  const [barChartDrilldownData, setBarChartDrilldownData] = useState<
    Record<
      CategoryId,
      { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>; topTransactions: Transaction[] }
    >
  >(
    {} as Record<
      CategoryId,
      { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>; topTransactions: Transaction[] }
    >,
  );

  const [pieChartData, setPieChartData] = useState<Record<AreaId, { total: number; topTransactions: Transaction[] }>>(
    {} as Record<AreaId, { total: number; topTransactions: Transaction[] }>,
  );

  const [pieChartDrilldownData, setPieChartDrilldownData] = useState<
    Record<CategoryId, { total: number; topTransactions: Transaction[] }>
  >({} as Record<CategoryId, { total: number; topTransactions: Transaction[] }>);

  const [currentDrilldown, setCurrentDrilldown] = useState<AreaId | null>(null);

  useEffect(() => {
    const allMonthYears = getAllMonthYears(timePeriod);
    const newBarChartData = relevantExpenseTransactions.reduce(
      (acc, transaction) => {
        if (!transaction.category) return acc;
        const areaId = DEFAULT_CATEGORIES[transaction.category as CategoryId].area;
        const monthYear = transaction.date!.toLocaleString(undefined, { month: "short", year: "numeric" });
        if (!acc[areaId]) {
          acc[areaId] = { monthYears: {}, topTransactions: [] };
          allMonthYears.forEach((monthYear) => {
            acc[areaId].monthYears[monthYear] = { amount: 0, topTransactions: [] };
          });
        }
        acc[areaId].monthYears[monthYear].amount += transaction.amount;

        // Accumulate top transactions for the current month
        acc[areaId].monthYears[monthYear].topTransactions.push(transaction);
        acc[areaId].monthYears[monthYear].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[areaId].monthYears[monthYear].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[areaId].monthYears[monthYear].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }
        // Accumulate top transactions for the entire period
        acc[areaId].topTransactions.push(transaction);
        acc[areaId].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[areaId].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[areaId].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }
        return acc;
      },
      {} as Record<
        AreaId,
        {
          monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>;
          topTransactions: Transaction[];
        }
      >,
    );

    // Fill in all months for all areas
    allMonthYears.forEach((monthYear) => {
      Object.values(AreaId).forEach((areaId) => {
        if (!newBarChartData[areaId]) {
          newBarChartData[areaId] = { monthYears: {}, topTransactions: [] };
        }
        if (!newBarChartData[areaId].monthYears[monthYear]) {
          newBarChartData[areaId].monthYears[monthYear] = { amount: 0, topTransactions: [] };
        }
      });
    });
    setBarChartData(newBarChartData);

    const newBarChartDrilldownData = relevantExpenseTransactions.reduce(
      (acc, transaction) => {
        if (!transaction.category) return acc;
        const categoryId = transaction.category as CategoryId;
        const monthYear = transaction.date!.toLocaleString(undefined, { month: "short", year: "numeric" });
        if (!acc[categoryId]) {
          acc[categoryId] = { monthYears: {}, topTransactions: [] };
        }
        if (!acc[categoryId].monthYears[monthYear]) {
          acc[categoryId].monthYears[monthYear] = { amount: 0, topTransactions: [] };
        }
        acc[categoryId].monthYears[monthYear].amount += transaction.amount;

        // Accumulate top transactions for the current month
        acc[categoryId].monthYears[monthYear].topTransactions.push(transaction);
        acc[categoryId].monthYears[monthYear].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[categoryId].monthYears[monthYear].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[categoryId].monthYears[monthYear].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }
        // Accumulate top transactions for the entire period
        acc[categoryId].topTransactions.push(transaction);
        acc[categoryId].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[categoryId].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[categoryId].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }

        return acc;
      },
      {} as Record<
        CategoryId,
        {
          monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>;
          topTransactions: Transaction[];
        }
      >,
    );
    // Fill in all months for all categories
    allMonthYears.forEach((monthYear) => {
      Object.values(CategoryId).forEach((categoryId) => {
        if (!newBarChartDrilldownData[categoryId]) {
          newBarChartDrilldownData[categoryId] = { monthYears: {}, topTransactions: [] };
        }
        if (!newBarChartDrilldownData[categoryId].monthYears[monthYear]) {
          newBarChartDrilldownData[categoryId].monthYears[monthYear] = { amount: 0, topTransactions: [] };
        }
      });
    });
    setBarChartDrilldownData(newBarChartDrilldownData);

    const newPieChartData: Record<AreaId, { total: number; topTransactions: Transaction[] }> = {} as Record<
      AreaId,
      { total: number; topTransactions: Transaction[] }
    >;

    Object.keys(newBarChartData).forEach((areaId) => {
      newPieChartData[areaId as AreaId] = { total: 0, topTransactions: [] };
      newPieChartData[areaId as AreaId].total = Object.values(newBarChartData[areaId as AreaId].monthYears).reduce(
        (acc, monthYear) => acc + monthYear.amount,
        0,
      );
      newPieChartData[areaId as AreaId].topTransactions = newBarChartData[areaId as AreaId].topTransactions;
      newPieChartData[areaId as AreaId].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
      if (newPieChartData[areaId as AreaId].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
        newPieChartData[areaId as AreaId].topTransactions.length = TOP_TRANSACTIONS_COUNT;
      }
    });
    setPieChartData(newPieChartData);

    const newPieChartDrilldownData: Record<CategoryId, { total: number; topTransactions: Transaction[] }> =
      {} as Record<CategoryId, { total: number; topTransactions: Transaction[] }>;
    Object.keys(newBarChartDrilldownData).forEach((categoryId) => {
      newPieChartDrilldownData[categoryId as CategoryId] = { total: 0, topTransactions: [] };
      newPieChartDrilldownData[categoryId as CategoryId].total = Object.values(
        newBarChartDrilldownData[categoryId as CategoryId].monthYears,
      ).reduce((acc, monthYear) => acc + monthYear.amount, 0);
      newPieChartDrilldownData[categoryId as CategoryId].topTransactions =
        newBarChartDrilldownData[categoryId as CategoryId].topTransactions;
      newPieChartDrilldownData[categoryId as CategoryId].topTransactions.sort(
        (a, b) => (b.amount || 0) - (a.amount || 0),
      );
      if (newPieChartDrilldownData[categoryId as CategoryId].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
        newPieChartDrilldownData[categoryId as CategoryId].topTransactions.length = TOP_TRANSACTIONS_COUNT;
      }
    });
    setPieChartDrilldownData(newPieChartDrilldownData);
  }, [relevantExpenseTransactions, timePeriod]);

  return (
    <Grid container spacing={3} columns={12}>
      <Grid size={{ xs: 12, md: 8 }}>
        <ExpenseByAreaBar
          barChartData={barChartData}
          barChartDrilldownData={barChartDrilldownData}
          currentDrilldown={currentDrilldown}
          setCurrentDrilldown={setCurrentDrilldown}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <ExpenseByAreaPie
          pieChartData={pieChartData}
          pieChartDrilldownData={pieChartDrilldownData}
          currentDrilldown={currentDrilldown}
          setCurrentDrilldown={setCurrentDrilldown}
        />
      </Grid>
    </Grid>
  );
}
