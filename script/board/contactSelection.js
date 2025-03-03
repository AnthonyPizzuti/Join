/**
 * Toggles the selection of a contact in the dropdown.
 * @param {HTMLElement} option - The dropdown option element.
 * @param {string} initials - The contact's initials.
 * @param {string} color - The color associated with the contact.
 * @param {HTMLElement} selectedContainer - The container for selected contacts.
 */

function toggleContactSelection(option, initials, color, selectedContainer) {
    const contactName = option.dataset.value;
    const selectIcon = option.querySelector(".select-icon");
    const selectedIcon = option.querySelector(".selected-icon");
    if (!selectIcon || !selectedIcon) {
      return;
    }
    const isSelected = option.classList.contains("selected");
    if (isSelected) {
      deselectContact(option,initials,selectedContainer,contactName,selectIcon,selectedIcon);
    } else {
      selectContact(option,initials,color,selectedContainer,contactName,selectIcon,selectedIcon);
    }
    assignedToUserCounter();
}
  
/**
   * Deselects a contact from the dropdown and updates the UI accordingly.
   * @param {HTMLElement} option - The dropdown option element representing the contact.
   * @param {string} initials - The initials of the contact to deselect.
   * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
   * @param {string} contactName - The name of the contact to deselect.
   * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
   * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
   */
  
function deselectContact(
    option,
    initials,
    selectedContainer,
    contactName,
    selectIcon,
    selectedIcon
  ) {
    option.classList.remove("selected");
    option.style.backgroundColor = "";
    option.style.color = "";
    removeInitialFromSelected(initials, selectedContainer);
    selectedMembers = selectedMembers.filter((member) => member !== contactName);
  
    toggleIcons(selectIcon, selectedIcon, false);
}
  
/**
   * Toggles the visibility of select and selected icons based on the selection state.
   * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
   * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
   * @param {boolean} isSelected - Indicates whether the contact is selected (`true`) or not (`false`).
   */
  
function toggleIcons(selectIcon, selectedIcon, isSelected) {
    if (isSelected) {
      selectIcon.classList.remove("icon-visible");
      selectIcon.classList.add("icon-hidden");
      selectedIcon.classList.remove("icon-hidden");
      selectedIcon.classList.add("icon-visible");
    } else {
      selectIcon.classList.remove("icon-hidden");
      selectIcon.classList.add("icon-visible");
      selectedIcon.classList.remove("icon-visible");
      selectedIcon.classList.add("icon-hidden");
    }
}
  
/**
   * Adds a contact's initials to the selected container with the specified background color.
   * @param {string} initials - The initials of the contact to add.
   * @param {string} color - The background color associated with the contact.
   * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
   */
  
function addInitialToSelected(initials, color, selectedContainer) {
    const span = document.createElement("span");
    span.className = "selected-contact-initials";
    span.textContent = initials;
    span.style.backgroundColor = color;
    selectedContainer.appendChild(span);
}
  
/**
   * Removes a contact's initials from the selected container.
   * @param {string} initials - The initials of the contact to remove.
   * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
   */
  
function removeInitialFromSelected(initials, selectedContainer) {
    const spans = selectedContainer.querySelectorAll(
      ".selected-contact-initials"
    );
    spans.forEach((span) => {
      if (span.textContent === initials) {
        span.remove();
      }
    });
}
  
/**
   * Filters tasks on the board based on the search input value.
   */
  
function filterTasks() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", () => {
      const searchTerm = searchInput.value.toLowerCase();
      document.querySelectorAll(".task-card").forEach((task) => {
        const title = task.querySelector("h3").textContent.toLowerCase();
        const description = task.querySelector("p")?.textContent.toLowerCase() || "";
        const matches = title.includes(searchTerm) || description.includes(searchTerm);
        task.style.display = matches ? "block" : "none";
      });
      document.querySelectorAll(".board-column").forEach((column) => {
        const tasksContainer = column.querySelector(".tasks-container");
        const noTasksMessage = column.querySelector(".no-tasks");
        const visibleTasks = tasksContainer.querySelectorAll(".task-card:not([style*='display: none'])");
        noTasksMessage.style.display = visibleTasks.length ? "none" : "block";
      });
    });
}
filterTasks();
  
/**
   * Saves a task to Firebase and updates the board.
   * @param {Object} task - The task object to save.
   */
  
function saveTaskToFirebase(task) {
    const taskId = firebase.database().ref("/tasks").push().key;
    task.id = taskId;
    firebase
      .database()
      .ref(`/tasks/${taskId}`)
      .set(task)
      .then(() => {
        console.log("Task successfully saved!");
        updateTaskOnBoard(taskId, task);
      })
      .catch((error) => console.error("Error saving task:", error));
}
  
/**
   * Updates the appearance of priority buttons based on the selected priority.
   */
  
function updatePriorityButtons() {
    document.querySelectorAll(".priority-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.priority === selectedPriority);
      const icon = btn.querySelector(".priority-icon");
      if (icon) {
        icon.style.filter =
          btn.dataset.priority === selectedPriority
            ? "brightness(0) invert(1)"
            : "none";
      }
    });
}
  
