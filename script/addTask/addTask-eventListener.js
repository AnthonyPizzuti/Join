/**
 * Initialisiert alle Event-Listener und Dropdowns nach dem Laden der Seite.
 */
document.addEventListener("DOMContentLoaded", () => {
    setupDropdownSearchInline();
    setupSecondDropdown();
    enableDragAndDrop();

// Aufgaben abrufen und rendern
    fetchTasks((tasks) => {
      renderTasks(tasks);
});

// Kontakte abrufen und Dropdown befüllen
    fetchContacts((contacts) => {
      populateContactsDropdown(contacts);
});
  
// Bearbeiten-Button Listener
const editButton = document.querySelector(".edit-btn");
    if (editButton) {
      editButton.addEventListener("click", () => {
        openEditTaskModal();
      });
}
  
// Schließen des Task-Details Modals
const taskDetailsCloseBtn = document.querySelector(
      "#taskDetailsModal .close-button"
    );
    if (taskDetailsCloseBtn) {
      taskDetailsCloseBtn.addEventListener("click", () => {
        document.getElementById("taskDetailsModal").style.display = "none";
      });
}
  
// Erstellen einer neuen Aufgabe
const createTaskButton = document.getElementById("createTaskButton");
    if (createTaskButton) {
      createTaskButton.addEventListener("click", handleTaskSubmit);
}
  
// "Add Task"-Button Event Handler
const addTaskButton = document.getElementById("addTaskButton");
    if (addTaskButton) {
      addTaskButton.addEventListener("click", () => {
        openAddTaskModal("todo");
        fetchContacts((contacts) => {
          populateContactsDropdown(contacts);
        });
      });
}
  
// Schließen des "Add Task"-Modals
const addTaskCloseBtn = document.querySelector("#addTaskModal .close-button");
    if (addTaskCloseBtn) {
      addTaskCloseBtn.addEventListener("click", () => {
        document.getElementById("addTaskModal").style.display = "none";
      });
}
  
// Abbrechen einer neuen Aufgabe
const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
      cancelButton.addEventListener("click", (event) => {
        event.preventDefault();
        resetAddTaskModal();
      });
    }
    initializePriority();
});
  
/**
   * Initialisiert die Priorität auf "Medium" und setzt das entsprechende Icon.
   */
  function initializePriority() {
    const mediumPriorityButton = document.querySelector(
      ".priority-btn[data-priority='Medium']"
    );
    if (mediumPriorityButton) {
      mediumPriorityButton.classList.add("active");
      selectedPriority = mediumPriorityButton.dataset.priority;
      const icon = mediumPriorityButton.querySelector(".priority-icon");
      if (icon) icon.style.filter = "brightness(0) invert(1)";
    }
}
  
/**
   * Fügt Event-Listener zu allen Prioritätsbuttons hinzu, um die aktive Priorität zu ändern.
   */
  const priorityButtons = document.querySelectorAll(".priority-btn");
  priorityButtons.forEach((button) => {
    button.addEventListener("click", () => {
      priorityButtons.forEach((btn) => {
        btn.classList.remove("active");
        const icon = btn.querySelector(".priority-icon");
        if (icon) icon.style.filter = "none";
      });
      button.classList.add("active");
      selectedPriority = button.dataset.priority;
      const icon = button.querySelector(".priority-icon");
      if (icon) icon.style.filter = "brightness(0) invert(1)";
    });
});
  
/**
   * Löscht die aktuelle Aufgabe.
   */
  const deleteButton = document.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentTask();
    });
}
  
/**
   * Initialisiert Event-Listener für Task-Typ-Buttons, um das Hinzufügen von Tasks zu ermöglichen.
   */
  const addTaskTypeButtons = document.querySelectorAll(".add-task-btn-category");
  addTaskTypeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const type = button.getAttribute("data-type");
      openAddTaskModal(type);
    });
});
  
/**
   * Initialisiert die Subtask-Fehlermeldung und setzt Event-Listener für Subtasks.
   */
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  const subtaskError = document.createElement("div");
  subtaskError.id = "subtaskError";
  subtaskError.className = "error-message hidden";
  subtaskError.textContent = "Limit an Subtasks erreicht.";
  document.querySelector(".subtask-input-container").appendChild(subtaskError);
  
  let subtaskLimit = 6;
  
/**
   * Überprüft, ob weitere Subtasks hinzugefügt werden können.
   * @returns {boolean} - True, wenn weitere Subtasks hinzugefügt werden können, andernfalls false.
   */
  function canAddMoreSubtasks() {
    const subtaskList = document.getElementById("subtaskList");
    const isLimitReached = subtaskList.children.length >= subtaskLimit;
    subtaskError.classList.toggle("hidden", !isLimitReached);
    return !isLimitReached;
}
  
/**
   * Handhabt das Hinzufügen eines Subtasks.
   */
  function handleSubtaskAddition() {
    const subtaskValue = subtaskInput.value.trim();
    if (!subtaskValue) return;
    const subtaskList = document.getElementById("subtaskList");
    if (subtaskList.children.length >= subtaskLimit) {
      subtaskError.classList.remove("hidden");
      return;
    }
    addSubtask(subtaskValue);
    subtaskInput.value = "";
    subtaskError.classList.add("hidden");
}
  
subtaskAddButton.addEventListener("click", (event) => {
    event.preventDefault();
    handleSubtaskAddition();
});
  
subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubtaskAddition();
    }
});
  
/**
   * Initialisiert Klick-Listener für Subtask-Icons.
   * @param {Object} task - Die aktuelle Aufgabe, die Subtasks enthält.
   */
  function setupSubtaskIconClickListeners(task) {
    const icons = document.querySelectorAll(".subtask-icon");
    icons.forEach((icon) => {
      icon.addEventListener("click", (event) => {
        const subtaskIndex = parseInt(event.target.parentElement.dataset.index,10);
        const subtask = task.subtasks[subtaskIndex];
        if (subtask) {subtask.completed = !subtask.completed;
          event.target.src = `./assets/icons/${
            subtask.completed ? "checked" : "unchecked"}.png`;
          event.target.alt = subtask.completed ? "Completed" : "Incomplete";
          updateSubtaskInFirebase(task.id, subtaskIndex, subtask.completed);
          updateSubtaskProgress(task);
        }
      });
    });
}
  