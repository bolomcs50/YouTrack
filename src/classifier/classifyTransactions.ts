import { DEFAULT_CATEGORIES } from "../common/constants";
import { ActivityType, Category, CategoryId, Transaction } from "../common/types";

const getCategoriesWithRules = (userCategoryRules: Record<CategoryId, string[]>) => {
  const categoriesWithRules = DEFAULT_CATEGORIES;
  for (const categoryId in userCategoryRules) {
    categoriesWithRules[categoryId as CategoryId].matches = [
      ...categoriesWithRules[categoryId as CategoryId].matches,
      ...userCategoryRules[categoryId as CategoryId],
    ];
  }
  return categoriesWithRules;
};

/**
 * Classifies the transactions into categories.
 * @param transactions - The transactions to classify.
 */
export const classifyTransactions = (transactions: Transaction[], userCategoryRules?: Record<CategoryId, string[]>) => {
  const categoriesWithRules = userCategoryRules ? getCategoriesWithRules(userCategoryRules) : DEFAULT_CATEGORIES;
  transactions
    .filter((transaction) => transaction.category === undefined || transaction.category === CategoryId.UNCATEGORIZED)
    .forEach((transaction) => {
      if (transaction.activityType === ActivityType.CREDIT) {
        return;
      }
      for (const categoryId in categoriesWithRules) {
        const category = categoriesWithRules[categoryId as CategoryId];
        if (match(transaction, category)) {
          transaction.category = categoryId as CategoryId;
          break;
        }
      }
      if (!transaction.category) {
        transaction.category = CategoryId.UNCATEGORIZED;
      }
    });
};

/** Searches for matches between a transaction and a category, by comparing the transaction's activity name and actor with the category's matches
 * @param transaction - The transaction to match.
 * @param category - The category to match.
 * @returns True if the transaction matches the category, false otherwise.
 */
const match = (transaction: Transaction, category: Category) => {
  const searchText = `${transaction.activityName} ${transaction.actor}`;
  return category.matches.some((match) => searchText.toLowerCase().includes(match.toLowerCase()));
};
