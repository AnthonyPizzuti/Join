/**
 * Erstellt die Hauptstruktur der Task-Karte.
 * @param {Object} task - Die Daten der Aufgabe.
 * @returns {HTMLElement} - Das erstellte Task-Karten-Element.
 */
function createTaskCard(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("draggable", "true");
    card.dataset.id = task.id;
    card.innerHTML = `
      ${createTaskCategory(task)}
      ${createTaskHeader(task)}
      ${createProgressSection(task)}
      ${createSubtasksList(task)}
      ${createTaskFooter(task)}`;
    setupTaskCardEvents(card, task);
    return card;
}
  
/**
   * Erstellt die Kategorieanzeige der Task-Karte.
   * @param {Object} task - Die Daten der Aufgabe.
   * @returns {string} - Der HTML-String für die Kategorieanzeige.
   */
function createTaskCategory(task) {
    return `<div class="task-category" style="background-color: ${
      task.category === "User Story" ? "#0038FF" : "#1FD7C1"
    }; color: white;">
      ${task.category || "Technical Task"}
    </div>`;
}
  
/**
   * Erstellt den Header der Task-Karte.
   * @param {Object} task - Die Daten der Aufgabe.
   * @returns {string} - Der HTML-String für den Header.
   */
function createTaskHeader(task) {
    return `
      <h3>${task.title}</h3>
      <p>${task.description || "No description provided"}</p>`;
}
  
/**
   * Erstellt die Fortschrittsanzeige der Task-Karte.
   * @param {Object} task - Die Daten der Aufgabe.
   * @returns {string} - Der HTML-String für die Fortschrittsanzeige.
   */
function createProgressSection(task) {
    const total = task.subtasks?.length || 0;
    const completed = task.subtasks?.filter((st) => st.completed).length || 0;
    const progress = total > 0 ? (completed / total) * 100 : 0;
    return `<div class="progress-container">
        <div class="progress">
          <div class="progress-bar" style="width: ${progress}%;"></div>
        </div>
        <div class="progress-text">
          <span>${completed}/${total} Subtasks</span>
        </div>
      </div>`;
}
  
/**
   * Erstellt die Subtask-Liste der Task-Karte.
   * @param {Object} task - Die Daten der Aufgabe.
   * @returns {string} - Der HTML-String für die Subtask-Liste.
   */
  function createSubtasksList(task) {
    return `<ul class="subtasks-list">
      ${task.subtasks ?.map((subtask, index) => `<li class="subtask-item" data-id="${subtask.id}">
          <div class="subtask-checkbox" data-index="${index}">
            <img src="./assets/icons/${subtask.completed ? "checked" : "unchecked"}.png" alt="${subtask.completed ? "Completed" : "Incomplete"}"class="subtask-icon" data-completed="${subtask.completed}" />
            </div>
          <span>${subtask.title}</span>
        </li>`).join("") || ""}
    </ul>`;
}
  
/**
   * Erstellt den Footer der Task-Karte.
   * @param {Object} task - Die Daten der Aufgabe.
   * @returns {string} - Der HTML-String für den Footer.
   */
function createTaskFooter(task) {
    return `<div class="task-footer">
        <div class="avatars">
          ${task.members ?.map((name) => `<div class="avatar" style="background-color: ${getColorForContact(name)};">${getInitials(name)}</div>`).join("") || ""}
        </div>
        <img src="./assets/icons/${task.priority.toLowerCase()}.png" alt="${task.priority}" class="priority-icon" /></div>`;
}
  
/**
   * Fügt Event-Listener für die Task-Karte hinzu.
   * @param {HTMLElement} card - Das Task-Karten-Element.
   * @param {Object} task - Die Daten der Aufgabe.
   */
function setupTaskCardEvents(card, task) {
    card.addEventListener("dragstart", (e) => startDragging(e, card));
    card.addEventListener("dragend", () => {
      currentDraggedTask = null;
      draggedTask = null;
    });
    setupSubtaskIconClickListeners(task);
    card.addEventListener("click", () => showTaskDetails(task));
}
  

/**
 * Generates the initials from a given name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the name in uppercase.
 */

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

/**
 * Creates a progress bar and text for a task's subtasks.
 * @param {Object} task - The task object containing subtasks.
 * @returns {string} The HTML string for the subtasks progress UI.
 */
