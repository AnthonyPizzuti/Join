const logedUser = sessionStorage.getItem("User");
let selectedPriority = "Medium";
let enableDragCounter = 0;
let selectedMembers = [];
let subtasksArray = [];
let currentTaskId = null;
let selectedCategory = "";
let isEditMode = false;
let currentDraggedTask = null;
let draggedTask = null;
let selectedType = "todo";
let tasksMap = {};
fetchTasks((tasks) => {
  tasksMap = tasks;
});

/**
 * Fetches user contacts from Firebase and executes a callback with the results.
 * @param {Function} callback - The callback function to handle the fetched contacts.
 */

function fetchUsers(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      callback(snapshot.val());
    });
}

/**
 * Fetches tasks from Firebase and executes a callback with the task data.
 * @param {Function} callback - The callback function to process the fetched tasks.
 */

function fetchTasks(callback) {
  firebase
    .database()
    .ref("/tasks/")
    .once("value")
    .then((snapshot) => {
      const tasks = snapshot.val();
      if (!tasks) {
        return;
      }
      callback(tasks);
    })
    .catch(() => {});
}

/**
 * Renders tasks onto the board by iterating over each task object.
 * @param {Object} tasks - An object containing all task details.
 */

function renderTasks(tasks) {
  for (let taskId in tasks) {
    const task = tasks[taskId];
    if (!task || typeof task !== "object" || !task.title) {
      continue;
    }
    addTaskToBoard(task);
  }
  checkAllColumnsForTasks();
  enableDragAndDrop();
}

/**
 * Fetches and renders tasks onto the board columns.
 */

function renderTasksOnBoard() {
  fetchTasks((tasks) => {
    document.querySelectorAll(".board-column").forEach((column) => {
      const columnType = column.getAttribute("data-type");
      const tasksContainer = column.querySelector(".tasks-container");
      tasksContainer.innerHTML = "";
      Object.values(tasks)
        .filter((task) => task.type === columnType)
        .forEach((task) => {
          const taskCard = createTaskCard(task);
          tasksContainer.appendChild(taskCard);
        });
      updateNoTasksMessage(column);
    });
    checkAllColumnsForTasks();
    enableDragAndDrop();
  });
}

/**
 * Loads tasks from Firebase and populates the respective board columns.
 */

function loadTasksFromFirebase() {
  const tasksRef = firebase.database().ref("tasks");
  tasksRef.once("value", (snapshot) => {
    const tasks = snapshot.val();
    Object.values(tasks).forEach((task) => {
      const column = document.querySelector(
        `.board-column[data-type="${task.type}"] .tasks-container`
      );
      if (column) {
        const taskCard = createTaskCard(task);
        column.appendChild(taskCard);
      }
    });
    enableDragAndDrop();
  });
}

/**
 * Updates the "No Tasks" message in a column based on the number of tasks present.
 * @param {HTMLElement} column - The board column to check.
 */

function updateNoTasksMessage(column) {
  const tasksContainer = column.querySelector(".tasks-container");
  const noTasksMessage = column.querySelector(".no-tasks");

  if (tasksContainer && noTasksMessage) {
    const visibleTasks = tasksContainer.querySelectorAll(".task-card");
    noTasksMessage.style.display = visibleTasks.length ? "none" : "block";
  } else {
  }
}

/**
 * Creates the HTML structure for the list of assigned users in a task.
 * @param {Object} task - The task object containing member details.
 * @returns {string} The HTML string of assigned members.
 */

function createAssignedToList(task) {
  const members = task.members || [];
  return members
    .map(
      (member) =>
        `<div class="avatar" style="background-color: ${getColorForContact(
          member
        )};">${getInitials(member)}</div>`
    )
    .join("");
}

/**
 * Opens the modal for editing a task and populates it with the current task's data.
 */

function openEditTaskModal() {
  if (currentTask) {
    isEditMode = true;
    currentTaskId = currentTask.id;
    populateEditTaskForm(currentTask);
    document.getElementById("addTaskModal").style.display = "block";
  }
}

/**
 * Collects the subtasks data from the edit modal inputs.
 * @returns {Array} An array of subtask objects with title and completion status.
 */

function collectSubtasksData() {
  const subtasks = [];
  document.querySelectorAll(".edit-subtask").forEach((subtaskElement) => {
    subtasks.push({
      title: subtaskElement.querySelector(".subtask-title").value,
      completed: subtaskElement.querySelector(".subtask-checkbox").checked,
    });
  });
  return subtasks;
}

/**
 * Updates a task's data in Firebase and refreshes it on the board.
 * @param {string} taskId - The ID of the task to update.
 * @param {Object} updatedData - The updated task data to save in Firebase.
 */

function updateTaskInFirebase(taskId, updatedData) {
  firebase
    .database()
    .ref(`/tasks/${taskId}`)
    .update(updatedData)
    .then(() => {
      tasksMap[taskId] = { ...tasksMap[taskId], ...updatedData };
      updateTaskOnBoard(taskId, tasksMap[taskId]);
    })
    .catch(() => {});
}

/**
 * Updates a task's representation on the board.
 * @param {string} taskId - The ID of the task.
 * @param {Object} taskData - The updated task data.
 */

