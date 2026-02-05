import { Box, Container } from "@mui/material";
import { FilePicker } from "./FilePicker";
import { TransactionsContext } from "./TransactionsContext";
import { useContext, useState } from "react";
import ChartsPage from "../pages/ChartsPage";
import { CategorizerPage } from "../pages/CategorizerPage";
import { SideBar } from "./SideBar";
import { Page } from "../../common/types";

export default function AppContainer() {
  const { transactions } = useContext(TransactionsContext);
  const [openPage, setOpenPage] = useState<Page>(Page.Charts);

  const getOpenPageComponent = () => {
    switch (openPage) {
      case Page.Charts:
        return <ChartsPage />;
      case Page.Categorizer:
        return <CategorizerPage />;
      default:
        return null;
    }
  };
  const hasTransactions = transactions.length > 0;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", bgcolor: "background.default" }}>
      {hasTransactions && <SideBar setOpenPage={setOpenPage} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 2,
          px: 0,
          width: "100%",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl">{hasTransactions ? getOpenPageComponent() : <FilePicker />}</Container>
      </Box>
    </Box>
  );
}
