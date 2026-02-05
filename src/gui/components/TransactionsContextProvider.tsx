import { useMemo, useState } from "react";
import { ActivityType, CategoryId, Transaction } from "../../common/types";
import { TransactionsContext } from "./TransactionsContext";

export type TimePeriod = {
  startDate: number;
  endDate: number;
};

// Context provider component
export const TransactionsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [timePeriod, setTimePeriod] = useState<TimePeriod>({} as TimePeriod);
  const [userCategoryRules, setUserCategoryRules] = useState<Record<CategoryId, string[]>>(
    Object.values(CategoryId).reduce(
      (acc, category) => {
        acc[category as CategoryId] = [];
        return acc;
      },
      {} as Record<CategoryId, string[]>,
    ),
  );

  // Calculate relevantTransactions and relevantExpenseTransactions
  const { relevantTransactions, relevantExpenseTransactions } = useMemo(() => {
    const relevant = transactions.filter((transaction) => {
      const ts = transaction.date.getTime();
      return ts >= timePeriod.startDate && ts <= timePeriod.endDate;
    });
    const relevantExpenses = relevant.filter((transaction) => transaction.activityType === ActivityType.DEBIT);
    return {
      relevantTransactions: relevant,
      relevantExpenseTransactions: relevantExpenses,
    };
  }, [transactions, timePeriod]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        relevantTransactions,
        relevantExpenseTransactions,
        setTransactions,
        timePeriod,
        setTimePeriod,
        userCategoryRules,
        setUserCategoryRules,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
};
