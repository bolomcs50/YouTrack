import { ActivityType, Transaction } from "../common/types";

const importTransactions = (file: File): Promise<Transaction[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const text = event.target?.result as string;
      const transactions: Transaction[] = parseCsv(text);
      resolve(transactions);
    };

    reader.onerror = () => {
      reject(new Error("Failed to read file"));
    };

    reader.readAsText(file);
  });
};

export const parseCsv = (text: string): Transaction[] => {
  const transactions: Transaction[] = [];
  for (const line of text.split("\n").slice(1)) {
    const [
      yuh_date,
      ,
      yuh_activityName,
      yuh_debit,
      yuh_debitCurrency,
      yuh_credit,
      yuh_creditCurrency,
      ,
      yuh_locality,
      yuh_recipient,
      yuh_sender,
    ] = line.split(";");

    if (yuh_debit && yuh_credit) {
      console.debug("Skip exchange:", line);
      continue;
    } else if (!yuh_debit && !yuh_credit) {
      console.debug("Skip empty lines and bonuses:", line);
      continue;
    }

    const [day, month, year] = yuh_date.split("/").map(Number);
    const date = new Date(year, month - 1, day, 0, 0, 0, 0);
    if (yuh_credit) {
      transactions.push({
        date,
        activityType: ActivityType.CREDIT,
        activityName: yuh_activityName.replace(/"/g, ""),
        amount: parseFloat(yuh_credit),
        currency: yuh_creditCurrency,
        locality: yuh_locality,
        actor: yuh_sender.replace(/"/g, ""),
      });
    } else {
      transactions.push({
        date,
        activityType: ActivityType.DEBIT,
        activityName: yuh_activityName.replace(/"/g, ""),
        amount: Math.abs(parseFloat(yuh_debit)),
        currency: yuh_debitCurrency,
        locality: yuh_locality,
        actor: yuh_recipient.replace(/"/g, ""),
      });
    }
  }
  return transactions;
};

export default importTransactions;
