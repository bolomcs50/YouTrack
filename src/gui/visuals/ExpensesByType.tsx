import { useContext, useEffect, useState } from "react";
import { TransactionsContext } from "../components/TransactionsContext";
import { CategoryId, CategorySpendingType, Transaction } from "../../common/types";
import { DEFAULT_CATEGORIES } from "../../common/constants";
import { ExpenseByTypePie } from "./ExpenseByTypePie";
import { Grid } from "@mui/material";
import { ExpenseByTypeBar } from "./ExpenseByTypeBar";

// How many transactions to show in each bar tooltip
const TOP_TRANSACTIONS_COUNT = 3;

// This component controls the state and pushes it down into the charts, as another 2 separate components
export function ExpensesByType() {
  const { relevantExpenseTransactions } = useContext(TransactionsContext);
  const [barChartData, setBarChartData] = useState<
    Record<
      CategorySpendingType,
      { monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>; topTransactions: Transaction[] }
    >
  >({
    Needs: { monthYears: {}, topTransactions: [] },
    Wants: { monthYears: {}, topTransactions: [] },
    Savings: { monthYears: {}, topTransactions: [] },
  });
  const [pieChartData, setPieChartData] = useState<
    Record<CategorySpendingType, { total: number; topTransactions: Transaction[] }>
  >({
    Needs: { total: 0, topTransactions: [] },
    Wants: { total: 0, topTransactions: [] },
    Savings: { total: 0, topTransactions: [] },
  });

  useEffect(() => {
    const newBarChartData = relevantExpenseTransactions.reduce<
      Record<
        CategorySpendingType,
        {
          monthYears: Record<string, { amount: number; topTransactions: Transaction[] }>;
          topTransactions: Transaction[];
        }
      >
    >(
      (acc, transaction) => {
        const categoryId = transaction.category as CategoryId;
        const expenseTypeKey = DEFAULT_CATEGORIES[categoryId].spendingType;
        if (!expenseTypeKey) return acc; // Categories without a clear spending type are not included in the chart
        const monthYear = transaction.date!.toLocaleString(undefined, { month: "short", year: "numeric" });
        if (!acc[expenseTypeKey].monthYears[monthYear]) {
          acc[expenseTypeKey].monthYears[monthYear] = { amount: 0, topTransactions: [] };
        }
        acc[expenseTypeKey].monthYears[monthYear].amount += transaction.amount;
        // Zero out the other months for this spending type, to prevent bars from shifting to the left when the series only contains few non-zero values
        for (const spendingType of Object.values(
          Object.values(CategorySpendingType).filter((type) => type !== expenseTypeKey),
        ) as CategorySpendingType[]) {
          if (!acc[spendingType].monthYears[monthYear]) {
            acc[spendingType].monthYears[monthYear] = { amount: 0, topTransactions: [] };
          }
        }

        // Accumulate top transactions for the entire period
        acc[expenseTypeKey].topTransactions.push(transaction);
        // Only keep the TOP_TRANSACTIONS_COUNT transactions with the highest amount
        acc[expenseTypeKey].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[expenseTypeKey].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[expenseTypeKey].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }

        // Accumulate top transactions for the current month
        acc[expenseTypeKey].monthYears[monthYear].topTransactions.push(transaction);
        acc[expenseTypeKey].monthYears[monthYear].topTransactions.sort((a, b) => (b.amount || 0) - (a.amount || 0));
        if (acc[expenseTypeKey].monthYears[monthYear].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
          acc[expenseTypeKey].monthYears[monthYear].topTransactions.length = TOP_TRANSACTIONS_COUNT;
        }

        return acc;
      },
      {
        Needs: { monthYears: {}, topTransactions: [] },
        Wants: { monthYears: {}, topTransactions: [] },
        Savings: { monthYears: {}, topTransactions: [] },
      },
    );

    setBarChartData(newBarChartData);

    const newPieChartData: Record<CategorySpendingType, { total: number; topTransactions: Transaction[] }> = {
      Needs: { total: 0, topTransactions: [] },
      Wants: { total: 0, topTransactions: [] },
      Savings: { total: 0, topTransactions: [] },
    };

    Object.keys(newBarChartData).forEach((expenseType) => {
      newPieChartData[expenseType as CategorySpendingType].total = Object.values(
        newBarChartData[expenseType as CategorySpendingType].monthYears,
      ).reduce((acc, monthYear) => acc + monthYear.amount, 0);
      newPieChartData[expenseType as CategorySpendingType].topTransactions =
        newBarChartData[expenseType as CategorySpendingType].topTransactions;
      newPieChartData[expenseType as CategorySpendingType].topTransactions.sort(
        (a, b) => (b.amount || 0) - (a.amount || 0),
      );
      if (newPieChartData[expenseType as CategorySpendingType].topTransactions.length > TOP_TRANSACTIONS_COUNT) {
        newPieChartData[expenseType as CategorySpendingType].topTransactions.length = TOP_TRANSACTIONS_COUNT;
      }
    });

    setPieChartData(newPieChartData);
  }, [relevantExpenseTransactions]);

  return (
    <Grid container spacing={3} columns={12}>
      <Grid size={{ xs: 12, md: 4 }}>
        <ExpenseByTypePie pieChartData={pieChartData} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <ExpenseByTypeBar barChartData={barChartData} />
      </Grid>
    </Grid>
  );
}
