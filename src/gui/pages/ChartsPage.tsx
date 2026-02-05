import { Grid, Paper, Box, Typography } from "@mui/material";
import { TimePeriodSelector } from "../components/TimePeriodSelector";
import { CashFlow } from "../visuals/CashFlow";
import { Sankey } from "../visuals/Sankey";
import { ExpensesByType } from "../visuals/ExpensesByType";
import { ExpensesByArea } from "../visuals/ExpensesByArea";

export default function ChartsPage() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <TimePeriodSelector />
      </Paper>
      <Grid container spacing={3} columns={12}>
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
              What's my cash flow?
            </Typography>
            <CashFlow />
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
              Where's my money going?
            </Typography>
            <ExpensesByType />
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Typography variant="h3" gutterBottom sx={{ fontWeight: 600, mb: 2, color: "text.primary" }}>
              How do my costs break down by category? Click on a category to inspect
            </Typography>
            <ExpensesByArea />
          </Paper>
        </Grid>
        <Grid size={12}>
          <Paper elevation={2} sx={{ p: 2, height: "100%" }}>
            <Sankey />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
