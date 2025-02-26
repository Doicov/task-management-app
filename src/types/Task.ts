export interface Task {
    id: string;
    title: string;
    description?: string;
    dueDate: string;
    status: "Pending" | "Completed" ;
    createdAt: string;
  }
  