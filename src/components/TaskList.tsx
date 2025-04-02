import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { List, IconButton, Card, Typography, Box, Chip } from "@mui/material";
import { Edit, Delete, EventNote, AccessTime } from "@mui/icons-material";
import { TaskModel, taskStore } from "../stores/taskStore";
import TaskForm from "./TaskForm";
import AlertTask from "./AlertTask";
import SnackBar from "./SnackBar";
import { Instance } from "mobx-state-tree";

type TaskType = Instance<typeof TaskModel>


const TaskList: React.FC = observer(() => {
  const [editTask, setEditTask] = useState<TaskType | null>(null);
  const [dialog, setDialog] = useState({ open: false, taskId: "" });
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const openDeleteDialog = (id: string) =>
    setDialog({ open: true, taskId: id });
  const closeDeleteDialog = () => setDialog({ open: false, taskId: "" });

  // as business logic could be in another file
  const confirmDelete = () => {
    if (dialog.taskId) {
      taskStore.deleteTask(dialog.taskId);
      setSnackbar({ open: true, message: "Task successfully deleted!" });
    }
    closeDeleteDialog();
  };

  return (
    <Box sx={{ marginTop: 1 }}>
      <List
        sx={{
          width: "100%",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
          gap: 3,
        }}
      >
        {taskStore.filteredTasks.map((task) => (
          <Card
            key={task.id}
            sx={{
              padding: "0 10px 0 10px",
              background: "rgba(20, 20, 50, 0.4)",
              border: "1px solid rgba(50, 20, 100, 1)",
              borderRadius: "12px",
              boxShadow: "12px 11px 21px 0px rgba(29, 34, 37, 0.48)",
              transition:
                "transform 0.4s cubic-bezier(.25,.46,.45,.94), box-shadow 0.4s cubic-bezier(.25,.46,.45,.94)",
              "&:hover": {
                transform: "scale(1.02)",
                boxShadow: "0px 4px 20px rgba(0,0,0,0.35)",
              },
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "20px 10px 5px 10px",
                }}
              >
                <Typography
                  variant="h6"
                  color="#e1e0e0"
                  onClick={() => taskStore.toggleTaskStatus(task.id)}
                  sx={{
                    cursor: "pointer",
                    textDecoration:
                      task.status === "Completed" ? "line-through" : "none",
                    color: task.status === "Completed" ? "#a9a9a9" : "#e1e0e0",
                  }}
                >
                  {task.title}
                </Typography>
                <Box
                  sx={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <Chip
                    onClick={() => taskStore.toggleTaskStatus(task.id)}
                    sx={{
                      cursor: "pointer",
                      textDecoration:
                        task.status === "Completed" ? "line-through" : "none",
                      color:
                        task.status === "Completed" ? "#dddddd" : "#f1f1f1",
                      bgcolor:
                        task.status === "Completed" ? "#3baa40" : "#d58202",
                    }}
                    label={task.status === "Pending" ? "Pending" : "Completed"}
                  />
                </Box>
              </Box>

              <Typography
                variant="body2"
                sx={{
                  textDecoration:
                    task.status === "Completed" ? "line-through" : "none",
                  color: task.status === "Completed" ? "#979797" : "#b9b9b9",
                  flexGrow: 1,
                  overflow: "hidden",
                  padding: "10px 10px 5px 10px",
                }}
              >
                {task.description}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 10px 20px 10px",
                }}
              >
                <Box marginTop="12px">
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#b9b9b9",
                      fontSize: 12,
                    }}
                  >
                    <EventNote sx={{ fontSize: "14px" }} />
                    Due: {taskStore.formatDate(task.due_date ?? null)}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: "5px",
                      color: "#b9b9b9",
                      fontSize: 12,
                      marginTop: "1px",
                    }}
                  >
                    <AccessTime sx={{ fontSize: "14px" }} />
                    Created: {taskStore.formatDate(task.due_date ?? null)}
                  </Typography>
                </Box>
                <Box>
                  <IconButton
                    sx={{ paddingRight: 1 }}
                    onClick={() => setEditTask(task)}
                  >
                    <Edit sx={{ color: "#b3b3b3" }} />
                  </IconButton>
                  <IconButton onClick={() => openDeleteDialog(task.id)}>
                    <Delete sx={{ color: "#e57373" }} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Card>
        ))}
      </List>
      <AlertTask
        open={dialog.open}
        onClose={closeDeleteDialog}
        onConfirm={confirmDelete}
        itemType="Task"
      />
      <SnackBar
        snackbarOpen={snackbar.open}
        setSnackbarOpen={(open) => setSnackbar((prev) => ({ ...prev, open }))}
        message={snackbar.message}
      />

      {editTask && (
        <TaskForm
          open={Boolean(editTask)}
          onClose={() => setEditTask(null)}
          task={editTask}
          onTaskAction={(message) =>
            setSnackbar({ open: true, message: message })
          }
        />
      )}
    </Box>
  );
});

export default TaskList;
