import { describe, expect, it } from "vitest";
import { classifyTransactions } from "./classifyTransactions";
import { CategoryId, Transaction } from "../common/types";

describe("classifyTransactions", () => {
  it("should classify expenses correctly", async () => {
    const mockTransactions: Transaction[] = [
      {
        date: new Date(2024, 12, 31),
        activityType: 1,
        activityName: "Transfer to Real Estate Partners",
        amount: 1191.6,
        currency: "CHF",
        locality: '""""""',
        actor: "Real Estate Partners",
      },
      {
        date: new Date(2024, 12, 31),
        activityType: 1,
        activityName: "Pillar3a",
        amount: 450,
        currency: "CHF",
        locality: '""""""',
        actor: "Pillar3a",
      },
      {
        date: new Date(2024, 12, 31),
        activityType: 1,
        activityName: "Krankenkasse",
        amount: 412.5,
        currency: "CHF",
        locality: '""""""',
        actor: "Krankenkasse",
      },
    ];
    classifyTransactions(mockTransactions);
    expect(mockTransactions[0].category).toBe(CategoryId.UNCATEGORIZED);
    expect(mockTransactions[1].category).toBe(CategoryId.INVESTMENT);
    expect(mockTransactions[2].category).toBe(CategoryId.HEALTH_INSURANCE);
  });

  it("should not classify income", async () => {
    const mockTransactions: Transaction[] = [
      {
        date: new Date(2024, 12, 31),
        activityType: 0,
        activityName: "Transfer from TechCorp Solutions AG",
        amount: 6212.66,
        currency: "CHF",
        locality: '""""""',
        actor: "TechCorp Solutions AG",
      },
    ];
    classifyTransactions(mockTransactions);
    expect(mockTransactions[0].category).toBe(undefined);
  });

  it("should not fail if no transactions are provided", async () => {
    const mockTransactions: Transaction[] = [];
    classifyTransactions(mockTransactions);
    expect(mockTransactions.length).toBe(0);
  });
});
