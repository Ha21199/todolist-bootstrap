// Retrieve list of tasks from localStorage or initialize an empty array if it doesn't exist
const tasksLocal = JSON.parse(localStorage.getItem("tasksLocal")) || {
  listTask: [],
  taskQuantity: 0,
};
const itemPerPage = 7;
const defaultPage = 0;
const taskContainerElm = document.getElementById("taskList");
const addBtn = document.getElementById("addBtn");
const inputTask = document.getElementById("inputTask");
const paginationElement = document.querySelector(".pagination");

// Function to create a task element
const createTaskElement = (task) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");

  const taskDetailElem = document.createElement("span");
  taskDetailElem.classList.add("block");
  taskDetailElem.innerText = task.taskDetail;

  const groupBtn = document.createElement("div");
  groupBtn.classList.add("group-button", "d-flex");

  const removeBtn = document.createElement("button");
  removeBtn.classList.add("btn", "btn-danger");
  removeBtn.setAttribute("type", "button");
  removeBtn.innerText = "Xóa";
  removeBtn.addEventListener("click", () => {
    const indexRemoveItem = tasksLocal.listTask.findIndex(val => val.taskId === task.taskId);
    if (indexRemoveItem !== -1) {
      tasksLocal.listTask.splice(indexRemoveItem, 1);
      tasksLocal.taskQuantity = tasksLocal.listTask.length;
      localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));
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
  saveBtn.setAttribute("type", "button");
  saveBtn.innerText = "Save";

  const cancelBtn = document.createElement("button");
  cancelBtn.classList.add("btn", "btn-secondary", "d-none");
  cancelBtn.setAttribute("type", "button");
  cancelBtn.innerText = "Cancel";

  editBtn.addEventListener("click", () => {
    toggleEditMode(true, { editBtn, removeBtn, taskDetailElem, inputEdit, saveBtn, cancelBtn });
  });
  cancelBtn.addEventListener("click", () => {
    toggleEditMode(false, { editBtn, removeBtn, taskDetailElem, inputEdit, saveBtn, cancelBtn });
  });
  saveBtn.addEventListener("click", () => {
    const taskDetail = inputEdit.value.trim();
    if (taskDetail) {
      const indexChangeItem = tasksLocal.listTask.findIndex(val => val.taskId === task.taskId);
      if (indexChangeItem !== -1) {
        tasksLocal.listTask[indexChangeItem].taskDetail = taskDetail;
        localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));
        renderTasks();
      } else {
        console.log(`Task with ID ${task.taskId} not found.`);
      }
    } else {
      console.log("Task detail is empty. Task not added.");
    }
    toggleEditMode(false, { editBtn, removeBtn, taskDetailElem, inputEdit, saveBtn, cancelBtn });
  });

  groupBtn.append(editBtn, removeBtn, saveBtn, cancelBtn);
  taskElement.append(taskDetailElem, inputEdit, groupBtn);
  return taskElement;
};

const toggleEditMode = (isEditMode, elements) => {
  const { editBtn, removeBtn, taskDetailElem, inputEdit, saveBtn, cancelBtn } = elements;
  editBtn.classList.toggle("d-none", isEditMode);
  removeBtn.classList.toggle("d-none", isEditMode);
  taskDetailElem.classList.toggle("d-none", isEditMode);
  inputEdit.classList.toggle("d-none", !isEditMode);
  saveBtn.classList.toggle("d-none", !isEditMode);
  cancelBtn.classList.toggle("d-none", !isEditMode);
};

const getTotalPage = (quantity) => Math.ceil(quantity / itemPerPage);

// Function to render tasks
const renderTasks = (page = defaultPage) => {
  taskContainerElm.innerHTML = "";
  const fromItem = page * itemPerPage;
  const toItem = page * itemPerPage + itemPerPage;
  tasksLocal.listTask.slice(fromItem, toItem).forEach(task => {
    const taskElement = createTaskElement(task);
    taskContainerElm.append(taskElement);
  });
  renderPagination();
};

const renderPagination = () => {
  paginationElement.innerHTML = "";
  const totalPage = getTotalPage(tasksLocal.taskQuantity);
  for (let i = 0; i < totalPage; i++) {
    const pageItem = document.createElement("li");
    pageItem.classList.add("page-item");
    const pageLink = document.createElement("button");
    pageLink.classList.add("page-link");
    pageLink.innerText = i + 1;
    pageItem.append(pageLink);
    pageItem.addEventListener("click", () => renderTasks(i));
    paginationElement.append(pageItem);
  }
};

// Load tasks on page load
window.onload = () => {
  renderTasks();
};

// Function to add a new task
const addTask = () => {
  const taskDetail = inputTask.value.trim();
  if (taskDetail) {
    const newTask = {
      taskId: tasksLocal.listTask.length + 1,
      taskDetail: taskDetail,
    };
    tasksLocal.listTask.push(newTask);
    tasksLocal.taskQuantity = tasksLocal.listTask.length;
    localStorage.setItem("tasksLocal", JSON.stringify(tasksLocal));
    inputTask.value = "";
    renderTasks();
  } else {
    console.log("Task detail is empty. Task not added.");
  }
};

// Add task event listener
addBtn.addEventListener("click", addTask);
