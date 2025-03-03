/**
 * Initialisiert Event-Listener, Dropdown-Optionen und Subtask-Begrenzung,
 * die für die Interaktion mit dem Task-Board und der Modalerstellung benötigt werden.
 */
document.addEventListener("DOMContentLoaded", () => {
/**
     * Setzt die Dropdown-Suche inline ein.
     */
setupDropdownSearchInline();
  
/**
     * Initialisiert Klick-Listener für Subtask-Icons.
     */
setupSubtaskIconClickListeners();
  
/**
     * Initialisiert das zweite Dropdown-Menü.
     */
setupSecondDropdown();
  
/**
     * Speichert standardmäßige Aufgaben in der Datenbank.
     */
saveDefaultTasks();
  
/**
     * Ruft Aufgaben aus der Datenbank ab und rendert sie auf dem Board.
     */
    fetchTasks((tasks) => {
      renderTasks(tasks);
      enableDragAndDrop();
});
  
/**
     * Ruft Kontakte ab und füllt das Dropdown-Menü "Assigned to".
     */
    fetchContacts((contacts) => {
      populateContactsDropdown(contacts);
});
  
// Event-Listener für verschiedene Buttons und UI-Komponenten
    setupTaskModalListeners();
    setupPriorityButtons();
    setupSubtaskLimitHandlers();
});
  
/**
   * Fügt Event-Listener für Modale wie das Hinzufügen und Bearbeiten von Aufgaben hinzu.
   */
  function setupTaskModalListeners() {
    /**
     * Öffnet das Bearbeiten-Modal für die aktuelle Aufgabe.
     */
    const editBtn = document.querySelector(".edit-btn");
    if (editBtn) {
      editBtn.addEventListener("click", () => {
        if (currentTask) {
          isEditMode = true;
          currentTaskId = currentTask.id;
          populateEditTaskForm(currentTask);
          document.getElementById("addTaskModal").style.display = "block";
        }
      });
}
  
/**
     * Schließt das Aufgaben-Detail-Modal.
     */
    const taskDetailsCloseBtn = document.querySelector("#taskDetailsModal .close-button");
    if (taskDetailsCloseBtn) {
      taskDetailsCloseBtn.addEventListener("click", () => {
        document.getElementById("taskDetailsModal").style.display = "none";
      });
}
  
/**
     * Fügt Aufgaben hinzu oder speichert bearbeitete Aufgaben.
     */
    const createTaskButton = document.getElementById("createTaskButton");
    if (createTaskButton) {
      createTaskButton.addEventListener("click", handleTaskSubmit);
}
  
/**
     * Öffnet das Modal zum Hinzufügen einer Aufgabe.
     */
    const addTaskButton = document.getElementById("addTaskButton");
    if (addTaskButton) {
      addTaskButton.addEventListener("click", () => {
        openAddTaskModal("todo");
        fetchContacts((contacts) => {
          populateContactsDropdown(contacts);
        });
      });
}
  
/**
     * Schließt das Add-Task-Modal und setzt es zurück.
     */
    const addTaskCloseBtn = document.querySelector("#addTaskModal .close-button");
    if (addTaskCloseBtn) {
      addTaskCloseBtn.addEventListener("click", () => {
        closeModal();
      });
}
  
/**
     * Setzt das Add-Task-Modal beim Abbrechen zurück.
     */
    const cancelButton = document.getElementById("cancelButton");
    if (cancelButton) {
      cancelButton.addEventListener("click", (event) => {
        event.preventDefault();
        resetAddTaskModal();
        closeModal();
      });
    }
}
  
/**
   * Fügt Event-Listener für die Prioritätsschaltflächen hinzu.
   */
  function setupPriorityButtons() {
    const priorityButtons = document.querySelectorAll(".priority-btn");
    priorityButtons.forEach((button) => {
      button.addEventListener("click", () => {
        priorityButtons.forEach((btn) => btn.classList.remove("active"));
        button.classList.add("active");
        selectedPriority = button.dataset.priority;
      });
    });
}
  
/**
   * Fügt Funktionen für das Subtask-Limit hinzu.
   */
  function setupSubtaskLimitHandlers() {
    const subtaskInput = document.getElementById("subtaskInput");
    const subtaskAddButton = document.querySelector(".subtask-add-button");
    const subtaskError = document.createElement("div");
    subtaskError.id = "subtaskError";
    subtaskError.className = "error-message hidden";
    subtaskError.textContent = "Limit an Subtasks erreicht.";
    document.querySelector(".subtask-input-container").appendChild(subtaskError);
const subtaskLimit = 6;

/**
 * Überprüft, ob weitere Subtasks hinzugefügt werden können, basierend auf einem festgelegten Limit.
 * Blendet eine Fehlermeldung ein oder aus, wenn das Limit erreicht ist.
 *
 * @returns {boolean} - Gibt `true` zurück, wenn weitere Subtasks hinzugefügt werden können,
 *                      ansonsten `false`, wenn das Limit erreicht ist.
 */
function canAddMoreSubtasks() {
      const subtaskList = document.getElementById("subtaskList");
      const isLimitReached = subtaskList.children.length >= subtaskLimit;
      subtaskError.classList.toggle("hidden", !isLimitReached);
      return !isLimitReached;
}
  
/**
 * Fügt eine neue Subtask hinzu, wenn die Eingabe gültig ist und das Subtask-Limit nicht überschritten wurde.
 * Setzt das Eingabefeld nach erfolgreichem Hinzufügen zurück.
 */
function handleSubtaskAddition() {
      const subtaskValue = subtaskInput.value.trim();
      if (!subtaskValue) return;
      if (!canAddMoreSubtasks()) return;
      addSubtask(subtaskValue);
      subtaskInput.value = "";
}

// Event-Listener für das Hinzufügen per Button-Klick
    subtaskAddButton.addEventListener("click", handleSubtaskAddition);

// Event-Listener für das Hinzufügen per Enter-Taste
    subtaskInput.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubtaskAddition();
      }
    });
}
  