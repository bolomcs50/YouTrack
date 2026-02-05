import { useContext, useEffect, useMemo, useState } from "react";
import { TimePeriodSelector } from "../components/TimePeriodSelector";
import { TransactionsContext } from "../components/TransactionsContext";
import { ActivityType, CategoryId } from "../../common/types";
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  TableSortLabel,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { ImportRulesButton } from "../components/ImportRulesButton";
import { ExportRulesButton } from "../components/ExportRulesButton";
import { CategorySelector } from "../components/CategorySelector";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { InfoIconComponent } from "../components/InfoIcon";

type SortOrder = "asc" | "desc";
type SortColumn = "date" | "description" | "amount" | "to";

export function CategorizerPage() {
  const { transactions, timePeriod } = useContext(TransactionsContext);
  const [selectedTransactionIndex, setSelectedTransactionIndex] = useState<number>(0);
  const [sortColumn, setSortColumn] = useState<SortColumn>("date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  const transactionsToCategorize = useMemo(() => {
    return transactions.filter(
      (transaction) =>
        transaction.activityType === ActivityType.DEBIT &&
        transaction.category === CategoryId.UNCATEGORIZED &&
        transaction.date.getTime() >= timePeriod.startDate &&
        transaction.date.getTime() <= timePeriod.endDate,
    );
  }, [transactions, timePeriod]);

  const sortedTransactions = useMemo(() => {
    const sorted = [...transactionsToCategorize];
    sorted.sort((a, b) => {
      let comparison = 0;
      switch (sortColumn) {
        case "date":
          comparison = a.date.getTime() - b.date.getTime();
          break;
        case "description":
          comparison = a.activityName.localeCompare(b.activityName);
          break;
        case "amount":
          comparison = a.amount - b.amount;
          break;
        case "to":
          comparison = a.actor.localeCompare(b.actor);
          break;
      }
      return sortOrder === "asc" ? comparison : -comparison;
    });
    return sorted;
  }, [transactionsToCategorize, sortColumn, sortOrder]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  useEffect(() => {
    if (sortedTransactions.length === 0) {
      setIsCategoryModalOpen(false);
    }
    setSelectedTransactionIndex((prev) => Math.min(prev, sortedTransactions.length - 1));
  }, [sortedTransactions]);

  const handleKeyDown = (key: string) => {
    if (key === "ArrowUp") {
      setSelectedTransactionIndex((prev) => Math.max(prev - 1, 0));
    } else if (key === "ArrowDown") {
      setSelectedTransactionIndex((prev) => Math.min(prev + 1, sortedTransactions.length - 1));
    }
  };

  useKeyboardShortcut({ keys: ["ArrowUp", "ArrowDown"], onKeyPressed: handleKeyDown });

  const openCategoryModalForIndex = (index: number) => {
    setSelectedTransactionIndex(index);
    setIsCategoryModalOpen(true);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper
        elevation={2}
        sx={{
          p: 2,
          position: "relative",
          display: "flex",
          flexDirection: isMdUp ? "row" : "column",
          justifyContent: "center",
          alignItems: isMdUp ? "center" : "stretch",
          gap: 4,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <TimePeriodSelector />
        </Box>
        <Stack direction={isMdUp ? "row" : "column"} spacing={2}>
          <ImportRulesButton />
          <ExportRulesButton />
        </Stack>
      </Paper>
      <Box sx={{ display: "flex", flexDirection: isMdUp ? "row" : "column", gap: 3 }}>
        <Paper elevation={1} sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
          <Box
            sx={{
              p: 2,
              borderBottom: "4px solid",
              borderColor: "secondary.main",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Uncategorized Transactions: {transactionsToCategorize.length}
            </Typography>
            <InfoIconComponent tooltip="Transactions with no category assigned. Select one to categorize it. All transactions with the same description are grouped together." />
          </Box>
          {isMdUp ? (
            <TableContainer sx={{ maxHeight: "800px", flex: 1 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell align="right" sortDirection={sortColumn === "date" ? sortOrder : false}>
                      <TableSortLabel
                        active={sortColumn === "date"}
                        direction={sortColumn === "date" ? sortOrder : "asc"}
                        onClick={() => handleSort("date")}
                      >
                        Date
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sortDirection={sortColumn === "description" ? sortOrder : false}>
                      <TableSortLabel
                        active={sortColumn === "description"}
                        direction={sortColumn === "description" ? sortOrder : "asc"}
                        onClick={() => handleSort("description")}
                      >
                        Description
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="right" sortDirection={sortColumn === "amount" ? sortOrder : false}>
                      <TableSortLabel
                        active={sortColumn === "amount"}
                        direction={sortColumn === "amount" ? sortOrder : "asc"}
                        onClick={() => handleSort("amount")}
                      >
                        Amount
                      </TableSortLabel>
                    </TableCell>
                    <TableCell align="left" sortDirection={sortColumn === "to" ? sortOrder : false}>
                      <TableSortLabel
                        active={sortColumn === "to"}
                        direction={sortColumn === "to" ? sortOrder : "asc"}
                        onClick={() => handleSort("to")}
                      >
                        To
                      </TableSortLabel>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {sortedTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                          No uncategorized transactions in the selected period
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    sortedTransactions.map((row, index) => (
                      <TableRow
                        key={index}
                        sx={{
                          bgcolor: selectedTransactionIndex === index ? "primary.light" : "transparent",
                          "&:hover": { bgcolor: "primary.light" },
                          cursor: "pointer",
                        }}
                        onClick={() => setSelectedTransactionIndex(index)}
                      >
                        <TableCell component="th" scope="row" align="right">
                          {row.date.toLocaleDateString()}
                        </TableCell>
                        <TableCell align="left">{row.activityName}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: 500 }}>
                          {row.amount.toFixed(2)} {row.currency}
                        </TableCell>
                        <TableCell align="left">{row.actor}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Box sx={{ p: 1.5, display: "flex", flexDirection: "column", gap: 1.5 }}>
              {sortedTransactions.length === 0 ? (
                <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                  No uncategorized transactions in the selected period
                </Typography>
              ) : (
                sortedTransactions.map((row, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      bgcolor: selectedTransactionIndex === index ? "primary.light" : "background.paper",
                      border: "1px solid",
                      borderColor: selectedTransactionIndex === index ? "primary.main" : "divider",
                      cursor: "pointer",
                      "&:active": { bgcolor: "primary.light" },
                    }}
                    onClick={() => openCategoryModalForIndex(index)}
                  >
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.activityName}
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {row.amount.toFixed(2)} {row.currency}
                      </Typography>
                    </Stack>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Typography variant="caption" color="text.secondary">
                        {row.date.toLocaleDateString()}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {row.actor}
                      </Typography>
                    </Stack>
                  </Paper>
                ))
              )}
            </Box>
          )}
        </Paper>

        {isMdUp ? (
          <Paper elevation={2} sx={{ width: "40%", p: 2 }}>
            <CategorySelector
              enabled={sortedTransactions.length > 0}
              selectedTransaction={sortedTransactions[selectedTransactionIndex]}
            />
          </Paper>
        ) : (
          <Dialog open={isCategoryModalOpen} onClose={() => setIsCategoryModalOpen(false)} fullScreen>
            <DialogTitle>
              {sortedTransactions.length > 0 && sortedTransactions[selectedTransactionIndex] ? (
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                  <Stack>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sortedTransactions[selectedTransactionIndex].activityName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sortedTransactions[selectedTransactionIndex].date.toLocaleDateString()}
                    </Typography>
                  </Stack>
                  <Stack alignItems="flex-end">
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {sortedTransactions[selectedTransactionIndex].amount.toFixed(2)}{" "}
                      {sortedTransactions[selectedTransactionIndex].currency}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {sortedTransactions[selectedTransactionIndex].actor}
                    </Typography>
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="h6">Transaction Details</Typography>
              )}
            </DialogTitle>
            <DialogContent>
              <CategorySelector
                enabled={sortedTransactions.length > 0}
                selectedTransaction={sortedTransactions[selectedTransactionIndex]}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsCategoryModalOpen(false)} variant="contained">
                Close
              </Button>
            </DialogActions>
          </Dialog>
        )}
      </Box>
    </Box>
  );
}