function createSubtasksProgress(task) {
  const total = task.subtasks ? task.subtasks.length : 0;
  const completed = task.subtasks ? task.subtasks.filter((st) => st.completed).length: 0;
  const percent = total > 0 ? (completed / total) * 100 : 0;
  if (total > 0) {
    return `<div class="progress-container">
        <div class="progress">
        <div class="progress-bar" style="width: ${percent}%;"></div>
        </div>
        <span class="progress-text">${completed}/${total} Subtasks</span></div>`;
  }
  return "<span>No Subtasks</span>";
}

/**
 * Displays the details of a task in a modal, including category, title, description, due date, priority, and members.
 * @param {Object} task - The task object to display.
 */
function showTaskDetails(task) {
  currentTask = task;
  currentTaskId = task.id;
  document.getElementById("taskType").innerHTML = `<div style="background-color: ${task.category === "User Story" ? "#0038FF" : "#1FD7C1"}; color: white; padding: 5px 10px; border-radius: 5px;">
        ${task.category || "Technical Task"}</div>`;
  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText = task.description || "No description provided";
  document.getElementById("taskDetailDueDate").innerText = task.dueDate || "N/A";
renderTaskSubtasks(task);
updateTaskPriority(task)

/**
 * Updates the priority section in the task details modal.
 * @param {Object} task - The task object containing the priority information.
 */
function updateTaskPriority(task) {
    const priorityIcon = task.priority === "Urgent" ? "./assets/icons/urgent.png" : task.priority === "Medium" ? "./assets/icons/medium.png" : "./assets/icons/low.png";
    const taskDetailPriority = document.getElementById("taskDetailPriority");
    if (taskDetailPriority) {taskDetailPriority.innerHTML = `${task.priority || "Medium"} 
    <img src="${priorityIcon}" alt="${task.priority}" class="priority-icon" />`;
    }
}
  
/**
 * Updates the assigned members section in the task details modal.
 * @param {Object} task - The task object containing the members information.
 */
function updateAssignedMembers(task) {
    const taskAssignedTo = document.getElementById("taskAssignedTo");
    if (!taskAssignedTo) return;
    taskAssignedTo.innerHTML = task.members ? task.members.map((name) => `<div class="avatar-container">
            <div class="avatar" style="background-color: ${getColorForContact(name)};">${getInitials(name)}</div>
            <span>${name}</span>
            </div>`).join("")
      : "<p>No members assigned</p>";
}
updateAssignedMembers(task)

/**
   * Renders the subtasks of a task into the subtasks container element in the UI.
   * @param {Object} task - The task object containing subtasks.
   * @param {Array} task.subtasks - The array of subtasks, each with a title and completion state.
   */
function renderTaskSubtasks(task) {
    const subtasksContainer = document.getElementById("taskSubtasks");
    subtasksContainer.innerHTML = createSubtasksList(task);
    if (!subtasksContainer) {
      return;
    }
    if (task.subtasks && task.subtasks.length > 0) {subtasksContainer.innerHTML = task.subtasks.map((st, index) => `<div class="subtask-item">
            <input type="checkbox" class="subtask-checkbox" ${st.completed ? "checked" : ""} data-index="${index}" />
            <span>${st.title}</span>
            </div>`).join("");
    } else {
      subtasksContainer.innerHTML = "<p>No subtasks</p>";
    }
    attachSubtaskProgressListener(task);
    setupSubtaskIconClickListeners(task);
  }
  document.getElementById("taskDetailsModal").style.display = "block";
  attachSubtaskProgressListener(task);
}

/**
 * Adds a new subtask with the given title to the subtasks array and updates the list UI.
 * @param {string} title - The title of the subtask to add.
 */
function addSubtask(title) {
  if (title) {
    subtasksArray.push({ title, completed: false });
    updateSubtasksList();
    subtaskInput.value = "";
  }
}

/**
 * Updates the UI for the subtask list based on the current subtasks array.
 */
function updateSubtasksList() {
  const subtaskList = document.getElementById("subtaskList");
  subtaskList.innerHTML = "";
  subtasksArray.slice(0, 6).forEach((subtask, index) => {
    const li = document.createElement("li");
    li.className = "subtask-item";
    li.innerHTML = `<span class="subtask-title">${subtask.title}</span>
        <div class="subtask-actions">
        <img src="./assets/icons/edit.png" alt="Edit" class="subtask-edit-icon" data-index="${index}"/>
        <img src="./assets/icons/delete.png" alt="Delete" class="subtask-delete-icon" data-index="${index}"/></div>`;
    subtaskList.appendChild(li);
  });
  setupSubtaskActions();
}

