/**
 * Manages the display of selected contacts in the "Assigned To" section.
 *
 * - If more than 4 contacts are selected, hides additional contacts and displays a "+N" badge.
 * - If the number of selected contacts is 4 or fewer, ensures the "+N" badge is removed.
 * - Calls `assignedToUserCounterDeleteUser` to update the display if users are removed.
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
   * Ensures that the first 4 selected contacts in the "Assigned To" section are always visible.
   *
   * - Checks if any of the first 4 contacts are hidden.
   * - If a hidden contact is found, makes it visible by setting its `display` property to "flex".
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