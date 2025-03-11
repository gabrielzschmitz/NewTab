import { 
  addBookmarkPopup, 
  bookmarkForm, 
  showAddBookmarkBtn, 
  editModeToggleButton,
  customHeroFileInput,
  heroBackground
} from "./dom-elements.js"

// Edit Mode Flag
let isEditMode = false

// Get edit mode state
export function getEditMode() {
  return isEditMode
}

// Set edit mode state
export function setEditMode(value) {
  isEditMode = value
  return isEditMode
}

// Toggle Edit Mode
export function toggleEditMode(addDeleteButtonsCallback) {
  // Remove all delete buttons first (clean slate)
  document.querySelectorAll(".delete-bookmark-btn").forEach((btn) => btn.remove())

  if (isEditMode) {
    showAddBookmarkBtn.classList.remove("hidden")
    // Call the callback function instead of directly calling addDeleteButtonsToBookmarks
    if (typeof addDeleteButtonsCallback === 'function') {
      addDeleteButtonsCallback()
    }
  } else {
    showAddBookmarkBtn.classList.add("hidden")
  }
}

// Show the Add Bookmark popup
export function showAddBookmarkForm() {
  addBookmarkPopup.classList.remove("hidden")
  bookmarkForm.reset()
}

// Hide the Add Bookmark popup
export function hideAddBookmarkForm() {
  addBookmarkPopup.classList.add("hidden")
}

// Show save message
export function showSaveMessage(message) {
  const messageElement = document.createElement("div")
  messageElement.className = "save-message"
  messageElement.textContent = message
  messageElement.style.position = "fixed"
  messageElement.style.bottom = "20px"
  messageElement.style.right = "20px"
  messageElement.style.padding = "10px 20px"
  messageElement.style.backgroundColor = "var(--primary-color)"
  messageElement.style.color = "white"
  messageElement.style.borderRadius = "var(--border-radius)"
  messageElement.style.boxShadow = "var(--shadow)"
  messageElement.style.zIndex = "1000"

  document.body.appendChild(messageElement)

  setTimeout(() => {
    messageElement.style.opacity = "0"
    messageElement.style.transition = "opacity 0.5s"

    setTimeout(() => {
      document.body.removeChild(messageElement)
    }, 500)
  }, 3000)
}

// Handle local image selection
export function handleImageSelection(event) {
  if (event.target.files && event.target.files[0]) {
    const file = event.target.files[0];
    const reader = new FileReader();
    
    reader.onload = (e) => {
      // Store the image data URL
      const imageDataUrl = e.target.result;
      
      // Update the hero background with the selected image
      heroBackground.style.backgroundImage = `url(${imageDataUrl})`;
      
      // Store the image data in local storage or browser storage
      browser.storage.local.set({ heroImageData: imageDataUrl })
        .catch(error => {
          console.error("Error saving image data:", error);
          // Fallback for local testing
          localStorage.setItem("heroImageData", imageDataUrl);
        });
    };
    
    reader.readAsDataURL(file);
  }
}