function updateTaskOnBoard(taskId, taskData) {
  removeTaskFromBoard(taskId);
  taskData.id = taskId;
  addTaskToBoard(taskData);
  checkAllColumnsForTasks();
}

/**
 * Populates the edit task modal form with the details of the selected task.
 * @param {Object} task - The task object containing all details.
 */

function populateEditTaskForm(task) {
  document.getElementById("taskTitle").value = task.title || "";
  document.getElementById("taskDescription").value = task.description || "";
  document.getElementById("taskDueDate").value = task.dueDate || "";
  selectedPriority = task.priority || "Medium";
  updatePriorityButtons();
  selectedType = task.type;
  document.getElementById("taskTypeInput").value = task.category || "";
  document.getElementById("secondDropdownSelectedText").textContent =
    task.category || "Select a category";
  selectedMembers = task.members || [];
  updateSelectedMembers();
  subtasksArray = task.subtasks || [];
  updateSubtasksList();
  const actionButton = document.getElementById("createTaskButton");
  actionButton.textContent = "Edit Task";
}

/**
 * Closes the task details modal.
 */

function closeTaskDetailsModal() {
  document.getElementById("taskDetailsModal").style.display = "none";
}

/**
 * Deletes the currently selected task from Firebase and the board.
 */

function deleteCurrentTask() {
  if (currentTaskId) {
    deleteTaskFromFirebase(currentTaskId)
      .then(() => {
        removeTaskFromBoard(currentTaskId);
        closeTaskDetailsModal();
      })
      .catch(() => {});
  }
}

/**
 * Deletes a task from Firebase.
 * @param {string} taskId - The ID of the task to delete.
 * @returns {Promise<void>} A promise resolving when the task is deleted.
 */

function deleteTaskFromFirebase(taskId) {
  return firebase
    .database()
    .ref("/tasks/" + taskId)
    .remove();
}

/**
 * Removes a task from the board.
 * @param {string} taskId - The ID of the task to remove.
 */

function removeTaskFromBoard(taskId) {
  const taskCard = document.querySelector(`.task-card[data-id="${taskId}"]`);
  if (taskCard) {
    const tasksContainer = taskCard.parentElement;
    taskCard.remove();
    updateNoTasksMessage(tasksContainer.closest(".board-column"));
  }
}

/**
 * Resets the "Add Task" form inputs and states.
 */

function resetAddTaskForm() {
  document.getElementById("addTaskForm").reset();
  selectedMembers = [];
  updateSelectedMembers();
}

/**
 * Fetches contacts from Firebase and executes a callback with the results.
 * @param {Function} callback - The callback function to process the fetched contacts.
 */

function fetchContacts(callback) {
  firebase
    .database()
    .ref("/contacts/")
    .once("value")
    .then((snapshot) => {
      const contacts = snapshot.val();
      callback(contacts);
    })
    .catch(() => {});
}

/**
 * Fügt einen Klick-Listener hinzu, um das Dropdown-Menü zu öffnen oder zu schließen.
 *
 * @param {HTMLElement} dropdown - Das Dropdown-Element.
 * @param {HTMLElement} optionsContainer - Der Container mit den Optionen.
 */

function setupDropdownTrigger(dropdown, optionsContainer) {
    const dropdownTrigger = dropdown.querySelector(".dropdown-placeholder");
    dropdownTrigger.addEventListener("click", (event) => {
      event.stopPropagation();
      const isOpen = dropdown.classList.toggle("open");
      optionsContainer.classList.toggle("hidden", !isOpen);
    });
    document.addEventListener("click", (event) => {
      if (!dropdown.contains(event.target)) {
        optionsContainer.classList.add("hidden");
        dropdown.classList.remove("open");
      }
    });
}
  
/**
   * Fügt eine Suchfunktion für das Dropdown-Menü hinzu.
   *
   * @param {HTMLElement} searchInput - Das Eingabefeld für die Suche.
   * @param {HTMLElement} optionsContainer - Der Container mit den Optionen.
   */
  
  function setupDropdownSearch(searchInput, optionsContainer) {
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      const options = optionsContainer.querySelectorAll(".dropdown-option");
      options.forEach((option) => {
        const contactName = option.dataset.value.toLowerCase();
        option.style.display = contactName.includes(searchTerm)
          ? "block"
          : "none";
      });
    });
}
  
/**
   * Ruft Kontakte ab und befüllt das Dropdown-Menü.
   *
   * @param {Function} fetchContacts - Funktion, um Kontakte abzurufen.
   */
  
function setupContactsDropdown(fetchContacts) {
    fetchContacts((contacts) => {
      populateContactsDropdown(contacts);
    });
}
  
  /**
   * Initialisiert das Dropdown-Menü mit Suchfunktion und Kontakten.
   */
  
  function setupDropdownSearchInline() {
    const dropdown = document.getElementById("taskAssignedDropdown");
    const optionsContainer = document.getElementById("taskAssignedOptions");
    const searchInput = document.getElementById("taskSearchInput");
    if (!dropdown || !optionsContainer || !searchInput) {
      return;
    }
    setupDropdownTrigger(dropdown, optionsContainer);
    setupDropdownSearch(searchInput, optionsContainer);
    setupContactsDropdown(fetchContacts);
}

