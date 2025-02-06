import { makeAutoObservable } from "mobx";
import { Task } from "../types/Task";

class TaskStore {
  tasks: Task[] = [];
  searchQuery: string = "";
  statusFilter: "All" | "Pending" | "Completed" = "All";

  constructor() {
    makeAutoObservable(this);
    this.loadFromLocalStorage();
  }

  saveToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      this.tasks = Array.isArray(storedTasks) ? storedTasks : [];
    } catch {
      this.tasks = [];
    }
  }
  
  private getFormattedDate(): string {
    return new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  }
  
  addTask(task: Task) {
    this.tasks.push({ ...task, createdAt: this.getFormattedDate(), status: "Pending" });
    this.saveToLocalStorage();
  }

  updateTask(updatedTask: Task) {
    this.tasks = this.tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
    this.saveToLocalStorage();
  }

  deleteTask(id: string) {
    this.tasks = this.tasks.filter(task => task.id !== id);
    this.saveToLocalStorage();
  }

  toggleTaskStatus(id: string) {
    const task = this.tasks.find(task => task.id === id);
    if (task) {
      task.status = task.status === "Pending" ? "Completed" : "Pending";
      this.saveToLocalStorage();
    }
  }

  setSearchQuery(query: string) {
    this.searchQuery = query;
  }

  setStatusFilter(status: "All" | "Pending" | "Completed") {
    this.statusFilter = status;
  }

  get filteredTasks() {
    return this.tasks.filter(task =>
      (task.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(this.searchQuery.toLowerCase())) &&
      (this.statusFilter === "All" || task.status === this.statusFilter)
    );
  }
}

export const taskStore = new TaskStore();
