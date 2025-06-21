# SBA 4: Task Management App

[Karl Johnson](https://github.com/hirekarl)  
2025-RTT-30  
<date datetime="2025-06-20">2025-06-20</date>  

![Preview of Karl Johnson's submission for SBA 4.](./preview.png)

## Submission Summary


### Viewer Instructions
Go to [incredible-mousse-c22548.netlify.app](https://incredible-mousse-c22548.netlify.app/); view solution source below.

### Solution Source
Solution source code can be found at the links below:
- **HTML**: [`index.html`](./index.html)
- **JavaScript**: [`app.js`](./app.js)
- **CSS**: [`style.css`](./style.css)


### Reflection
Write a short reflection (100-200 words) included within the repository discussing:
- Challenges faced during the project.
- How you approached solving those challenges.
- What you would improve if given more time.

> 

## Assignment
### Overview
In this assessment, you will build a Task Management App that allows users to add tasks with deadlines, assign categories, and update the status of each task. This app will require you to apply a wide range of JavaScript concepts, including arrays, objects, DOM manipulation, conditionals, and local storage to persist the task data.

### Objective
You will create a dynamic task management app that lets users:
1. Add new tasks with details such as the task name, category, deadline, and status.
2. Update the status of tasks to reflect their progress (e.g., “In Progress,” “Completed,” “Overdue”).
3. Automatically update task status based on the current date (tasks past their deadline will be marked as “Overdue”).
4. Filter tasks by status or category.
5. Persist task data using local storage so tasks are saved even after refreshing the page.

### Project Requirements
#### 1. Adding New Tasks
- Create input fields for the task name, category, deadline, and an initial status (e.g., “In Progress”).
- Include an “Add Task” button that will add the task to the task list.
- Each task should be stored as an object with properties such as task name, category, deadline, and status.
- Add the task object to an array that holds all tasks.

#### 2. Displaying the Task List
- Create an HTML structure (such as an unordered list or table) to display the task list.
- For each task, display the task name, category, deadline, and status.
- Dynamically update the task list in the browser each time a new task is added or a status is updated.

#### 3. Updating Task Status
- Allow users to update the status of tasks (e.g., “In Progress,” “Completed”) via a dropdown or button.
- Automatically check each task’s deadline and mark tasks as “Overdue” if the current date has passed the deadline.
- Update the displayed task list whenever a task’s status changes.

#### 4. Filtering Tasks
- Add functionality to filter tasks by category or status (e.g., show only “Completed” tasks or tasks under the “Work” - category).
- Provide a dropdown or set of buttons for users to choose a filter.
- When a filter is selected, only display the tasks that match the selected category or status.

#### 5. Persisting Task Data with Local Storage
- Use local storage to save the current state of the task list so that tasks are restored when the page is refreshed.
- Ensure that task data (including name, category, deadline, and status) is stored and retrieved correctly.

### Project Instructions
#### 1. Create the HTML Structure
  - Input fields for task name, category, deadline, and status.
  - A button to add new tasks.
  - A dropdown or buttons to filter tasks by status or category.
  - A display area to show the list of tasks, including options to update task status.
#### 2. Write the JavaScript Code
  - Use an array to store tasks, each represented as an object.
  - Write functions to add tasks, update task status, check overdue tasks, and filter tasks.
  - Use DOM manipulation to display the task list dynamically.
  - Implement local storage to persist task data.
#### 3. Test Your Application
  - Add multiple tasks and ensure they are displayed correctly.
  - Test the “Update Status” functionality to ensure tasks can be marked as “Completed” or “Overdue.”
  - Filter tasks by status or category and ensure the correct tasks are displayed.
  - Refresh the page and ensure the tasks are restored from local storage.