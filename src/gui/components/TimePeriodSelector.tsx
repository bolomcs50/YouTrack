import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { useContext } from "react";
import { TransactionsContext } from "./TransactionsContext";
import { Box } from "@mui/material";

export function TimePeriodSelector() {
  const { timePeriod, setTimePeriod } = useContext(TransactionsContext);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ display: "flex", justifyContent: "center", gap: 3, flexWrap: "wrap" }}>
        <DatePicker
          label="From"
          views={["year", "month"]}
          value={timePeriod.startDate ? new Date(timePeriod.startDate) : null}
          disableFuture
          yearsOrder="desc"
          maxDate={timePeriod.endDate ? new Date(timePeriod.endDate) : undefined}
          onChange={(date) => {
            if (date) {
              setTimePeriod({ ...timePeriod, startDate: date.getTime() });
            }
          }}
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              },
            },
          }}
        />
        <DatePicker
          label="To"
          views={["year", "month"]}
          value={timePeriod.endDate ? new Date(timePeriod.endDate) : null}
          minDate={timePeriod.startDate ? new Date(timePeriod.startDate) : undefined}
          onChange={(date) => {
            if (!date) return;
            const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
            setTimePeriod({ ...timePeriod, endDate: lastDay.getTime() });
          }}
          slotProps={{
            textField: {
              sx: {
                "& .MuiOutlinedInput-root": {
                  "&:hover fieldset": {
                    borderColor: "primary.main",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "primary.main",
                  },
                },
              },
            },
          }}
        />
      </Box>
    </LocalizationProvider>
  );
}
