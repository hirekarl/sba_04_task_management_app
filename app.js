const taskStatus = {
  NOT_STARTED: "not-started",
  IN_PROGRESS: "in-progress",
  COMPLETED: "completed",
  OVERDUE: "overdue",
}

const taskCategory = {
  WORK: "work",
  HOUSEHOLD: "household",
  ENTERTAINMENT: "entertainment",
  HOBBY: "hobby",
}

class Task {
  constructor(name, category, deadline, status) {
    this.name = name
    this.category = category
    this.deadline = deadline
    this.status = status
  }
}