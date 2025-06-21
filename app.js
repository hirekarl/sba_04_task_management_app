document.addEventListener("DOMContentLoaded", function () {
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

  const taskList = {
    items: [],
    domElement: document.getElementById("task-list"),
    addTask: function (task) {
      this.items.push(task)
    },
    removeTask: function (task) {
      this.items.splice(this.items.indexOf(task), 1)
    },
    sort: function () {
      // TODO
    },
    display: function () {
      this.domElement.innerHTML = ""
      for (let task of this.items) {
        const taskListItem = task.createHTML()
        this.domElement.appendChild(taskListItem)
      }
    },
  }

  function todayDateString() {
    // YYYY-MM-DD
    return new Date().toISOString().slice(0, 10)
  }

  // &nbsp;
  const nbsp = "\xa0"

  class Task {
    static nextId = 0

    constructor(name, category, deadline, status) {
      function initSetCategory(category) {
        switch (category) {
          case taskCategory.HOUSEHOLD.value:
            category = taskCategory.HOUSEHOLD
            break
          case taskCategory.WORK.value:
            category = taskCategory.WORK
            break
          case taskCategory.HOBBY.value:
            category = taskCategory.HOBBY
            break
          case taskCategory.ENTERTAINMENT.value:
            category = taskCategory.ENTERTAINMENT
            break
          default:
            category = null
            break
        }
        return category
      }

      function initSetStatus(status) {
        switch (status) {
          case taskStatus.OVERDUE.value:
            status = taskStatus.OVERDUE
            break
          case taskStatus.IN_PROGRESS.value:
            status = taskStatus.IN_PROGRESS
            break
          case taskStatus.NOT_STARTED.value:
            status = taskStatus.NOT_STARTED
            break
          case taskStatus.COMPLETED.value:
            status = taskStatus.COMPLETED
            break
          default:
            status = null
            break
        }
        return status
      }

      this.id = Task.nextId++
      this.htmlId = `task${this.id}`
      this.name = name
      this.category = initSetCategory(category)
      this.deadline = deadline // YYYY-MM-DD
      this.status = initSetStatus(status)
    }

    setStatus(newStatus) {
      this.status = newStatus
    }

    isCompleted() {
      return this.status === taskStatus.COMPLETED
    }

    deadlineDateString() {
      const deadline = new Date(this.deadline)
      // MM/DD/YYYY
      return `Due${nbsp}${deadline.toLocaleDateString("en-US")}`
    }

    setOverdueIfOverdue() {
      if (!this.isCompleted()) {
        if (todayDateString() > this.deadline) {
          this.setStatus(taskStatus.OVERDUE)
        }
      }
    }

    createHTML() {
      this.setOverdueIfOverdue()

      const taskListItem = document.createElement("li")
      taskListItem.setAttribute("id", this.htmlId)
      taskListItem.classList.add(
        "list-group-item",
        "d-flex",
        "justify-content-between",
        "align-items-start"
      )

      const div = document.createElement("div")
      div.classList.add("me-auto")
      taskListItem.appendChild(div)

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.classList.add("form-check-input")
      checkbox.setAttribute("id", `${this.htmlId}-checkbox`)
      checkbox.setAttribute("aria-label", "Mark completed.")
      checkbox.addEventListener("change", (event) => {
        if (event.target.checked) {
          this.setStatus(taskStatus.COMPLETED)
          taskList.display()
        } else {
          this.setStatus(taskStatus.IN_PROGRESS)
          this.setOverdueIfOverdue()
          taskList.display()
        }
      })
      checkbox.checked = this.isCompleted() ? true : false
      div.appendChild(checkbox)

      const checkboxLabel = document.createElement("label")
      checkboxLabel.setAttribute("for", `${this.htmlId}-checkbox`)
      checkboxLabel.classList.add("form-check-label", "fw-bold", "mx-2")
      if (this.status === taskStatus.OVERDUE) {
        checkboxLabel.classList.add("text-danger")
      }
      checkboxLabel.innerHTML = this.isCompleted()
        ? `<del>${this.name}</del>`
        : this.name
      div.appendChild(checkboxLabel)

      const dueDate = document.createElement("em")
      dueDate.textContent = this.deadlineDateString()
      if (this.status === taskStatus.OVERDUE) {
        dueDate.classList.add("text-danger")
      }
      div.appendChild(dueDate)

      const categoryBadge = document.createElement("button")
      categoryBadge.type = "button"
      categoryBadge.setAttribute("id", `${this.htmlId}-category-badge`)
      categoryBadge.classList.add(
        "btn",
        "badge",
        `text-bg-${this.category.bsColor}`,
        "rounded-pill",
        "ms-2"
      )
      categoryBadge.textContent = this.category.badgeText
      taskListItem.appendChild(categoryBadge)

      const statusBadge = document.createElement("button")
      statusBadge.type = "button"
      statusBadge.setAttribute("id", `${this.htmlId}-status-badge`)
      statusBadge.classList.add(
        "btn",
        "badge",
        `text-bg-${this.status.bsColor}`,
        "rounded-pill",
        "ms-2"
      )
      statusBadge.textContent = this.status.badgeText
      statusBadge.addEventListener("click", (event) => {
        event.preventDefault()
        if (this.status === taskStatus.IN_PROGRESS) {
          this.setStatus(taskStatus.NOT_STARTED)
          taskList.display()
        } else if (this.status === taskStatus.NOT_STARTED) {
          this.setStatus(taskStatus.IN_PROGRESS)
          taskList.display()
        }
      })
      taskListItem.appendChild(statusBadge)

      const deleteButton = document.createElement("button")
      deleteButton.type = "button"
      deleteButton.classList.add("ms-3", "btn-close")
      deleteButton.setAttribute("aria-label", "Delete.")
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault()
        taskList.removeTask(this)
        taskList.display()
      })
      taskListItem.appendChild(deleteButton)

      if (this.isCompleted()) {
        taskListItem.classList.add("opacity-50")
      }

      return taskListItem
    }
  }

  const taskInputForm = document.getElementById("task-input-form")
  taskInputForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const taskInputFormData = new FormData(event.target)

    const taskName = taskInputFormData.get("name")
    const taskCategory = taskInputFormData.get("category")
    const taskDeadline = taskInputFormData.get("deadline")
    const taskStatus = taskInputFormData.get("status")

    const newTask = new Task(taskName, taskCategory, taskDeadline, taskStatus)

    taskList.addTask(newTask)
    taskList.display()
    event.target.reset()
  })

  const taskFilterForm = document.getElementById("task-filter-form")
  taskFilterForm.addEventListener("submit", function(event) {
    event.preventDefault()
    // TODO
  })
  taskFilterForm.addEventListener("reset", function(event) {
    event.preventDefault()
    // TODO
  })
})
