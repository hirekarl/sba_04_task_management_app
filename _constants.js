// &nbsp;
const NBSP = "\xa0"

const taskStatus = Object.freeze({
  OVERDUE: {
    value: "overdue",
    badgeText: "OVERDUE",
    bsColor: "danger",
    sortRank: 1,
  },
  IN_PROGRESS: {
    value: "in-progress",
    badgeText: "IN PROGRESS",
    bsColor: "warning",
    sortRank: 2,
  },
  NOT_STARTED: {
    value: "not-started",
    badgeText: "NOT STARTED",
    bsColor: "info",
    sortRank: 3,
  },
  COMPLETED: {
    value: "completed",
    badgeText: "COMPLETED",
    bsColor: "success",
    sortRank: 4,
  },
})

const taskCategory = Object.freeze({
  HOUSEHOLD: {
    value: "household",
    badgeText: "HOUSEHOLD",
    bsColor: "primary",
    sortRank: 1,
  },
  WORK: {
    value: "work",
    badgeText: "WORK",
    bsColor: "secondary",
    sortRank: 2,
  },
  HOBBY: {
    value: "hobby",
    badgeText: "HOBBY",
    bsColor: "dark",
    sortRank: 3,
  },
  ENTERTAINMENT: {
    value: "entertainment",
    badgeText: "ENTERTAINMENT",
    bsColor: "light",
    sortRank: 4,
  },
})

export { taskStatus, taskCategory, NBSP }
