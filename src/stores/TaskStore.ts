import { types, flow, cast, Instance, toGenerator } from "mobx-state-tree";

import { client } from "../api/client";
import { GET_TASKS } from "../api/quries";
import {
  ADD_TASK,
  TOGGLE_TASK_STATUS,
  DELETE_TASK,
  UPDATE_TASK,
} from "../api/mutations";
import { format } from "date-fns";

export const TaskModel = types.model("Task", {
  id: types.identifier,
  title: types.string,
  description: types.maybeNull(types.string),
  due_date: types.maybeNull(types.string),
  status: types.enumeration(["Pending", "Completed"]),
});

// Модель хранилища
const TaskStore = types
  .model("TaskStore", {
    tasks: types.array(TaskModel),
    searchQuery: types.string,
    statusFilter: types.enumeration(["All", "Pending", "Completed"]),
    folderId: types.maybeNull(types.string),
  })
  .views((self) => ({
    get filteredTasks() {
      const search = self.searchQuery.toLowerCase();
      return self.tasks.filter(
        (task) =>
          (task.title.toLowerCase().includes(search) ||
            task.description?.toLowerCase().includes(search)) &&
          (self.statusFilter === "All" || task.status === self.statusFilter)
      );
    },
    formatDate(date: string | null) {
      return date && date.trim() ? format(new Date(date), "dd MMMM yyyy") : "No date";
    },
  }))
  .actions((self) => {
    const fetchTasks = flow(function* () {
      //Тут изменили на мите
      if (!self.folderId) return; // если folderid не задан выходим из функции 
      const result = yield* toGenerator(
        client.query(GET_TASKS, { folderId: self.folderId }).toPromise()
      );

      if (!result.data) { // если данных нет, просто выходим
        return;
      }
      const transformTasks = result.data.tasks.map((task) => ({
        ...task,
        status: task.status ? "Completed" : "Pending",
        due_date: task.due_date,
      }));
      self.tasks = cast(transformTasks); // сохраняем задачи в store
    });

    return {
      fetchTasks, // Объявляем перед вызовом

      setFolderId(folderId: string) {
        self.folderId = folderId;
        fetchTasks();
      },

      setSearchQuery(query: string) {
        self.searchQuery = query;
      },

      setStatusFilter(status: "All" | "Pending" | "Completed") {
        self.statusFilter = status;
      },

      addTask: flow(function* ( title: string, description: string, dueDate: string) {
        if (!self.folderId) return;
        try {
          const result = yield* toGenerator(client
          .mutation(ADD_TASK, { title, description, due_date: dueDate, folderId: self.folderId,})
          .toPromise());

          if (!result.data?.insert_tasks_one) return;
          self.tasks.push(
            cast({
              ...result.data.insert_tasks_one,
              status: "Pending",
            })
          );
        } catch (error) {
          console.error("Error when adding task", error);
        }
      }),

      toggleTaskStatus: flow(function* (id: string) {
        const task = self.tasks.find((t) => t.id === id);
        if (!task) return 

        try {
          const newStatus = task.status === "Pending";

          const result = yield* toGenerator(client
            .mutation(TOGGLE_TASK_STATUS, { id, status: newStatus })
            .toPromise());

          if (!result.data?.update_tasks_by_pk) return;

            task.status = newStatus ? "Completed" : "Pending";       
        } catch (error) {
          console.error("Status change error", error)
        }
      }),

      deleteTask: flow(function* (id: string) {
        try {
          const result = yield* toGenerator(client.mutation(DELETE_TASK, { id }).toPromise());
          if (!result.data?.delete_tasks_by_pk) return;

          self.tasks.replace(self.tasks.filter((task) => task.id !== id));
        } catch (error) {
          console.error("Error task deletion", error)
        }
      }),

      updateTask: flow(function* (updatedTask: Instance<typeof TaskModel>) {
        try {
          const result = yield* toGenerator(client
            .mutation(UPDATE_TASK, {
              id: updatedTask.id,
              title: updatedTask.title,
              description: updatedTask.description,
              due_date: updatedTask.due_date ?? "",
            })
            .toPromise());

          if(!result.data?.update_tasks_by_pk) return;

          self.tasks.replace(
            self.tasks.map((task) => {
              if (task.id === updatedTask.id) {
                return cast({
                  id: updatedTask.id,
                  title: updatedTask.title,
                  description: updatedTask.description,
                  due_date: updatedTask.due_date,
                  status: task.status, // Используем старый статус из store
                });
              }
              return task;
        })
          );
        } catch (error) {
          console.error("Error task updation", error)
        }
      }),
    };
  });

export const taskStore = TaskStore.create({
  tasks: [],
  searchQuery: "",
  statusFilter: "All",
  folderId: null,
});
