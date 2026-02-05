export enum CategorySpendingType {
  NEED = "Needs",
  WANT = "Wants",
  SAVING = "Savings",
}

export enum AreaId {
  HOUSING = "Housing",
  FOOD = "Food",
  HEALTH = "Health",
  TRANSPORTATION = "Transportation",
  SHOPPING = "Shopping",
  ENTERTAINMENT = "Entertainment",
  INVESTMENT = "Investment",
  UNCATEGORIZED = "Uncategorized",
}

export enum CategoryId {
  RENT = "Rent",
  UTILITIES = "Utilities",
  HOUSE_INSURANCE = "House Insurance",
  GROCERIES = "Groceries",
  EATING_OUT = "Eating Out",
  HEALTH_INSURANCE = "Health Insurance",
  MEDICATION = "Medication",
  DOCTORS = "Doctors",
  PUBLIC_TRANSPORT = "Public Transport",
  VEHICLE = "Vehicle",
  CLOTHING = "Clothing",
  BARBER = "Barber",
  GIFTS = "Gifts",
  GOING_OUT = "Going Out",
  TRAVEL = "Travel",
  INVESTMENT = "Investment",
  UNCATEGORIZED = "Uncategorized",
}

export type Category = {
  name: string;
  matches: string[];
  area: AreaId;
  spendingType?: CategorySpendingType;
  emoji?: string;
};

export enum ActivityType {
  CREDIT,
  DEBIT,
}

export interface Transaction {
  date: Date;
  activityType: ActivityType;
  activityName: string;
  amount: number;
  currency: string;
  locality: string;
  actor: string;
  category?: CategoryId; // Only expenses have a category, for now
}

export enum Page {
  Charts = "Charts",
  Categorizer = "Categorizer",
}
