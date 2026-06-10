document.addEventListener("DOMContentLoaded", () => {

  // Get elements
  const todoInput = document.getElementById("todo-input");
  const addTaskButton = document.getElementById("add-task-btn");
  const todoList = document.getElementById("todo-list");

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  tasks.forEach((task) => renderTask(task));

  updateTaskCounter();


  // Update task counter
  function updateTaskCounter() {
    const remaining = tasks.filter(task => !task.completed).length;
    document.getElementById("task-counter").textContent =
      `${remaining} Task${remaining >= 1 ? "s" : ""} Left`;
  }


  // Add new task
  addTaskButton.addEventListener("click", () => {

    const taskText = todoInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false
    };

    tasks.push(newTask);

    saveTasks();
    renderTask(newTask);
    updateTaskCounter();

    todoInput.value = "";
  });


  // Create task element
  function renderTask(task) {

    const li = document.createElement("li");
    li.setAttribute("data-id", task.id);

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <button class="delete-btn">Delete</button>
        <button class="edit-btn">Edit</button>
      </div>
    `;

    const deleteBtn = li.querySelector(".delete-btn");
    const editBtn = li.querySelector(".edit-btn");
    const span = li.querySelector(".task-text");

    // Disable delete if completed
    deleteBtn.disabled = task.completed;


    // Toggle task complete
    li.addEventListener("click", (e) => {

      if (e.target.tagName === "BUTTON") return;

      task.completed = !task.completed;

      li.classList.toggle("completed");
      deleteBtn.disabled = task.completed;

      saveTasks();
      updateTaskCounter();
    });


    // Delete task
    deleteBtn.addEventListener("click", (e) => {

      e.stopPropagation();

      tasks = tasks.filter((t) => t.id !== task.id);

      li.remove();

      saveTasks();
      updateTaskCounter();
    });


    // Edit task
    editBtn.addEventListener("click", (e) => {

      e.stopPropagation();

      const newText = prompt("Edit Task:", span.textContent);

      if (newText !== null && newText.trim() !== "") {

        span.textContent = newText;
        task.text = newText;

        saveTasks();
      }

    });

    todoList.appendChild(li);
  }


  // Add task with Enter key
  todoInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      addTaskButton.click();
    }
  });


  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }


  // Show all tasks
  document.getElementById("all").addEventListener("click", () => {
    document.querySelectorAll("#todo-list li").forEach((li) => {
      li.style.display = "flex";
    });
  });


  // Show completed tasks
  document.getElementById("completed").addEventListener("click", () => {
    document.querySelectorAll("#todo-list li").forEach((li) => {
      li.style.display =
        li.classList.contains("completed") ? "flex" : "none";
    });
  });


  // Show pending tasks
  document.getElementById("pending").addEventListener("click", () => {
    document.querySelectorAll("#todo-list li").forEach((li) => {
      li.style.display =
        !li.classList.contains("completed") ? "flex" : "none";
    });
  });

});