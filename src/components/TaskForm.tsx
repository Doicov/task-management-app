import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import {
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { TaskModel, taskStore } from "../stores/taskStore";
import { v4 as uuidv4 } from "uuid";
import { cast, Instance } from "mobx-state-tree";

type TaskType = Instance<typeof TaskModel>

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  task?: TaskType;
  onTaskAction: (message: string) => void;
}

const TaskForm: React.FC<TaskFormProps> = observer(
  ({ open, onClose, task, onTaskAction }) => {
    const getCurrentDate = () => new Date().toISOString().split("T")[0];

    const [formData, setFormData] = useState<TaskType>(
      task || {
        id: uuidv4(),
        title: "",
        description: "",
        due_date: getCurrentDate() || "",
        status: "Pending",
      }
    );

    const [error, setError] = useState<string>("");

    const handleChange = (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
      setError(""); // Очищаем ошибку при изменении
    };

    const handleSubmit = () => {
      if (!formData.title.trim()) {
        setError("Поле 'Title' обязательно для заполнения!");
        return;
      }
      if (task) {
        taskStore.updateTask(cast(formData));
        onTaskAction("Task successfully updated!");
      } else {
        taskStore.addTask(
          formData.title,
          formData.description || "",
          formData.due_date ?? ""
        );
        onTaskAction(`Task ${formData.title} successfully added!`);
      }
      onClose();
    };

    return (
      <Dialog
        open={open}
        onClose={onClose}
        sx={{
          "& .MuiDialog-paper": {
            backgroundColor: "#222227",
            color: "#fff",
            borderRadius: "12px",
            padding: "16px",
            minWidth: "585px",
            minHeight: "380px",
          },
        }}
      >
        <DialogTitle>{task ? "Edit Task" : "Add New Task"}</DialogTitle>
        <DialogContent>
          <TextField
            variant="standard"
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            margin="normal"
            error={!!error}
            helperText={error}
            sx={{
              input: { color: "white" }, // Цвет введенного текста
              label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
              "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255, 255, 255, 0.69)",
              }, // Цвет линии до фокуса
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ffffff !important",
              }, // Цвет линии при наведении
              "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
            }}
          />
          <TextField
            variant="standard"
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            multiline
            margin="normal"
            sx={{
              input: { color: "#fff" }, // Цвет введенного текста
              label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
              "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255, 255, 255, 0.69)",
              }, // Цвет линии до фокуса
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ffffff !important",
              }, // Цвет линии при наведении
              "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
              "& .MuiInputBase-input": {
                // Селектор для инпута
                color: "white", // Цвет текста
              },
            }}
          />
          <TextField
            variant="standard"
            fullWidth
            label="Due Date"
            name="due_date"
            type="date"
            value={formData.due_date}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            margin="normal"
            sx={{
              input: { color: "white" }, // Цвет введенного текста
              label: { color: "rgba(255, 255, 255, 0.49)" }, // Цвет лейбла (надписи "Search")
              "& label.Mui-focused": { color: "rgba(255, 255, 255, 0.69)" }, // Цвет лейбла при фокусе
              "& .MuiInput-underline:before": {
                borderBottomColor: "rgba(255, 255, 255, 0.69)",
              }, // Цвет линии до фокуса
              "& .MuiInput-underline:hover:before": {
                borderBottomColor: "#ffffff !important",
              }, // Цвет линии при наведении
              "& .MuiInput-underline:after": { borderBottomColor: "#4dab44" }, // Цвет линии при фокусе
            }}
          />
        </DialogContent>

        <DialogActions
          sx={{
            justifyContent: "flex-start",
            paddingLeft: "25px",
            paddingTop: "5px",
          }}
        >
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            {task ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
);

export default TaskForm;
