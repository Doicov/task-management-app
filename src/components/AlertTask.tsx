import React from "react";
import { Dialog, DialogTitle, DialogActions, Button } from "@mui/material";

interface AlertTaskProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const AlertTask: React.FC<AlertTaskProps> = ({ open, onClose, onConfirm }) => {

  return (
    <Dialog open={open} onClose={onClose} aria-describedby="alert-dialog-slide-description" sx={{ "& .MuiDialog-paper": { backgroundColor: "#222227", color: "#fff", borderRadius: "12px", padding: "16px"}}}>
      <DialogTitle  sx={{ fontSize: "19px", textAlign: "center" }}>Are you sure you want to delete this Task?</DialogTitle>
      <DialogActions sx={{ display: "flex", flexDirection: "column", rowGap: "12px", alignItems: 'flex-end'}}>
        <Button variant="outlined" onClick={onConfirm} color="error" sx={{width: "100%", "&:hover": {backgroundColor: "#b35e5e57",}}}>
          Delete task
        </Button>
        <Button variant="outlined" onClick={onClose} color="secondary" sx={{width: "100%", "&:hover": {backgroundColor: "#30744557",}}}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertTask;
