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
  static nextId = 0

  constructor(name, category, deadline, status) {
    this.id = nextId++
    this.name = name
    this.category = category
    this.deadline = deadline
    this.status = status
  }
}