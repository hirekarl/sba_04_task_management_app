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
    this.id = Task.nextId++
    this.htmlId = `task${this.id}`
    this.name = name
    this.category = category
    this.deadline = deadline
    this.status = status
  }
}

