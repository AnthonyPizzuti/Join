/**
 * Erstellt eine Task-Karte mit den übergebenen Task-Daten.
 * @param {Object} task - Die Task-Daten.
 * @returns {HTMLElement|null} - Das erstellte Task-Element oder null, falls ungültig.
 */

function createTaskCard(task) {
    if (!task || typeof task !== "object") return null;
    const card = initializeCardElement(task);
    const subtasksInfo = getSubtasksInfo(task);
    const visibleMembersHtml = getVisibleMembersHtml(task.members);
    const priorityHtml = getPriorityHtml(task.priority);
    card.innerHTML = `
      ${getCategoryHtml(task.category)}
      <h3>${task.title || "Untitled Task"}</h3>
      <p>${task.description || "No description provided"}</p>
      ${getProgressHtml(subtasksInfo)}
      ${getFooterHtml(visibleMembersHtml, priorityHtml)}`;
    attachCardEventListeners(card, task);
    return card;
}
  
/**
 * Initialisiert das Card-Element.
 * @param {Object} task - Die Task-Daten.
 * @returns {HTMLElement} - Das erstellte Card-Element.
 */

function initializeCardElement(task) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.setAttribute("draggable", "true");
    card.dataset.id = task.id;
    return card;
}
  
/**
 * Berechnet die Subtasks-Informationen.
 * @param {Object} task - Die Task-Daten.
 * @returns {Object} - Die Subtasks-Informationen.
 */

function getSubtasksInfo(task) {
    const subtasks = Array.isArray(task.subtasks) ? task.subtasks : [];
    const totalSubtasks = subtasks.length;
    const completedSubtasks = subtasks.filter((st) => st.completed).length;
    const progressPercent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    return { totalSubtasks, completedSubtasks, progressPercent };
}

/**
 * Generiert das HTML für die Kategorie.
 * @param {string} category - Die Kategorie der Task.
 * @returns {string} - Das HTML für die Kategorie.
 */

function getCategoryHtml(category) {
    const bgColor = category === "User Story" ? "#0038FF" : "#1FD7C1";
    return `<div class="task-category" style="background-color: ${bgColor}; color: white;">
              ${category || "Technical Task"}
            </div>`;
}
  
/**
 * Generiert das HTML für den Fortschritt der Subtasks.
 * @param {Object} subtasksInfo - Informationen zu den Subtasks.
 * @returns {string} - Das HTML für den Fortschritt.
 */

function getProgressHtml({ totalSubtasks, completedSubtasks, progressPercent }) {
    return `<div class="progress-container">
              <div class="progress">
                <div class="progress-bar" style="width: ${progressPercent}%;"></div>
              </div>
              <div class="progress-text">
                <span>${completedSubtasks}/${totalSubtasks} Subtasks</span>
              </div>
            </div>`;
}
  
/**
 * Generiert das HTML für die sichtbaren Mitglieder.
 * @param {Array} members - Die Mitglieder der Task.
 * @returns {string} - Das HTML für die Mitglieder.
 */

function getVisibleMembersHtml(members = []) {
    const maxVisibleMembers = 4;
    const visibleMembers = members.slice(0, maxVisibleMembers);
    const remainingMembers = members.length - maxVisibleMembers;
    const memberHtml = visibleMembers.map((name) => `<div class="avatar" style="background-color: ${getColorForContact(name)};">
            ${getInitials(name)}
          </div>`).join("");
    const remainingHtml = remainingMembers > 0 ? `<div class="avatar" style="background-color: #ccc;">+${remainingMembers}</div>`
        : "";
    return memberHtml + remainingHtml;
}
  
/**
 * Generiert das HTML für die Priorität.
 * @param {string} priority - Die Priorität der Task.
 * @returns {string} - Das HTML für die Priorität.
 */

