import React, { createContext } from "react";
import { CategoryId, Transaction } from "../../common/types";
import { TimePeriod } from "./TransactionsContextProvider";

// Define the context shape
interface TransactionsContextType {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  relevantTransactions: Transaction[];
  relevantExpenseTransactions: Transaction[];
  timePeriod: TimePeriod;
  setTimePeriod: React.Dispatch<React.SetStateAction<TimePeriod>>;
  userCategoryRules: Record<CategoryId, string[]>;
  setUserCategoryRules: React.Dispatch<React.SetStateAction<Record<CategoryId, string[]>>>;
}

export const TransactionsContext = createContext<TransactionsContextType>({
  transactions: [],
  setTransactions: () => {},
  relevantTransactions: [],
  relevantExpenseTransactions: [],
  timePeriod: {} as TimePeriod,
  setTimePeriod: () => {},
  userCategoryRules: Object.values(CategoryId).reduce(
    (acc, category) => {
      acc[category as CategoryId] = [];
      return acc;
    },
    {} as Record<CategoryId, string[]>,
  ),
  setUserCategoryRules: () => {},
});
