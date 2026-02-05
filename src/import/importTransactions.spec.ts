import { describe, it, expect } from "vitest";
import { parseCsv } from "./importTransactions";
import { ActivityType } from "../common/types";

const csvHeader = `Blah`; // Header will be ignored

describe("importTransactions", () => {
  it("should parse a CSV file with a few transactions (debit and credit)", async () => {
    const mockCsvTransaction =
      `24/09/2023;PAYMENT_TRANSACTION_OUT;"""Twint to SBBCFFFFS""";-50.50;CHF;;;;;"""SBBCFFFFS""";;0;;;;\n` +
      `25/12/2024;PAYMENT_TRANSACTION_IN;"""Transfer from Google AG""";;;10000.0;CHF;;;;"""Google AG""";0;;;;`;
    const csvContent = `${csvHeader}\n${mockCsvTransaction}`;

    const transactions = parseCsv(csvContent);

    expect(transactions).toHaveLength(2);
    expect(transactions[0]).toEqual({
      date: new Date(2023, 8, 24),
      activityType: ActivityType.DEBIT,
      activityName: "Twint to SBBCFFFFS",
      amount: 50.5,
      currency: "CHF",
      locality: "",
      actor: "SBBCFFFFS",
    });
    expect(transactions[1]).toEqual({
      date: new Date(2024, 11, 25),
      activityType: ActivityType.CREDIT,
      activityName: "Transfer from Google AG",
      amount: 10000.0,
      currency: "CHF",
      locality: "",
      actor: "Google AG",
    });
  });

  it("should fail to parse a CSV file with an invalid transaction", () => {
    const mockCsvTransaction = `---`;
    const csvContent = `${csvHeader}\n${mockCsvTransaction}`;
    const transactions = parseCsv(csvContent);
    expect(transactions).toHaveLength(0);
  });

  it("should skip parsing a money exchange transactions", () => {
    const mockCsvTransaction = `24/06/2024;BANK_AUTO_ORDER_EXECUTED;"""Cambio automatico Franchi svizzeri""";-25.07;CHF;25.97;EUR;;;;;0.24;;;;0.965454`;
    const csvContent = `${csvHeader}\n${mockCsvTransaction}`;
    const transactions = parseCsv(csvContent);
    expect(transactions).toHaveLength(0);
  });

  it("should skip parsing a swissqoin bonus transactions", () => {
    const mockCsvTransaction = `17/06/2024;REWARD_RECEIVED;"""Bonus carta""";;;;;;;;;;;1;SWQ;`;
    const csvContent = `${csvHeader}\n${mockCsvTransaction}`;
    const transactions = parseCsv(csvContent);
    expect(transactions).toHaveLength(0);
  });
});
