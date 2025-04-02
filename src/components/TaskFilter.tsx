import React, { useState } from "react";
import { observer } from "mobx-react-lite";
import { TextField, Box } from "@mui/material";
import { taskStore } from "../stores/taskStore";

const TaskFilter: React.FC = observer(() => {
  const [search, setSearch] = useState("");

  //change search to page params
  const onSearchTask = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);
    taskStore.setSearchQuery(event.target.value);
  };

  return (
    <Box display="flex" gap={3} mb={3}>
      <TextField
        label="Search"
        variant="standard"
        fullWidth
        value={search}
        onChange={onSearchTask}
        color="secondary"
        sx={{
          input: { color: "white" }, // Цвет введенного текста
          label: { color: "rgba(255, 255, 255, 0.3)" }, // Цвет лейбла (надписи "Search")
          "& label.Mui-focused": { color: "white" }, // Цвет лейбла при фокусе
          "& .MuiInput-underline:before": {
            borderBottomColor: "rgba(255, 255, 255, 0.4)",
          }, // Цвет линии до фокуса
          "& .MuiInput-underline:hover:before": {
            borderBottomColor: "white !important",
          }, // Цвет линии при наведении
          "& .MuiInput-underline:after": { borderBottomColor: "primary" }, // Цвет линии при фокусе
        }}
      />
    </Box>
  );
});

export default TaskFilter;
