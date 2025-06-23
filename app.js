import { taskStatus, taskCategory, NBSP } from "./_constants.js"
import { today, displayDate } from "./_helpers.js"

const taskList = {
  items: [],
  domElement: document.getElementById("task-list"),
  addTask: function (task) {
    this.items.push(task)

    this.sort()
    this.save()
  },
  removeTask: function (task) {
    this.items.splice(this.items.indexOf(task), 1)

    this.sort()
    this.save()
  },
  sort: function () {
    this.items.sort((a, b) => {
      if (a.status.sortRank !== b.status.sortRank) {
        return a.status.sortRank - b.status.sortRank
      }
      if (a.deadline !== b.deadline) {
        const dateA = new Date(a.deadline)
        const dateB = new Date(b.deadline)
        return dateA - dateB
      }
      if (a.category.sortRank !== b.category.sortRank) {
        return a.category.sortRank - b.category.sortRank
      }
      if (a.name !== b.name) {
        return a.name.localeCompare(b.name)
      }
      return 0
    })
  },
  display: function (tempList = this.items) {
    tempList.forEach((task) => task.setOverdueIfOverdue())
    this.domElement.innerHTML = ""

    this.sort()
    this.save()

    tempList.forEach((task) => this.domElement.appendChild(task.createHTML()))
  },
  filter: function (categoryFilters, statusFilters) {
    const tempList = this.items.filter(
      (task) =>
        categoryFilters.includes(task.category.value) ||
        statusFilters.includes(task.status.value)
    )

    this.display(tempList)
  },
  serialize: function () {
    return JSON.stringify(this.items.map((task) => task.propertiesOnly()))
  },
  save: function () {
    localStorage.setItem("tasks", this.serialize())
  },
  deserialize: function () {
    const localStorageTasks = JSON.parse(localStorage.getItem("tasks"))

    const tasks = []
    if (!localStorageTasks) {
      localStorage.setItem("tasks", JSON.stringify(tasks))
    } else {
      localStorageTasks.forEach((localStorageTask) => {
        const task = new Task(
          localStorageTask.name,
          localStorageTask.category,
          localStorageTask.deadline,
          localStorageTask.status
        )

        // Don't use .addTask() here
        this.items.push(task)
      })

      this.display()
    }
  },
}

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
    this.name = name.trim()
    this.category = initSetCategory(category)
    this.deadline = deadline
    this.status = initSetStatus(status)
  }

  setStatus(newStatus) {
    this.status = newStatus
  }

  isCompleted() {
    return this.status === taskStatus.COMPLETED
  }

  isOverdue() {
    return this.status === taskStatus.OVERDUE
  }

  setOverdueIfOverdue() {
    if (!this.isCompleted()) {
      if (today() >= this.deadline) {
        this.setStatus(taskStatus.OVERDUE)
      }
    }
  }

  createHTML() {
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
    checkbox.classList.add("form-check-input", "me-3")
    checkbox.setAttribute("id", `${this.htmlId}-checkbox`)
    if (!this.isCompleted()) {
      checkbox.setAttribute(
        "aria-label",
        `Click to set "${this.name}" to "Completed".`
      )
    } else if (this.isCompleted()) {
      checkbox.setAttribute(
        "aria-label",
        `Click to set "${this.name}" to "In Progress".`
      )
    }
    checkbox.addEventListener("change", (event) => {
      if (event.target.checked) {
        this.setStatus(taskStatus.COMPLETED)

        taskList.display()
      } else {
        this.setStatus(taskStatus.IN_PROGRESS)

        taskList.display()
      }
    })
    checkbox.checked = this.isCompleted() ? true : false
    div.appendChild(checkbox)

    const checkboxLabel = document.createElement("label")
    checkboxLabel.setAttribute("for", `${this.htmlId}-checkbox`)
    checkboxLabel.classList.add("form-check-label", "fw-bold", "mx-2")
    checkboxLabel.innerHTML = this.isCompleted()
      ? `<del>${this.name}</del>`
      : this.name
    div.appendChild(checkboxLabel)

    const dueDateEm = document.createElement("em")
    dueDateEm.textContent = `Due${NBSP}`
    div.appendChild(dueDateEm)

    const dueDate = document.createElement("time")
    dueDate.setAttribute("datetime", this.deadline)
    dueDate.textContent = displayDate(this.deadline)
    dueDateEm.appendChild(dueDate)

    const categoryBadge = document.createElement("button")
    categoryBadge.type = "button"
    categoryBadge.setAttribute("id", `${this.htmlId}-category-badge`)
    categoryBadge.setAttribute("disabled", "true")
    categoryBadge.setAttribute("aria-disabled", "true")
    categoryBadge.classList.add(
      "btn",
      "badge",
      `text-bg-${this.category.bsColor}`,
      "rounded-pill",
      "ms-2"
    )
    categoryBadge.textContent = this.category.badgeText
    categoryBadge.addEventListener("click", (event) => event.preventDefault())
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
    if (this.isCompleted() || this.isOverdue()) {
      statusBadge.setAttribute("disabled", "true")
      statusBadge.setAttribute("aria-disabled", "true")
    }
    if (this.status === taskStatus.IN_PROGRESS) {
      statusBadge.setAttribute(
        "aria-label",
        `Click to set "${this.name}" to "Not Started".`
      )
    } else if (this.status === taskStatus.NOT_STARTED) {
      statusBadge.setAttribute(
        "aria-label",
        `Click to set "${this.name}" to "In Progress".`
      )
    }
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
    deleteButton.setAttribute("aria-label", `Click to delete "${this.name}".`)
    deleteButton.classList.add("ms-3", "btn-close")
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault()
      taskList.removeTask(this)
      taskList.display()
    })
    taskListItem.appendChild(deleteButton)

    if (this.isCompleted()) {
      taskListItem.classList.add("bg-black", "bg-gradient", "opacity-50")
    }
    if (this.isOverdue()) {
      taskListItem.classList.add("bg-danger", "bg-gradient", "text-dark")
    }

    return taskListItem
  }

  propertiesOnly() {
    return {
      name: this.name,
      category: this.category.value,
      deadline: this.deadline,
      status: this.status.value,
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  taskList.deserialize()
  taskList.display()

  const taskInputForm = document.getElementById("task-input-form")
  taskInputForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const taskInputFormData = new FormData(event.target)

    const name = taskInputFormData.get("name")
    const category = taskInputFormData.get("category")
    const deadline = taskInputFormData.get("deadline")
    const status = taskInputFormData.get("status")

    const newTask = new Task(name, category, deadline, status)

    taskList.addTask(newTask)
    event.target.reset()

    taskList.display()
  })

  const taskFilterForm = document.getElementById("task-filter-form")

  const categoryFilterSelect = taskFilterForm.querySelector(
    "select[name='category-filters']"
  )
  const statusFilterSelect = taskFilterForm.querySelector(
    "select[name='status-filters']"
  )

  taskFilterForm.addEventListener("submit", (event) => {
    event.preventDefault()

    const categoryFilters = Array.from(
      categoryFilterSelect.selectedOptions
    ).map((option) => option.value)

    const statusFilters = Array.from(statusFilterSelect.selectedOptions).map(
      (option) => option.value
    )

    taskList.filter(categoryFilters, statusFilters)
  })

  taskFilterForm.addEventListener("reset", (event) => {
    event.preventDefault()

    Array.from(categoryFilterSelect.options).forEach(
      (option) => (option.selected = false)
    )
    Array.from(statusFilterSelect.options).forEach(
      (option) => (option.selected = false)
    )

    taskList.display(taskList.items)
  })
})