function getPriorityHtml(priority) {
    const iconSrc = priority === "Urgent"
        ? "./assets/icons/urgent.png"
        : priority === "Medium"
        ? "./assets/icons/medium.png"
        : "./assets/icons/low.png";
    return `
        <div class="priority-wrapper">
            <span class="priority-text">${priority || "Low"}</span>
            <img src="${iconSrc}" alt="${priority || "Low"}" class="priority-icon" />
        </div>
    `;
}

  
/**
 * Generiert das HTML für den Footer der Task-Karte.
 * @param {string} membersHtml - Das HTML der Mitglieder.
 * @param {string} priorityHtml - Das HTML der Priorität.
 * @returns {string} - Das HTML für den Footer.
 */

function getFooterHtml(membersHtml, priorityHtml) {
    return `<div class="task-footer">
              <div class="avatars">${membersHtml}</div>
              <div class="priority-container">${priorityHtml}</div>
            </div>`;
}
  
/**
 * Hängt Event-Listener an die Task-Karte.
 * @param {HTMLElement} card - Das Card-Element.
 * @param {Object} task - Die Task-Daten.
 */

function attachCardEventListeners(card, task) {
    card.addEventListener("dragstart", (e) => startDragging(e, card));
    card.addEventListener("dragend", () => {
      currentDraggedTask = null;
      draggedTask = null;
    });
    card.addEventListener("click", () => showTaskDetails(task));
}
  
/**
 * Updates the UI of a subtask element to reflect its completion state.
 * @param {HTMLElement} subtaskElement - The subtask element to update.
 * @param {Object} subtask - The subtask object containing its details.
 */

function renderSubtaskUI(subtaskElement, subtask) {
  subtaskElement.src = `./assets/icons/${
    subtask.completed ? "checked" : "unchecked"}.png`;
  subtaskElement.dataset.completed = subtask.completed;
}

/**
 * Generates initials from a contact's full name.
 * @param {string} name - The full name of the contact.
 * @returns {string} The initials of the name.
 */

function getInitials(name) {
  if (!name) return "?";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase();
}

/**
 * Assigns a unique color to a contact based on their name.
 * @param {string} name - The contact's name.
 * @returns {string} The color code associated with the contact.
 */

