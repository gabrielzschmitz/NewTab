import { defaultBookmarks } from "./default.js"
import { 
  initDomElements,
  bookmarkForm, 
  showAddBookmarkBtn, 
  cancelBtn, 
  editModeToggleButton,
  openSettingsBtn,
  settingsPopup,
  closeSettingsBtn,
  settingsForm,
  darkModeCheckbox,
  resetButton,
  resetBookmarksButton,
  selectImageButton,
  customHeroFileInput,
  resetHeroImageButton
} from "./dom-elements.js"
import { 
  loadBookmarks, 
  addNewBookmark, 
  addDeleteButtonsToBookmarks, 
  resetBookmarks 
} from "./bookmarks.js"
import { updateTimeAndDate } from "./time.js"
import { updateWeather } from "./weather.js"
import { 
  loadSettings, 
  applySettings, 
  saveSettings, 
  resetSettings,
  initializeResetHeroImage
} from "./settings.js"
import { 
  getEditMode,
  setEditMode,
  toggleEditMode, 
  showAddBookmarkForm, 
  hideAddBookmarkForm,
  handleImageSelection
} from "./ui.js"

// Initialize the extension
async function init() {
  // Initialize DOM elements first
  initDomElements()
  
  // Then proceed with the rest of the initialization
  await loadSettings()
  updateTimeAndDate()
  loadBookmarks()
  updateWeather()

  // Set up event listeners
  setupEventListeners()

  // Update time every second
  setInterval(updateTimeAndDate, 1000)

  // Update weather every 30 minutes
  setInterval(updateWeather, 30 * 60 * 1000)
}

// Set up all event listeners
function setupEventListeners() {
  // Toggle Edit Mode
  editModeToggleButton.addEventListener("click", () => {
    const newEditMode = !getEditMode()
    setEditMode(newEditMode)
    toggleEditMode(addDeleteButtonsToBookmarks)
    editModeToggleButton.textContent = newEditMode ? "exit edit mode" : "edit mode"
  })

  // Add Bookmark form submit handler
  bookmarkForm.addEventListener("submit", (e) => {
    e.preventDefault()
    addNewBookmark()
  })

  // "Add Bookmark" button triggers the popup
  showAddBookmarkBtn.addEventListener("click", showAddBookmarkForm)

  // "Cancel" button closes the popup
  cancelBtn.addEventListener("click", hideAddBookmarkForm)

  // Settings popup functionality
  openSettingsBtn.addEventListener("click", (e) => {
    e.preventDefault()
    settingsPopup.classList.remove("hidden")
  })

  closeSettingsBtn.addEventListener("click", () => {
    settingsPopup.classList.add("hidden")
  })

  // Save settings when the form is submitted
  settingsForm.addEventListener("submit", saveSettings)

  // Reset settings when the reset button is clicked
  resetButton.addEventListener("click", resetSettings)

  // Reset bookmarks to default settings
  resetBookmarksButton.addEventListener("click", resetBookmarks)
  resetHeroImageButton.addEventListener("click", initializeResetHeroImage)

  // Handle local image selection
  selectImageButton.addEventListener("click", () => {
    customHeroFileInput.click()
  })

  customHeroFileInput.addEventListener("change", handleImageSelection)

  // Apply dark mode toggle in real-time
  darkModeCheckbox.addEventListener("change", async () => {
    const newDarkMode = darkModeCheckbox.checked

    const result = await browser.storage.sync.get({
      timeFormat: "24h",
      temperatureUnit: "celsius",
      darkMode: false,
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      heroImage: "public/hero.jpg",
    })

    const newSettings = {
      ...result,
      darkMode: newDarkMode,
    }

    await browser.storage.sync.set(newSettings)
    applySettings(newSettings) // Apply immediately after change
  })

  // Close settings popup when clicking outside
  window.addEventListener("click", (event) => {
    if (event.target === settingsPopup) {
      settingsPopup.classList.add("hidden")
    }
  })
}

// Initialize the extension when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", init)
