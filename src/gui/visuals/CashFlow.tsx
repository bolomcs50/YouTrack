import { useContext, useMemo } from "react";
import { TransactionsContext } from "../components/TransactionsContext";
import { ActivityType } from "../../common/types";
import { Grid } from "@mui/material";
import { CashFlowHorizontalBar } from "./CashFlowHorizontalBar";
import { CashFlowVerticalBar } from "./CashFlowVerticalBar";
import { getAllMonthYears } from "../../common/utils";

export const CashFlow = () => {
  const { relevantTransactions, timePeriod } = useContext(TransactionsContext);

  const { totalIncome, totalExpenses, monthlyIncomes, monthlyExpenses, monthYears } = useMemo(() => {
    const allMonthYears = getAllMonthYears(timePeriod);
    const monthlyTotals: Record<string, { income: number; expense: number }> = {};

    // Initialize all months with zero values
    allMonthYears.forEach((monthYear) => {
      monthlyTotals[monthYear] = { income: 0, expense: 0 };
    });

    // Calculate monthly totals from relevant transactions
    relevantTransactions.forEach((transaction) => {
      const monthYear = transaction.date.toLocaleString(undefined, { month: "short", year: "numeric" });
      if (!monthlyTotals[monthYear]) {
        monthlyTotals[monthYear] = { income: 0, expense: 0 };
      }
      if (transaction.activityType === ActivityType.CREDIT) {
        monthlyTotals[monthYear].income += transaction.amount || 0;
      } else if (transaction.activityType === ActivityType.DEBIT) {
        monthlyTotals[monthYear].expense += transaction.amount || 0;
      }
    });

    const monthlyIncomes = allMonthYears.map((monthYear) => Number(monthlyTotals[monthYear].income.toFixed(2)));
    const monthlyExpenses = allMonthYears.map((monthYear) => Number(monthlyTotals[monthYear].expense.toFixed(2)));

    const totalIncome = monthlyIncomes.reduce((acc, income) => acc + income, 0);
    const totalExpenses = monthlyExpenses.reduce((acc, expense) => acc + expense, 0);

    return {
      totalIncome,
      totalExpenses,
      monthlyIncomes,
      monthlyExpenses,
      monthYears: allMonthYears,
    };
  }, [relevantTransactions, timePeriod]);

  return (
    <Grid container spacing={3} columns={12}>
      <Grid size={{ xs: 12, md: 4 }}>
        <CashFlowHorizontalBar totalIncome={totalIncome} totalExpenses={totalExpenses} />
      </Grid>
      <Grid size={{ xs: 12, md: 8 }}>
        <CashFlowVerticalBar
          monthlyIncomes={monthlyIncomes}
          monthlyExpenses={monthlyExpenses}
          monthYears={monthYears}
        />
      </Grid>
    </Grid>
  );
};
