import { Alert, Snackbar } from "@mui/material";
import React from "react";

interface SnackBarProps {
  snackbarOpen: boolean;
  setSnackbarOpen: (open: boolean) => void;
  message: string;
}

const SnackBar: React.FC<SnackBarProps> = ({
  snackbarOpen,
  setSnackbarOpen,
  message,
}) => {
  return (
    <>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{
            bgcolor: "rgba(57, 146, 61, 0.45)",
            border: "1px solid rgba(55, 161, 61, 0.64)",
            color: "rgba(90, 223, 97, 0.76)",
          }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default SnackBar;
