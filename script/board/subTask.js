/**
 * Renders the subtasks of a task into the subtasks container in the UI.
 * @param {Object} task - The task object containing subtasks.
 */

function renderTaskSubtasks(task) {
    const subtasksContainer = document.getElementById("taskSubtasks");
    if (!subtasksContainer) {
      return;
    }
    if (task.subtasks && task.subtasks.length > 0) {subtasksContainer.innerHTML = task.subtasks.map((subtask, index) => `
                  <li data-id="${index}">
                    <img src="./assets/icons/${subtask.completed ? "checked" : "unchecked"}.png" 
                      class="subtask-icon"alt="${subtask.title}"data-completed="${subtask.completed}"data-task-id="${task.id}"/>
                    <span>${subtask.title}</span>
                  </li>`).join("");
    } else {
      subtasksContainer.innerHTML = "<p>No subtasks</p>";
    }
    setupSubtaskIconClickListeners(task);
}
  
/**
   * Attaches click listeners to subtask icons to handle their completion state toggling.
   * @param {Object} task - The task object containing subtasks.
   */
  
function setupSubtaskIconClickListeners(task) {
    const subtasksContainer = document.getElementById("taskSubtasks");
    if (!subtasksContainer) {return;
    }
    subtasksContainer.querySelectorAll(".subtask-icon").forEach((icon) => {
      icon.addEventListener("click", (event) => {
        event.stopPropagation();
        const subtaskIndex = parseInt(icon.parentElement.dataset.id);
        if (isNaN(subtaskIndex)) {return;
        }
        if (!task.subtasks || !task.subtasks[subtaskIndex]) {return;
        }
        const completed = icon.dataset.completed === "true";
        task.subtasks[subtaskIndex].completed = !completed;
        updateSubtaskInFirebase(task.id,subtaskIndex,task.subtasks[subtaskIndex].completed);
        icon.dataset.completed = String(task.subtasks[subtaskIndex].completed);
        icon.src = `./assets/icons/${task.subtasks[subtaskIndex].completed ? "checked" : "unchecked"}.png`;
        updateTaskProgress(task);
      });
    });
}
  
/**
   * Adds a new subtask to the task and updates the subtask list UI.
   * @param {string} title - The title of the new subtask.
   */
  
function addSubtask(title) {
    if (title) {
      subtasksArray.push({ title, completed: false });
      updateSubtasksList();
      subtaskInput.value = "";
    }
}
  
/**
   * Updates the subtask list UI with the current subtasks.
   */
  
function updateSubtasksList() {
    const subtaskList = document.getElementById("subtaskList");
    subtaskList.innerHTML = "";
    subtasksArray.slice(0, 6).forEach((subtask, index) => {
      const li = document.createElement("li");
      li.className = "subtask-item";
      li.innerHTML = `<span class="subtask-title">${subtask.title}</span>
          <div class="subtask-actions">
            <img src="./assets/icons/edit.png"alt="Edit"class="subtask-edit-icon"data-index="${index}"/>
            <img src="./assets/icons/delete.png"alt="Delete"class="subtask-delete-icon"data-index="${index}"/>
          </div>`;
      subtaskList.appendChild(li);
    });
    setupSubtaskActions();
}
  
/**
   * Attaches event listeners to subtask action buttons for editing or deleting.
   */
  
function setupSubtaskActions() {
    const editIcons = document.querySelectorAll(".subtask-edit-icon");
    const deleteIcons = document.querySelectorAll(".subtask-delete-icon");
    editIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const index = icon.dataset.index;
        editSubtask(index);
      });
    });
    deleteIcons.forEach((icon) => {
      icon.addEventListener("click", () => {
        const index = icon.dataset.index;
        deleteSubtask(index);
      });
    });
}
  
/**
   * Edits the title of a subtask and updates the subtask list UI.
   * @param {number} index - The index of the subtask to edit.
   */
  
function editSubtask(index) {
    const span = document.querySelectorAll(".subtask-title")[index];
    const input = document.createElement("input");
    input.type = "text";
    input.value = span.textContent;
    input.className = "subtask-edit-input";
    span.replaceWith(input);
    input.focus();
    const save = () => {
      if (input.value.trim()) subtasksArray[index].title = input.value.trim();
      updateSubtasksList();
    };
    input.addEventListener("keydown", (e) => e.key === "Enter" && save());
    input.addEventListener("blur", save);
}
  
/**
   * Saves the edited title of a subtask and updates the subtask list UI.
   * @param {number} index - The index of the subtask to update.
   * @param {string} newTitle - The new title for the subtask.
   */
  
function saveEditedSubtask(index, newTitle) {
    if (newTitle) {
      subtasksArray[index].title = newTitle;
    }
    updateSubtasksList();
}
  
/**
   * Deletes a subtask by its index and updates the subtask list UI.
   * @param {number} index - The index of the subtask to delete.
   */
  
function deleteSubtask(index) {
    subtasksArray.splice(index, 1);
    updateSubtasksList();
}
  
/**
   * Creates a list of subtasks with their completion states.
   * @param {Object} task - The task object containing subtasks.
   * @returns {string} The HTML string for the subtasks list.
   */
  
function createSubtasksList(task) {
    if (task.subtasks && task.subtasks.length > 0) {
      return task.subtasks.map((subtask, index) => `<li class="subtask-item" data-id="${subtask.id}">
                <div class="subtask-checkbox" data-index="${index}">
                  <img src="./assets/icons/${subtask.completed ? "checked" : "unchecked"}.png"alt="${subtask.completed ? "Completed" : "Incomplete"}"class="subtask-icon"data-completed="${subtask.completed}"data-index="${index}"/>
                </div>
                <span>${subtask.title}</span>
              </li>`).join("");
    }
    return "<li>No subtasks</li>";
}
  
/**
   * Initializes event listeners for subtask progress in a task card.
   * @param {HTMLElement} taskCard - The task card element containing subtasks.
   * @param {Object} task - The task object containing subtasks.
   */
  
function initializeSubtaskListeners(taskCard, task) {
    taskCard.querySelectorAll(".subtask-icon").forEach((icon) => {
      icon.addEventListener("click", () => {
        const subtaskIndex = parseInt(icon.parentElement.dataset.id);
        if (isNaN(subtaskIndex)) {return;
        }
        const taskId = task.id;
        const completed = icon.dataset.completed === "true";
        task.subtasks[subtaskIndex].completed = !completed;
        updateSubtaskInFirebase(taskId,subtaskIndex,task.subtasks[subtaskIndex].completed);
        icon.dataset.completed = String(task.subtasks[subtaskIndex].completed);
        icon.src = `./assets/icons/${task.subtasks[subtaskIndex].completed ? "checked" : "unchecked"}.png`;
        updateTaskProgress(task);
      });
    });
}