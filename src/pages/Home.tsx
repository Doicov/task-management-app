import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { Container, Button, Typography, Box, Tabs, Tab } from "@mui/material";
import TaskList from "../components/TaskList";
import TaskFilter from "../components/TaskFilter";
import TaskForm from "../components/TaskForm";
import { taskStore } from "../stores/TaskStore";
import SnackBar from "../components/SnackBar";

const Home: React.FC = observer(() => {

  const [isFormOpen, setIsFormOpen] = useState(false);
  //change to react query states
  //react-hot-toast
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const onTaskActionOpen = (message: string) => setSnackbar({ open: true, message });

  return (
    <Container maxWidth='xl' >
      <Box display="flex" justifyContent="space-between" alignItems="center" mt={15} mb={3} >
        <Typography variant="h4" fontWeight="bold"   sx={{background: "linear-gradient(30deg, #2ECC71, #3498DB)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",}}>
          Task Management
        </Typography>
        <Button variant="contained" color="secondary" onClick={() => setIsFormOpen(true)}>
          + Add Task
        </Button>
      </Box>

      <TaskFilter />

      <Tabs
        value={taskStore.statusFilter}
        onChange={(_, newValue) => taskStore.setStatusFilter(newValue)}
        textColor="secondary"
        indicatorColor="secondary"
        aria-label="secondary tabs example"
        >
          
        {["All", "Completed", "Pending"].map((status) => (
          <Tab
            key={status}
            value={status}
            label={status}
            sx={{ color: taskStore.statusFilter === status ? "green" : "#e1e0e0" }}
          />
        ))}

      </Tabs>
      <TaskList />
      {isFormOpen && <TaskForm open={isFormOpen} onClose={() => setIsFormOpen(false)} onTaskAction={onTaskActionOpen}/>}
      <SnackBar snackbarOpen={snackbar.open} setSnackbarOpen={(open) => setSnackbar((prev) => ({ ...prev, open }))} message={snackbar.message} />

      </Container>
    );
  });

  export default Home;