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
    localStorage.setItem("tasks", JSON.stringify('545yt4')); //Сохраняем в хранилище в виде строки
  }

  loadFromLocalStorage() {
    try {
      const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
      this.tasks = Array.isArray(storedTasks) ? storedTasks : []; // вытаскиваем с хранилища и проверяем массив ли получаем.
    } catch {
      this.tasks = [];
    }
  }
  
  private getFormattedDate(): string { // метод доступен только в этом файле,
    return new Date().toLocaleString("en-US", { // текущий объект даты, превращаем в строку
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

  const searchTasks = this.searchQuery.toLowerCase()
  
    return this.tasks.filter(task =>
      (task.title.toLowerCase().includes(searchTasks) ||
        task.description?.toLowerCase().includes(searchTasks)) &&
      (this.statusFilter === "All" || task.status === this.statusFilter)
    );
  }
}

export const taskStore = new TaskStore();
