/**
 * Initialisiert Event Listener und Funktionen für die mobile Ansicht.
 */
document.addEventListener("DOMContentLoaded", () => {
    setupDropdownSearchInline();
    setupSubtaskIconClickListeners();
    setupSecondDropdown();
    saveDefaultTasks();
  
    // Aufgaben abrufen und rendern
    fetchTasks((tasks) => {
      renderTasks(tasks);
      enableDragAndDrop();
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
    document.getElementById("addTaskButton").addEventListener("click", () => {
      if (window.innerWidth <= 660) {
        window.location.href = "./addTask.html";
      } else {
        openAddTaskModal();
      }
    });
  
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
        closeModal();
      });
    }
  
    // Standard-Priorität auf "Medium" setzen
    const mediumPriorityButton = document.querySelector(
      ".priority-btn[data-priority='Medium']"
    );
    if (mediumPriorityButton) {
      mediumPriorityButton.classList.add("active");
      selectedPriority = mediumPriorityButton.dataset.priority;
      const icon = mediumPriorityButton.querySelector(".priority-icon");
      if (icon) icon.style.filter = "brightness(0) invert(1)";
    }
  });
  
  /**
   * Fügt Event Listener zu allen Prioritäts-Buttons hinzu.
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
   * Fügt Event Listener für das Löschen einer Aufgabe hinzu.
   */
  const deleteButton = document.querySelector(".delete-btn");
  if (deleteButton) {
    deleteButton.addEventListener("click", () => {
      deleteCurrentTask();
    });
  }
  
  /**
   * Fügt Event Listener zu den "Add Task Type"-Buttons hinzu.
   */
  const addTaskTypeButtons = document.querySelectorAll(".add-task-btn-category");
  addTaskTypeButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const type = button.getAttribute("data-type");
      openAddTaskModal(type);
    });
  });
  
  /**
   * Fügt Event Listener für das Hinzufügen von Subtasks hinzu.
   */
  const subtaskInput = document.getElementById("subtaskInput");
  const subtaskAddButton = document.querySelector(".subtask-add-button");
  subtaskAddButton.addEventListener("click", () => {
    addSubtask(subtaskInput.value.trim());
    subtaskInput.value = "";
  });
  
  subtaskInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtask(subtaskInput.value.trim());
      subtaskInput.value = "";
    }
  });
  