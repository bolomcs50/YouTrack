import { Button } from "@mui/material";
import { VisuallyHiddenInput } from "./VisuallyHiddenInput";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import { useContext, useEffect } from "react";
import { classifyTransactions } from "../../classifier/classifyTransactions";
import { TransactionsContext } from "./TransactionsContext";
import { importRules } from "../../import/importExportRules";

export const ImportRulesButton = () => {
  const { transactions, setTransactions, userCategoryRules, setUserCategoryRules } = useContext(TransactionsContext);

  useEffect(() => {
    classifyTransactions(transactions, userCategoryRules);
    // Create a new array reference to trigger React re-render
    setTransactions([...transactions]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userCategoryRules]);

  const handleImportRules = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const rules = await importRules(e.target.files);
      setUserCategoryRules(rules);
    }
  };

  return (
    <Button
      variant="outlined"
      startIcon={<FileUploadIcon />}
      component="label"
      sx={{
        borderColor: "primary.main",
        color: "primary.main",
        "&:hover": {
          borderColor: "primary.dark",
        },
      }}
    >
      Import Rules
      <VisuallyHiddenInput type="file" accept=".json" onChange={(e) => handleImportRules(e)} multiple />
    </Button>
  );
};
