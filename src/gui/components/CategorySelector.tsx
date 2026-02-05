import { DEFAULT_CATEGORIES } from "../../common/constants";
import { AreaId, CategoryId, Transaction } from "../../common/types";
import { Box, Button, Grid, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { useKeyboardShortcut } from "../hooks/useKeyboardShortcut";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { TransactionsContext } from "./TransactionsContext";
import { InfoIconComponent } from "./InfoIcon";

export const CategorySelector = ({
  enabled,
  selectedTransaction,
}: {
  enabled: boolean;
  selectedTransaction?: Transaction;
}) => {
  const { setUserCategoryRules } = useContext(TransactionsContext);
  const [selectedExpenseAreaIndex, setSelectedExpenseAreaIndex] = useState<number | null>(null);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up("md"));

  // We need a reference to be able to access the current value in the handleKeyDown we pass as callback prop
  const areaRef = useRef<number | null>(null);
  useEffect(() => {
    areaRef.current = selectedExpenseAreaIndex;
  }, [selectedExpenseAreaIndex]);

  const categorizeTransaction = useCallback(
    (transaction: Transaction, category: CategoryId) => {
      setUserCategoryRules(
        (prev) =>
          ({
            ...prev,
            [category]: [...prev[category], transaction.activityName],
          }) as Record<CategoryId, string[]>,
      );
    },
    [setUserCategoryRules],
  );

  const handleKeyDown = useCallback(
    (key: string) => {
      if (!selectedTransaction) {
        return;
      }
      const keyNumber = Number(key);
      if (key === "Escape") {
        setSelectedExpenseAreaIndex(null);
        return;
      }
      if (areaRef.current === null) {
        if (keyNumber <= Object.values(AreaId).length) {
          setSelectedExpenseAreaIndex(keyNumber - 1);
        }
        return;
      } else {
        const area = Object.values(AreaId)[areaRef.current];
        const areaCategories = Object.values(CategoryId).filter(
          (category) => DEFAULT_CATEGORIES[category].area === area,
        );
        if (keyNumber <= areaCategories.length) {
          categorizeTransaction(selectedTransaction, areaCategories[keyNumber - 1]);
        }
        setSelectedExpenseAreaIndex(null);
      }
    },
    [selectedTransaction, setSelectedExpenseAreaIndex, categorizeTransaction],
  );

  useKeyboardShortcut({ keys: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "Escape"], onKeyPressed: handleKeyDown });

  return (
    <Box>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, mb: 0 }}>
          Categories
        </Typography>
        {isMdUp && (
          <InfoIconComponent tooltip="Use the keyboard: press a number to select an area of spending, then another for a category within that area." />
        )}
      </Box>
      <Stack direction="column">
        {Object.values(AreaId).map((area, areaIndex) => (
          <Stack
            direction="column"
            key={areaIndex}
            border="2px solid"
            borderColor={areaIndex === selectedExpenseAreaIndex ? "warning.main" : "transparent"}
            borderRadius={1}
            p={1}
          >
            <Typography
              variant="h6"
              gutterBottom
              sx={{ fontWeight: 600, mb: 1 }}
              color={areaIndex === selectedExpenseAreaIndex ? "warning.main" : "text.primary"}
            >
              {`${areaIndex + 1}. ${area}`}
            </Typography>
            <Grid container spacing={2} columns={3}>
              {Object.values(CategoryId)
                .filter((category) => DEFAULT_CATEGORIES[category].area === area)
                .map((category, categoryIndex) => (
                  <Grid size={1} key={categoryIndex}>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{
                        minHeight: "60px",
                        background: enabled ? "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)" : "grey.600",
                        color: "white",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          background: enabled ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" : "grey.500",
                          transform: "translateY(-2px)",
                          boxShadow: 4,
                        },
                        transition: "all 0.2s ease",
                        boxShadow: 2,
                      }}
                      onClick={() => selectedTransaction && categorizeTransaction(selectedTransaction, category)}
                      disabled={!enabled}
                    >
                      {areaIndex === selectedExpenseAreaIndex ? `${categoryIndex + 1}. ` : ""}
                      {DEFAULT_CATEGORIES[category].name} {DEFAULT_CATEGORIES[category].emoji}
                    </Button>
                  </Grid>
                ))}
            </Grid>
          </Stack>
        ))}
      </Stack>
    </Box>
  );
};
