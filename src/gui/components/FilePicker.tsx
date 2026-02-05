import { useDropzone } from "react-dropzone";
import importTransactions, { parseCsv } from "../../import/importTransactions";
import { useContext, useState } from "react";
import { TransactionsContext } from "./TransactionsContext";
import { classifyTransactions } from "../../classifier/classifyTransactions";
import {
  Box,
  Paper,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  Alert,
  Stack,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import DatasetIcon from "@mui/icons-material/Dataset";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import CategoryIcon from "@mui/icons-material/Category";
import SecurityIcon from "@mui/icons-material/Security";
import { Transaction } from "../../common/types";

export const FilePicker = () => {
  const { setTransactions, setTimePeriod } = useContext(TransactionsContext);
  const [isLoading, setIsLoading] = useState(false);

  const { acceptedFiles, fileRejections, getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "text/csv": [],
    },
    onDrop: (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        setIsLoading(true);
        importTransactions(acceptedFiles[0])
          .then((transactions) => {
            processTransactions(transactions);
            window.scrollTo({ top: 0, behavior: "instant" });
          })
          .catch((error) => {
            console.error("Error importing transactions:", error);
            setIsLoading(false);
          });
      }
    },
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
  };

  const loadSampleData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/sampleData.csv");
      if (!response.ok) {
        throw new Error("Failed to fetch sample data");
      }
      const text = await response.text();
      const transactions = parseCsv(text);
      classifyTransactions(transactions);
      const minTimestamp = Math.min(...transactions.map((t) => t.date.getTime()));
      const maxTimestamp = Math.max(...transactions.map((t) => t.date.getTime()));
      setTimePeriod({
        startDate: minTimestamp,
        endDate: maxTimestamp,
      });
      setTransactions(transactions);
      window.scrollTo({ top: 0, behavior: "instant" });
      setIsLoading(false);
    } catch (error) {
      console.error("Error loading sample data:", error);
      setIsLoading(false);
    }
  };

  const processTransactions = (transactions: Transaction[]) => {
    classifyTransactions(transactions);
    const minTimestamp = Math.min(...transactions.map((t) => t.date.getTime()));
    const maxTimestamp = Math.max(...transactions.map((t) => t.date.getTime()));
    setTimePeriod({
      startDate: minTimestamp,
      endDate: maxTimestamp,
    });
    setTransactions(transactions);
    setIsLoading(false);
  };

  return (
    <Box sx={{ py: 6 }}>
      {/* Hero Section */}
      <Box sx={{ textAlign: "center", mb: 8 }}>
        <Typography
          variant="h2"
          sx={{
            fontWeight: 700,
            mb: 2,
            background: "linear-gradient(135deg, #818cf8 0%, #a78bfa 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          YouTrack: Track Expenses, Your Way
        </Typography>
        <Typography variant="h5" color="text.secondary" sx={{ mb: 4, maxWidth: 700, mx: "auto" }}>
          Expense tracking with categorization — all running on your machine
        </Typography>
      </Box>

      {/* Feature Cards */}
      <Grid container spacing={4} sx={{ mb: 6 }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
              border: "1px solid rgba(129, 140, 248, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <AnalyticsIcon sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Track Across Areas
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Monitor your spending across different categories like housing, food, transportation, health, and more.
                Get insights into where your money goes.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
              border: "1px solid rgba(129, 140, 248, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <CategoryIcon sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Smart Categorization
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Quickly categorize transactions with intelligent rules. Import and export your categorization rules to
                share or backup your setup.
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card
            sx={{
              height: "100%",
              background: "linear-gradient(135deg, rgba(129, 140, 248, 0.1) 0%, rgba(167, 139, 250, 0.1) 100%)",
              border: "1px solid rgba(129, 140, 248, 0.2)",
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "translateY(-4px)",
                boxShadow: 6,
                borderColor: "primary.main",
              },
            }}
          >
            <CardContent sx={{ p: 4, textAlign: "center" }}>
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  bgcolor: "primary.main",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 3,
                }}
              >
                <SecurityIcon sx={{ fontSize: 32, color: "white" }} />
              </Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                100% Private
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Everything runs on your machine. Your financial data never leaves your computer—no cloud, no servers,
                complete privacy.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Upload Section */}
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Grid container spacing={4}>
          {/* Upload CSV - Larger */}
          <Grid size={{ xs: 12, md: 8 }}>
            <Paper
              {...getRootProps()}
              elevation={isDragActive ? 8 : 3}
              sx={{
                p: 6,
                textAlign: "center",
                cursor: "pointer",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                border: isDragActive ? "3px dashed" : "2px dashed",
                borderColor: isDragActive ? "primary.main" : "divider",
                bgcolor: isDragActive ? "rgba(129, 140, 248, 0.1)" : "background.paper",
                transition: "all 0.3s ease",
                "&:hover": {
                  borderColor: "primary.main",
                  bgcolor: "rgba(129, 140, 248, 0.05)",
                  transform: "translateY(-2px)",
                  boxShadow: 6,
                },
              }}
            >
              <input {...getInputProps()} />
              {isLoading ? (
                <Stack spacing={2} alignItems="center">
                  <CircularProgress size={48} sx={{ color: "primary.main" }} />
                  <Typography variant="body1" color="text.secondary">
                    Processing file...
                  </Typography>
                </Stack>
              ) : (
                <>
                  <FileUploadIcon sx={{ fontSize: 72, color: "primary.main", mb: 3 }} />
                  <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                    {isDragActive ? "Drop your CSV file here" : "Upload Your CSV File"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    Upload your transaction CSV file to begin tracking and categorizing your expenses
                  </Typography>
                  <Button variant="contained" size="large" sx={{ px: 4, py: 1.5 }}>
                    Select CSV File
                  </Button>
                </>
              )}
            </Paper>
          </Grid>
          {/* Sample Data - Smaller */}
          <Grid size={{ xs: 12, md: 4 }}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
                border: "1px solid rgba(129, 140, 248, 0.2)",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                  borderColor: "primary.main",
                },
              }}
            >
              <DatasetIcon sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "text.primary" }}>
                Try Sample Data
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Explore the dashboard with sample data
              </Typography>
              <Button
                variant="outlined"
                size="large"
                onClick={loadSampleData}
                disabled={isLoading}
                startIcon={<DatasetIcon />}
              >
                Load Sample Data
              </Button>
            </Paper>
          </Grid>
        </Grid>

        {/* File Status */}
        {(acceptedFiles.length > 0 || fileRejections.length > 0) && (
          <Stack spacing={2} sx={{ mt: 4 }}>
            {acceptedFiles.length > 0 && (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon color="success" />
                  Accepted Files
                </Typography>
                <List>
                  {acceptedFiles.map((file) => (
                    <ListItem key={file.path} sx={{ px: 0 }}>
                      <ListItemText primary={file.path} secondary={formatFileSize(file.size)} />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}

            {fileRejections.length > 0 && (
              <Paper elevation={2} sx={{ p: 2 }}>
                <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <ErrorIcon color="error" />
                  Rejected Files
                </Typography>
                <List>
                  {fileRejections.map(({ file, errors }) => (
                    <ListItem key={file.path} sx={{ px: 0 }}>
                      <ListItemText
                        primary={file.path}
                        secondary={
                          <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                              {formatFileSize(file.size)}
                            </Typography>
                            {errors.map((e) => (
                              <Alert key={e.code} severity="error" sx={{ mt: 1 }}>
                                {e.message}
                              </Alert>
                            ))}
                          </Box>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            )}
          </Stack>
        )}
      </Box>
    </Box>
  );
};