/**
 * Sets up event listeners for subtask action buttons (edit and delete).
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
 * Edits the title of a subtask and updates the subtask list.
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
 * Saves the edited title of a subtask and updates the subtask list.
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
 * Deletes a subtask by its index and updates the subtask list.
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
                <img src="./assets/icons/${subtask.completed ? "checked" : "unchecked"}.png" alt="${subtask.completed ? "Completed" : "Incomplete"}" class="subtask-icon" data-completed="${subtask.completed}" data-index="${index}"/>
              </div>
              <span>${subtask.title}</span>
            </li>`).join("");
  }
  return "<li>No subtasks</li>";
}

/**
 * Updates the task details modal with the given task's information.
 * @param {Object} task - The task object to display in the modal.
 */
function updateTaskDetailsModal(task) {
  document.getElementById("taskType").innerHTML = `<div style="background-color: ${task.category === "User Story" ? "#0038FF" : "#1FD7C1"}; color: white; padding: 5px 10px; border-radius: 5px;">
    ${task.category || "Technical Task"}</div>`;
  document.getElementById("taskDetailTitle").innerText = task.title;
  document.getElementById("taskDetailDescription").innerText = task.description || "No description provided";
  document.getElementById("taskDetailDueDate").innerText = task.dueDate || "N/A";
  const priorityContainer = document.getElementById("taskDetailPriority");
  priorityContainer.innerHTML = "";
  const priorityIcon = task.priority === "Urgent" ? "./assets/icons/urgent.png" : task.priority === "Medium" ? "./assets/icons/medium.png" : "./assets/icons/low.png";
  priorityContainer.innerHTML = `${task.priority || "Medium"} 
    <img src="${priorityIcon}" alt="${task.priority}" class="priority-icon" />`;
  document.getElementById("taskAssignedTo").innerHTML = task.members ? task.members.map((name) => `<div class="avatar-container">
    <div class="avatar" style="background-color: ${getColorForContact(name)};">${getInitials(name)}</div>
    <span>${name}</span>
    </div>`).join(""): "<p>No members assigned</p>";
}

/**
 * Creates avatar elements for all members assigned to a task.
 * @param {Object} task - The task object containing member details.
 * @returns {string} The HTML string for the avatar elements.
 */
function createAssignedAvatars(task) {
  if (task.members && task.members.length > 0) {
    let avatars = task.members.map((member) => {
    let initials = getInitials(member);
    let color = getColorForMember(member);
    return `<div class="avatar" style="background-color: ${color}">${initials}</div>`;}).join("");
    return `<div class="avatars">${avatars}</div>`;
  }
  return "";
}

/**
 * Populates the contacts dropdown with available options.
 * @param {Object} contacts - An object containing contact details.
 */
function populateContactsDropdown(contacts) {
    const optionsContainer = document.getElementById("taskAssignedOptions");
    optionsContainer.innerHTML = "";
    if (!contacts) {
      displayNoContactsMessage(optionsContainer);
      return;
    }
    Object.keys(contacts).forEach((contactId) => {
      const contact = contacts[contactId];
      const option = createContactOption(contact);
      optionsContainer.appendChild(option);
    });
}
  
/**
 * Creates and returns a contact dropdown option element.
 * @param {Object} contact - The contact object containing name and details.
 * @returns {HTMLElement} - The dropdown option element.
 */
function createContactOption(contact) {
    const initials = getInitials(contact.name);
    const color = getColorForContact(contact.name);
    const option = document.createElement("div");
    option.className = "dropdown-option";
    option.dataset.value = contact.name;
    option.innerHTML = `<span class="contact-initials" style="background-color: ${color}">${initials}</span>
      <span>${contact.name}</span>
      <img class="select-icon" src="./assets/icons/property-default.png" alt="Select Icon">
      <img class="selected-icon" src="./assets/icons/property-checked.png" alt="Selected Icon">`;
    option.addEventListener("click", () => toggleContactSelection(option, initials, color, document.getElementById("selectedContactsContainer")));
    return option;
}
  
/**
   * Displays a message when no contacts are available.
   * @param {HTMLElement} container - The container to display the message.
   */ 
function displayNoContactsMessage(container) {
    container.innerHTML = '<div class="no-contacts">No contacts available</div>';
}
