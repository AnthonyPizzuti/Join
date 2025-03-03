// Funktion zur Zuweisung von Event-Listenern an die + Buttons
function setupCategoryButtons() {
    const categoryButtons = document.querySelectorAll(".add-task-btn-category"); // Alle Buttons mit der Klasse add-task-btn-category auswählen

    categoryButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const columnType = button.getAttribute("data-type"); // Spalten-Typ ermitteln
            openAddTaskModal(columnType); // Modal mit der Spalte öffnen
        });
    });
}

/**
 * Öffnet das Add Task Modal und initialisiert die Spalte für die neue Aufgabe.
 * @param {string} columnType - Der Typ der Spalte, z. B. "todo", "in-progress", "done".
 */
function openAddTaskModal(columnType) {
    const addTaskModal = document.getElementById("addTaskModal");
    if (!addTaskModal) {
        console.error("Add Task Modal nicht gefunden.");
        return;
    }

    resetAddTaskModal(); // Setzt das Modal zurück

    const taskTypeInput = document.getElementById("taskTypeInput");
    if (taskTypeInput) {
        taskTypeInput.value = columnType; // Spalten-Typ setzen
    }

    addTaskModal.style.display = "block"; // Modal anzeigen
}

// Event-Listener beim Laden der Seite zuweisen
document.addEventListener("DOMContentLoaded", () => {
    setupCategoryButtons(); // Event-Listener für die Buttons setzen
});
