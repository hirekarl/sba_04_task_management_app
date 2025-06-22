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
      this.sort()
      this.save()
    },
    removeTask: function (task) {
      this.items.splice(this.items.indexOf(task), 1)
      this.sort()
      this.save()
    },
    sort: function () {
      this.items.sort((x, y) => {
        if (x.status.sortRank !== y.status.sortRank) {
          return x.status.sortRank - y.status.sortRank
        }
        if (x.deadline !== y.deadline) {
          const dateX = new Date(x.deadline)
          const dateY = new Date(y.deadline)
          return dateX - dateY
        }
        if (x.category.sortRank !== y.category.sortRank) {
          return x.category.sortRank - y.category.sortRank
        }
        if (x.name !== y.name) {
          return x.name.localeCompare(y.name)
        }
        return 0
      })
    },
    display: function (tempList = this.items) {
      this.sort()
      this.save()
      this.domElement.innerHTML = ""
      for (let task of tempList) {
        const taskListItem = task.createHTML()
        this.domElement.appendChild(taskListItem)
      }
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
      const tasksPropertiessOnly = this.items.map((task) =>
        task.propertiesOnly()
      )
      const tasksSerialized = JSON.stringify(tasksPropertiessOnly)
      return tasksSerialized
    },
    save: function () {
      localStorage.setItem("tasks", this.serialize())
    },
    deserialize: function () {
      const localStorageTasks = JSON.parse(localStorage.getItem("tasks"))

      if (!localStorageTasks) {
        localStorage.setItem("tasks", JSON.stringify([]))
      } else {
        for (let localStorageTask of localStorageTasks) {
          const name = localStorageTask.name
          const category = localStorageTask.category
          const deadline = localStorageTask.deadline
          const status = localStorageTask.status

          const task = new Task(name, category, deadline, status)

          // Don't use .addTask() here
          this.items.push(task)
          this.display()
        }
      }
    },
  }

  function today() {
    const todayDate = new Date()

    let year = todayDate.getFullYear()
    let month = todayDate.getMonth() + 1
    let day = todayDate.getDate()

    year = year.toString()
    month = month.toString().padStart(2, "0")
    day = day.toString().padStart(2, "0")

    return `${year}-${month}-${day}`
  }

  function displayDate(date) {
    let [year, month, day] = date.split("-")

    year = parseInt(year)
    month = parseInt(month)
    day = parseInt(day)

    return `${month}/${day}/${year}`
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
      this.deadline = deadline
      this.status = initSetStatus(status)
    }

    setStatus(newStatus) {
      this.status = newStatus
    }

    isCompleted() {
      return this.status === taskStatus.COMPLETED
    }

    setOverdueIfOverdue() {
      if (!this.isCompleted()) {
        if (today() >= this.deadline) {
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
      checkbox.classList.add("form-check-input", "me-3")
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
      checkboxLabel.innerHTML = this.isCompleted()
        ? `<del>${this.name}</del>`
        : this.name
      div.appendChild(checkboxLabel)

      const dueDate = document.createElement("em")
      dueDate.textContent = `Due${nbsp}${displayDate(this.deadline)}`
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
      deleteButton.setAttribute("aria-label", "Delete.")
      deleteButton.classList.add("ms-3", "btn-close")
      deleteButton.addEventListener("click", (event) => {
        event.preventDefault()
        taskList.removeTask(this)
        taskList.display()
      })
      taskListItem.appendChild(deleteButton)

      if (this.isCompleted() || this.status === taskStatus.OVERDUE) {
        taskListItem.classList.add("bg-black")
      }

      if (this.isCompleted()) {
        taskListItem.classList.add("opacity-50")
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

  taskList.deserialize()
  taskList.display()

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
  const categoryFilterSelect = taskFilterForm.querySelector(
    "select[name='category-filters']"
  )
  const statusFilterSelect = taskFilterForm.querySelector(
    "select[name='status-filters']"
  )

  taskFilterForm.addEventListener("submit", function (event) {
    event.preventDefault()

    const selectedCategoryFilterOptions = Array.from(
      categoryFilterSelect.selectedOptions
    )
    const categoryFilters = selectedCategoryFilterOptions.map(
      (option) => option.value
    )
    const selectedStatusFilterOptions = Array.from(
      statusFilterSelect.selectedOptions
    )
    const statusFilters = selectedStatusFilterOptions.map(
      (option) => option.value
    )

    taskList.filter(categoryFilters, statusFilters)
  })
  taskFilterForm.addEventListener("reset", function (event) {
    event.preventDefault()

    taskList.display(taskList.items)

    for (let option of categoryFilterSelect.options) {
      option.selected = false
    }
    for (let option of statusFilterSelect.options) {
      option.selected = false
    }
  })
})
