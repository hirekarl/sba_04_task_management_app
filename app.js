const taskStatus = Object.freeze({
  COMPLETED: {
    value: "completed",
    badgeText: "COMPLETED",
    bsColor: "success",
    sortRank: 4,
  },
  NOT_STARTED: {
    value: "not-started",
    badgeText: "NOT STARTED",
    bsColor: "info",
    sortRank: 3,
  },
  IN_PROGRESS: {
    value: "in-progress",
    badgeText: "IN PROGRESS",
    bsColor: "warning",
    sortRank: 2,
  },
  OVERDUE: {
    value: "overdue",
    badgeText: "OVERDUE",
    bsColor: "danger",
    sortRank: 1,
  },
})

const taskCategory = Object.freeze({
  ENTERTAINMENT: {
    value: "entertainment",
    badgeText: "ENTERTAINMENT",
    bsColor: "light",
    sortRank: 4
  },
  HOBBY: {
    value: "hobby",
    badgeText: "HOBBY",
    bsColor: "dark",
    sortRank: 3
  },
  WORK: {
    value: "work",
    badgeText: "WORK",
    bsColor: "secondary",
    sortRank: 2,
  },
  HOUSEHOLD: {
    value: "household",
    badgeText: "HOUSEHOLD",
    bsColor: "primary",
    sortRank: 1,
  },
})

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
