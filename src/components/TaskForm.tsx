import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { taskStore } from "../stores/TaskStore";
import { Task } from "../types/Task";
import { v4 as uuidv4 } from "uuid";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: Task;
  onTaskAction: (message: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = observer(({ open, onClose, task, onTaskAction  }) => {
  const getCurrentDate = () => new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState<Task>(
    task || {
      id: uuidv4(),
      title: "",
      description: "",
      dueDate: getCurrentDate(),
      status: "Pending",
      createdAt: ''
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (task) {
      taskStore.updateTask(formData);
      onTaskAction("Task successfully updated!")
    } else {
      taskStore.addTask(formData);
      onTaskAction("Task successfully added!");
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ "& .MuiDialog-paper": { backgroundColor: "#222227", color: "#fff", borderRadius: "12px", padding: "16px"}}}>
      <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
      <DialogContent>

        <TextField variant="standard" fullWidth label="Title" name="title" value={formData.title} onChange={handleChange} required margin="normal" 
          sx={{
            input: { color: "white" }, // Цвет введенного текста
            label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
            "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
            "& .MuiInput-underline:before": { borderBottomColor: "rgba(255, 255, 255, 0.69)" }, // Цвет линии до фокуса
            "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffffff !important" }, // Цвет линии при наведении
            "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
          }}/>
        <TextField variant="standard" fullWidth label="Description" name="description" value={formData.description} onChange={handleChange} multiline  margin="normal" 
          sx={{
            input: { color: "#fff" }, // Цвет введенного текста
            label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
            "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
            "& .MuiInput-underline:before": { borderBottomColor: "rgba(255, 255, 255, 0.69)" }, // Цвет линии до фокуса
            "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffffff !important" }, // Цвет линии при наведении
            "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
            "& .MuiInputBase-input": {   // Селектор для инпута
              color: "white",            // Цвет текста
            },
          }}/>
        <TextField  variant="standard" fullWidth label="Due Date" name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} InputLabelProps={{ shrink: true }} margin="normal" 
          sx={{
            input: { color: "white" }, // Цвет введенного текста
            label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
            "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
            "& .MuiInput-underline:before": { borderBottomColor: "rgba(255, 255, 255, 0.69)" }, // Цвет линии до фокуса
            "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffffff !important" }, // Цвет линии при наведении
            "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
          }}/>
        <TextField variant="standard" fullWidth label="Status" name="status" value={formData.status} onChange={handleChange} margin="normal"  
          sx={{
            input: { color: "white" }, // Цвет введенного текста
            label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
            "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
            "& .MuiInput-underline:before": { borderBottomColor: "rgba(255, 255, 255, 0.69)" }, // Цвет линии до фокуса
            "& .MuiInput-underline:hover:before": { borderBottomColor: "#ffffff !important" }, // Цвет линии при наведении
            "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
          }}>
        </TextField>
      </DialogContent>

      <DialogActions sx={{justifyContent: 'flex-start', paddingLeft: '25px', paddingTop: 5}}>
        <Button onClick={handleSubmit} color="secondary" variant="contained" >
          {task ? "Update" : "Add"}
        </Button>
      </DialogActions>

    </Dialog>
  );
});

export default TaskForm;
