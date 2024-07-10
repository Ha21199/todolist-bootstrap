// Retrieve list of tasks from localStorage or initialize an empty array if it doesn't exist
const tasksLocal = JSON.parse(localStorage.getItem("tasksLocal")) || {
  listTask: [],
  taskQuantity: 0,
};
console.log("listTask", tasksLocal);

const taskContainerElm = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const inputTask = document.getElementById("inputTask");

// Function to create a task element
const createTaskElement = (task) => {
  const taskElement = document.createElement("div");
  const taskItemCls = [
    "list-group-item",
    "d-flex",
    "justify-content-between",
    "align-items-center",
  ];
  taskElement.classList.add(...taskItemCls);

  const taskDetailElem = document.createElement("span");
  taskDetailElem.classList.add("block");
  taskDetailElem.innerText = task.taskDetail;

  const groupBtn = document.createElement("div");
  groupBtn.classList.add("group-button", "d-flex");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("btn", "btn-danger");
  removeBtn.setAttribute("type", "button");
  removeBtn.innerText = "Xóa";
  removeBtn.addEventListener("click", (ev) => {
    console.log(task.taskId);
    const indexRemoveItem = tasksLocal.listTask.findIndex(
      (val) => val.taskId === task.taskId
    );

    if (indexRemoveItem !== -1) {
      tasksLocal.listTask.splice(indexRemoveItem, 1);
      tasksLocal.taskQuantity = tasksLocal.listTask.length;
      console.log(tasksLocal.listTask);
      // Save to localStorage
      localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));
      // Re-render tasks
      renderTasks();
    } else {
      console.log(`Task with ID ${task.taskId} not found.`);
    }
  });

  const editBtn = document.createElement("button");
  editBtn.classList.add("btn", "btn-success");
  editBtn.setAttribute("type", "button");
  editBtn.innerText = "Sửa";

  const inputEdit = document.createElement("input");
  inputEdit.classList.add("form-control", "d-none");
  inputEdit.setAttribute("type", "text");
  inputEdit.setAttribute("aria-describedby", "helpId");
  inputEdit.setAttribute("placeholder", "edit task");

  const saveBtn = document.createElement("button");
  saveBtn.classList.add("btn", "btn-primary", "d-none");
  saveBtn.setAttribute("type", "text");
  saveBtn.innerText = "Save";

  const cancelBTN = document.createElement("button");
  cancelBTN.classList.add("btn", "btn-secondary", "d-none");
  cancelBTN.setAttribute("type", "text");
  cancelBTN.innerText = "Cancel";

  editBtn.addEventListener("click", () => {
    editBtn.classList.add("d-none");
    removeBtn.classList.add("d-none");
    taskDetailElem.classList.add("d-none");
    saveBtn.classList.remove("d-none");
    cancelBTN.classList.remove("d-none");
    inputEdit.classList.remove("d-none");
  });
  cancelBTN.addEventListener("click", () => {
    editBtn.classList.remove("d-none");
    removeBtn.classList.remove("d-none");
    taskDetailElem.classList.remove("d-none");
    saveBtn.classList.add("d-none");
    cancelBTN.classList.add("d-none");
    inputEdit.classList.add("d-none");
  });
  saveBtn.addEventListener("click", () => {
    const taskDetail = inputEdit.value.trim();

    if (taskDetail === "") {
      console.log("Task detail is empty. Task not added.");
      return;
    }

    const indexChangeItem = tasksLocal.listTask.findIndex(
      (val) => val.taskId === task.taskId
    );

    if (indexChangeItem !== -1) {
      tasksLocal.listTask[indexChangeItem].taskDetail = taskDetail;
      // Save to localStorage
      localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));
      // Re-render tasks
      renderTasks();
    } else {
      console.log(`Task with ID ${task.taskId} not found.`);
    }

    inputTask.value = "";
  });

  groupBtn.append(editBtn, removeBtn, saveBtn, cancelBTN);
  taskElement.append(taskDetailElem, inputEdit, groupBtn);

  return taskElement;
};

// Function to render tasks
const renderTasks = () => {
  // Clear current tasks
  taskContainerElm.innerHTML = "";

  // Re-render tasks from tasksLocal
  tasksLocal.listTask.forEach((task) => {
    const taskElement = createTaskElement(task);
    taskContainerElm.append(taskElement);
  });
};

// Load tasks on page load
window.onload = (event) => {
  console.log("page is fully loaded");
  renderTasks();
};

// Function to add a new task
const addTask = () => {
  const taskDetail = inputTask.value.trim();

  if (taskDetail !== "") {
    const newTask = {
      taskId: tasksLocal.listTask.length + 1,
      taskDetail: taskDetail,
    };

    // Add new task to the list
    tasksLocal.listTask.push(newTask);

    // Update task quantity
    tasksLocal.taskQuantity = tasksLocal.listTask.length;

    // Save to localStorage
    localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));

    // Clear input field
    inputTask.value = "";

    // Re-render tasks
    renderTasks();
    console.log(tasksLocal, "after");
  } else {
    console.log("Task detail is empty. Task not added.");
  }
};

// Add task event listener
addBtn.addEventListener("click", addTask);
