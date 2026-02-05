import { Button } from "@mui/material";
import { exportRules } from "../../import/importExportRules";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useContext } from "react";
import { TransactionsContext } from "./TransactionsContext";

export const ExportRulesButton = () => {
  const { userCategoryRules } = useContext(TransactionsContext);

  return (
    <Button
      variant="contained"
      startIcon={<FileDownloadIcon />}
      onClick={() => exportRules(userCategoryRules)}
      sx={{
        background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
        "&:hover": {
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
        },
      }}
    >
      Export Rules
    </Button>
  );
};