/**
   * Sets up event listeners for selecting contacts in the dropdown.
   */
  
function setupContactsSelection() {
    document
      .querySelectorAll("#taskAssignedOptions .dropdown-option")
      .forEach((option) => {
        option.addEventListener("click", () => {
          selectedMembers.push(option.dataset.value);
          updateSelectedMembers();
        });
      });
}
  
/**
   * Selects a contact from the dropdown and updates the UI accordingly.
   * @param {HTMLElement} option - The dropdown option element representing the contact.
   * @param {string} initials - The initials of the selected contact.
   * @param {string} color - The background color associated with the selected contact.
   * @param {HTMLElement} selectedContainer - The container where selected contacts are displayed.
   * @param {string} contactName - The name of the selected contact.
   * @param {HTMLElement} selectIcon - The icon element representing the unselected state.
   * @param {HTMLElement} selectedIcon - The icon element representing the selected state.
   */
  
function selectContact(option,initials,color,selectedContainer,contactName,selectIcon,selectedIcon) {
    option.classList.add("selected");
    option.style.backgroundColor = "#091931";
    option.style.color = "white";
    addInitialToSelected(initials, color, selectedContainer);
    if (!selectedMembers.includes(contactName)) {
      selectedMembers.push(contactName);
    }
    toggleIcons(selectIcon, selectedIcon, true);
}
  
/**
   * Updates the UI to display the currently selected members.
   */
  
function updateSelectedMembers() {
      const selectedContainer = document.getElementById("selectedContactsContainer");
      selectedContainer.innerHTML = "";
      const maxVisibleContacts = 4;
      selectedMembers.slice(0, maxVisibleContacts).forEach((member) => {
        const initials = getInitials(member);
        const color = getColorForContact(member);
        const span = document.createElement("span");
        span.className = "selected-contact-initials";
        span.textContent = initials;
        span.style.backgroundColor = color;
        selectedContainer.appendChild(span);
      });
}
fetchContacts((contacts) => {
      populateContactsDropdown(Object.values(contacts));
});
    
/**
     * Adds a "more" indicator to the selected contacts container if the total number of selected contacts exceeds the maximum visible limit.
     *
     * @param {number} totalSelected - The total number of selected contacts.
     * @param {number} maxVisibleContacts - The maximum number of contacts to display without showing the "more" indicator.
     * @param {HTMLElement} selectedContainer - The container element where selected contacts are displayed.
     */
  
function addMoreIndicator(
      totalSelected,
      maxVisibleContacts,
      selectedContainer
    ) {
      if (totalSelected > maxVisibleContacts) {
        const remainingCount = totalSelected - maxVisibleContacts;
        const moreSpan = document.createElement("span");
        moreSpan.className = "selected-contact-more";
        moreSpan.textContent = `+${remainingCount}`;
        moreSpan.style.backgroundColor = "#ccc";
        selectedContainer.appendChild(moreSpan);
      }
}

/**
 * Verwaltet die Anzeige der ausgewählten Kontakte in der "Assigned To"-Liste.
 * Wenn mehr als 4 Kontakte ausgewählt sind, werden zusätzliche Kontakte ausgeblendet
 * und eine "+X"-Anzeige wird hinzugefügt, um die Anzahl der versteckten Kontakte darzustellen.
 * Bei weniger oder gleich 4 Kontakten wird die "+X"-Anzeige entfernt.
 */
  
function assignedToUserCounter() {
    if (document.getElementsByClassName("selected-contact-initials").length > 4) {
      for (let i = 4; i < document.getElementsByClassName("selected-contact-initials").length; i++) {
        document.getElementsByClassName("selected-contact-initials")[i].style.display = "none";
        document.getElementsByClassName("numb")[0]?.remove();
        document.getElementById("selectedContactsContainer").innerHTML += `<span class="numb">+${i - 3}</span>`;
      }
    } else {
      document.getElementsByClassName("numb")[0]?.remove();
    }
    assignedToUserCounterDeleteUser();
}
  
/**
 * Stellt sicher, dass die ersten vier ausgewählten Kontakte in der "Assigned To"-Liste wieder sichtbar gemacht werden,
 * wenn einer der Kontakte zuvor ausgeblendet wurde.
 * Die Funktion prüft, ob einer der ersten vier Kontakte ausgeblendet ist, und macht sie wieder sichtbar.
 */

function assignedToUserCounterDeleteUser() {
    if (
      document.getElementsByClassName("selected-contact-initials")[0]?.style.display == "none" ||
      document.getElementsByClassName("selected-contact-initials")[1]?.style.display == "none" ||
      document.getElementsByClassName("selected-contact-initials")[2]?.style.display == "none" ||
      document.getElementsByClassName("selected-contact-initials")[3]?.style.display == "none"
    ) {
      for (let index = 0; index < 4; index++) {
        document.getElementsByClassName("selected-contact-initials")[index].style.display = "flex";
      }
    }
}