function getColorForContact(name) {
  const colors = [
    "#FF7A00","#6E52FF","#9327FF","#FC71FF","#FFBB2B","#1FD7C1","#462F8A","#FF4646","#00BEE8",];
  let index = name.charCodeAt(0) % colors.length;
  return colors[index];
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
          <span class="progress-text">${completed}/${total} Subtasks</span>
        </div>`;
  }
  return "<span>No Subtasks</span>";
}

/**
 * Zeigt die Details einer Task an.
 * @param {Object} task - Die Task-Daten.
 */

function showTaskDetails(task) {
    setupTaskDetails(task);
    setupTaskMembers(task);
    setupAssignedOptions(task);
    document.getElementById("taskDetailsModal").style.display = "block";
}

/**
 * Initialisiert die allgemeinen Details der Task.
 * @param {Object} task - Die Task-Daten.
 */

function setupTaskDetails(task) {
    renderTaskSubtasks(task);
    currentTask = task;
    currentTaskId = task.id;
  
    const taskTypeHtml = `<div style="background-color: ${
      task.category === "User Story" ? "#0038FF" : "#1FD7C1"
    }; color: white; padding: 5px 10px; border-radius: 5px;">
        ${task.category || "Technical Task"}
      </div>`;
    document.getElementById("taskType").innerHTML = taskTypeHtml;
  
    document.getElementById("taskDetailTitle").innerText = task.title;
    document.getElementById("taskDetailDescription").innerText =
      task.description || "No description provided";
    document.getElementById("taskDetailDueDate").innerText = task.dueDate || "N/A";
  
    const priorityHtml = getPriorityHtml(task.priority);
    document.getElementById("taskDetailPriority").innerHTML = priorityHtml;
}
  
/**
 * Initialisiert die Mitglieder-Anzeige der Task.
 * @param {Object} task - Die Task-Daten.
 */

function setupTaskMembers(task) {
    const maxVisibleMembers = 4;
    const visibleMembers = task.members ? task.members.slice(0, maxVisibleMembers): [];
    const remainingMembers = task.members ? task.members.length - maxVisibleMembers: 0;
    const membersHtml = visibleMembers.map((name) => `
        <div class="avatar-container">
          <div class="avatar" style="background-color: ${getColorForContact(name)};">${getInitials(name)}</div>
          <span>${name}</span>
        </div>`).join("");
    const remainingHtml = remainingMembers > 0 ? `<div class="avatar-container">
            <div class="avatar" style="background-color: #ccc;">+${remainingMembers}</div>
          </div>`: "";
    document.getElementById("taskAssignedTo").innerHTML = task.members?.length > 0 ? `${membersHtml}${remainingHtml}` : "<p>No members assigned</p>";
}
  
/**
 * Aktualisiert die Optionen für zugewiesene Kontakte.
 * @param {Object} task - Die Task-Daten.
 */

function setupAssignedOptions(task) {
    const taskAssignedOptions = document.querySelectorAll("#taskAssignedOptions .dropdown-option");
    taskAssignedOptions.forEach((option) => {
      const contactName = option.dataset.value;
      if (task.members && task.members.includes(contactName)) {
        option.classList.add("selected");
        option.style.backgroundColor = "#091931";
        option.style.color = "white";
      } else {
        option.classList.remove("selected");
        option.style.backgroundColor = "";
        option.style.color = "";
      }
    });
}
  
/**
 * Generiert das HTML für die Prioritätsanzeige.
 * @param {string} priority - Die Priorität der Task.
 * @returns {string} - Das HTML für die Prioritätsanzeige.
 */

function getPriorityHtml(priority) {
    const priorityIcon = priority === "Urgent" ? "./assets/icons/urgent.png" : priority === "Medium" ? "./assets/icons/medium.png" : "./assets/icons/low.png";
    return `
      ${priority || "Medium"} 
      <img src="${priorityIcon}" alt="${priority}" class="priority-icon" />`;
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
  const priorityIcon =
    task.priority === "Urgent" ? "./assets/icons/urgent.png" : task.priority === "Medium" ? "./assets/icons/medium.png" : "./assets/icons/low.png";
  priorityContainer.innerHTML = `${task.priority || "Medium"} 
    <img src="${priorityIcon}" alt="${task.priority}" class="priority-icon" />`;
  document.getElementById("taskAssignedTo").innerHTML = task.members ? task.members.map((name) => `
                <div class="avatar-container">
                  <div class="avatar" style="background-color: ${getColorForContact(name)};">${getInitials(name)}</div>
                  <span>${name}</span>
                </div>`).join("")
    : "<p>No members assigned</p>";
}

/**
 * Creates avatar elements for all members assigned to a task.
 * @param {Object} task - The task object containing member details.
 * @returns {string} The HTML string for the avatar elements.
 */

function createAssignedAvatars(task) {
  if (task.members && task.members.length > 0) {let avatars = task.members.map((member) => {
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
    option.innerHTML = `
      <span class="contact-initials" style="background-color: ${color}">${initials}</span>
      <span>${contact.name}</span>
      <img class="select-icon" src="./assets/icons/property-default.png" alt="Select Icon">
      <img class="selected-icon" src="./assets/icons/property-checked.png" alt="Selected Icon">
    `;
    option.addEventListener("click", () =>
      toggleContactSelection(option, initials, color, document.getElementById("selectedContactsContainer"))
    );
    return option;
}
  
/**
   * Displays a message when no contacts are available.
   * @param {HTMLElement} container - The container to display the message.
   */
  
function displayNoContactsMessage(container) {
    container.innerHTML = '<div class="no-contacts">No contacts available</div>';
}
  