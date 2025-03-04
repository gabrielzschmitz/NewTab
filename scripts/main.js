import { defaultBookmarks } from "./default.js"

// Polyfill for browser API when running in a standard browser environment
if (typeof browser === "undefined") {
  var browser = chrome || browser
}

// DOM Elements
const timeElement = document.getElementById("time")
const timeSuffixElement = document.getElementById("time-suffix")
const dateElement = document.getElementById("date")
const weatherInfoElement = document.getElementById("weather-info")
const bookmarksGridElement = document.getElementById("bookmarks-grid")
const heroBackground = document.querySelector(".hero-background")
const editModeToggleButton = document.getElementById("edit-mode-toggle")

const addBookmarkPopup = document.getElementById("add-bookmark-popup")
const bookmarkForm = document.getElementById("bookmark-form")
const showAddBookmarkBtn = document.getElementById("show-add-bookmark-btn")
const cancelBtn = document.querySelector(".cancel-btn")

// Settings popup elements
const openSettingsBtn = document.getElementById("open-settings")
const settingsPopup = document.getElementById("settings-popup")
const closeSettingsBtn = document.getElementById("close-settings")
const settingsForm = document.getElementById("settings-form")
const darkModeCheckbox = document.getElementById("dark-mode")
const primaryColorInput = document.getElementById("primary-color")
const secondaryColorInput = document.getElementById("secondary-color")
const customHeroInput = document.getElementById("custom-hero")
const timeFormatRadios = document.getElementsByName("time-format")
const latitudeInput = document.getElementById("latitude")
const longitudeInput = document.getElementById("longitude")
const temperatureUnitRadios = document.getElementsByName("temperature-unit")
const resetButton = document.getElementById("reset-button")
const resetBookmarksButton = document.getElementById("reset-bookmarks-button")

// Edit Mode Flag
let isEditMode = false

// Initial state - hide the Add Bookmark button
showAddBookmarkBtn.classList.add("hidden")

// Toggle Edit Mode
editModeToggleButton.addEventListener("click", () => {
  isEditMode = !isEditMode
  toggleEditMode()

  editModeToggleButton.textContent = isEditMode ? "exit edit mode" : "edit mode"
})

// Toggle Edit Mode (Add/Delete Bookmarks + Add Bookmark Button)
function toggleEditMode() {
  // Remove all delete buttons first (clean slate)
  document.querySelectorAll(".delete-bookmark-btn").forEach((btn) => btn.remove())

  if (isEditMode) {
    showAddBookmarkBtn.classList.remove("hidden")
    addDeleteButtonsToBookmarks()
  } else {
    showAddBookmarkBtn.classList.add("hidden")
  }
}

// Show the Add Bookmark popup
function showAddBookmarkForm() {
  addBookmarkPopup.classList.remove("hidden")
  bookmarkForm.reset()
}

// Hide the Add Bookmark popup
function hideAddBookmarkForm() {
  addBookmarkPopup.classList.add("hidden")
}

// Add Bookmark form submit handler
bookmarkForm.addEventListener("submit", (e) => {
  e.preventDefault()
  addNewBookmark()
})

// "Add Bookmark" button triggers the popup
showAddBookmarkBtn.addEventListener("click", showAddBookmarkForm)

// "Cancel" button closes the popup
cancelBtn.addEventListener("click", hideAddBookmarkForm)

function addDeleteButtonsToBookmarks() {
  const bookmarkElements = document.querySelectorAll(".bookmark")

  bookmarkElements.forEach((bookmark) => {
    const deleteButton = document.createElement("button")
    deleteButton.className = "delete-bookmark-btn"
    deleteButton.textContent = "-"
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault()
      removeBookmark(bookmark)
    })
    bookmark.appendChild(deleteButton)
  })
}

// Remove Bookmark from the Grid
function removeBookmark(bookmarkElement) {
  const bookmarkName = bookmarkElement.textContent.replace("-", "").trim()
  const bookmarkUrl = bookmarkElement.href

  browser.storage.sync.get("bookmarks", async (result) => {
    const bookmarks = result.bookmarks || defaultBookmarks
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.name !== bookmarkName && bookmark.url !== bookmarkUrl,
    )

    await browser.storage.sync.set({ bookmarks: updatedBookmarks })

    // Re-render bookmarks
    renderBookmarks(updatedBookmarks)

    // After re-render, reapply delete buttons if still in edit mode
    if (isEditMode) {
      addDeleteButtonsToBookmarks()
    }
  })
}

// Add New Bookmark logic
function addNewBookmark() {
  const name = document.getElementById("new-bookmark-name").value.trim()
  const url = document.getElementById("new-bookmark-url").value.trim()

  if (!name || !url) {
    alert("Please fill both fields.")
    return
  }

  let formattedUrl = url
  if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://")) {
    formattedUrl = "https://" + formattedUrl
  }

  const newBookmark = { name, url: formattedUrl }

  browser.storage.sync.get("bookmarks", async (result) => {
    const bookmarks = result.bookmarks || []
    bookmarks.push(newBookmark)
    await browser.storage.sync.set({ bookmarks })
    renderBookmarks(bookmarks)

    hideAddBookmarkForm() // Close the popup after adding
  })
}

// Weather codes mapping
const weatherCodes = {
  0: "clear",
  1: "clear",
  2: "partly cloudy",
  3: "cloudy",
  45: "foggy",
  48: "foggy",
  51: "drizzle",
  53: "drizzle",
  55: "drizzle",
  56: "drizzle",
  57: "drizzle",
  61: "rain",
  63: "rain",
  65: "rain",
  66: "rain",
  67: "rain",
  71: "snow",
  73: "snow",
  75: "snow",
  77: "snow",
  80: "showers",
  81: "showers",
  82: "showers",
  85: "snow",
  86: "snow",
  95: "storm",
  96: "storm",
  99: "storm",
}

// Initialize the extension
async function init() {
  await loadSettings()
  updateTimeAndDate()
  loadBookmarks()
  updateWeather()

  // Update time every second
  setInterval(updateTimeAndDate, 1000)

  // Update weather every 30 minutes
  setInterval(updateWeather, 30 * 60 * 1000)
}

// Load user settings
async function loadSettings() {
  try {
    const settings = await browser.storage.sync.get({
      timeFormat: "24h",
      temperatureUnit: "celsius",
      darkMode: false,
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      heroImage: "public/hero.jpg",
      customHero: "",
    });

    // Try to get the local image data if it exists
    const localImageData = await browser.storage.local.get("heroImageData");
    
    // Apply settings
    if (localImageData.heroImageData) {
      // If we have local image data, use that
      heroBackground.style.backgroundImage = `url(${localImageData.heroImageData})`;
    } else {
      // Otherwise use the hero image from settings
      heroBackground.style.backgroundImage = `url(${settings.heroImage})`;
    }
    
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }

    // Fill settings form
    darkModeCheckbox.checked = settings.darkMode;
    customHeroInput.value = settings.customHero || "";

    // Set time format radio
    for (const radio of timeFormatRadios) {
      if (radio.value === settings.timeFormat) {
        radio.checked = true;
        break;
      }
    }

    // Set location coordinates
    latitudeInput.value = settings.weatherLocation?.latitude || 40.7128;
    longitudeInput.value = settings.weatherLocation?.longitude || -74.006;

    // Set temperature unit radio
    for (const radio of temperatureUnitRadios) {
      if (radio.value === settings.temperatureUnit) {
        radio.checked = true;
        break;
      }
    }
  } catch (error) {
    console.error("Error loading settings:", error);
    // Fallback to default settings if browser.storage is not available
    const settings = {
      timeFormat: "24h",
      temperatureUnit: "celsius",
      darkMode: false,
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      heroImage: "public/hero.jpg",
    };
    applySettings(settings);
  }
}

// Apply user settings
function applySettings(settings) {
  if (settings.darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
  // Don't set the background image here, as it's handled in loadSettings
}

// Update time and date
function updateTimeAndDate() {
  const now = new Date()

  // Get time format from settings
  browser.storage.sync.get({ timeFormat: "24h" }, (result) => {
    const timeFormat = result.timeFormat

    // Format time
    let hours = now.getHours()
    const minutes = String(now.getMinutes()).padStart(2, "0")

    if (timeFormat === "12h") {
      // 12-hour format
      const ampm = hours >= 12 ? "pm" : "am"
      hours = hours % 12
      hours = hours ? hours : 12
      timeElement.textContent = `${hours}:${minutes}`
      timeSuffixElement.textContent = ampm
    } else {
      // 24-hour format
      timeElement.textContent = `${String(hours).padStart(2, "0")}:${minutes}`
      timeSuffixElement.textContent = ""
    }
  })

  // Format date (e.g., "3.3 monday")
  const day = now.getDate()
  const month = now.getMonth() + 1
  const weekday = now.toLocaleDateString("en-US", { weekday: "long" }).toLowerCase()

  dateElement.textContent = `${month}.${day} ${weekday}`
}

// Load bookmarks
async function loadBookmarks() {
  let bookmarks

  try {
    const result = await browser.storage.sync.get("bookmarks")
    bookmarks = result.bookmarks || defaultBookmarks
  } catch (error) {
    console.error("Error loading bookmarks:", error)
    bookmarks = defaultBookmarks
  }

  renderBookmarks(bookmarks)
}

// Render bookmarks
function renderBookmarks(bookmarks) {
  bookmarksGridElement.innerHTML = ""

  bookmarks.forEach((bookmark) => {
    const bookmarkElement = document.createElement("a")
    bookmarkElement.href = bookmark.url
    bookmarkElement.className = "bookmark"
    bookmarkElement.textContent = bookmark.name

    bookmarksGridElement.appendChild(bookmarkElement)
  })

  // If in edit mode, add delete buttons
  if (isEditMode) {
    addDeleteButtonsToBookmarks()
  }
}

// Update weather information
async function updateWeather() {
  let settings

  try {
    settings = await browser.storage.sync.get({
      temperatureUnit: "celsius",
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    })
  } catch (error) {
    console.error("Error loading weather settings:", error)
    settings = {
      temperatureUnit: "celsius",
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
    }
  }

  try {
    const lat = settings.weatherLocation.latitude
    const lon = settings.weatherLocation.longitude
    const units = settings.temperatureUnit === "celsius" ? "celsius" : "fahrenheit"

    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&temperature_unit=${units}`,
    )

    if (!response.ok) {
      throw new Error("Weather API error")
    }

    const data = await response.json()

    const temp = Math.round(data.current.temperature_2m)
    const weatherCode = data.current.weather_code
    const weatherDesc = weatherCodes[weatherCode] || "clear"

    weatherInfoElement.textContent = `${temp}° ${weatherDesc}`
  } catch (error) {
    console.error("Error fetching weather:", error)
    weatherInfoElement.textContent = "--° clear"
  }
}

// Settings popup functionality
openSettingsBtn.addEventListener("click", (e) => {
  e.preventDefault()
  settingsPopup.classList.remove("hidden")
})

closeSettingsBtn.addEventListener("click", () => {
  settingsPopup.classList.add("hidden")
})

// Save settings when the form is submitted
settingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // Get selected time format
  let timeFormat = "24h";
  for (const radio of timeFormatRadios) {
    if (radio.checked) {
      timeFormat = radio.value;
      break;
    }
  }

  // Get selected temperature unit
  let temperatureUnit = "celsius";
  for (const radio of temperatureUnitRadios) {
    if (radio.checked) {
      temperatureUnit = radio.value;
      break;
    }
  }

  // Get location coordinates
  const latitude = Number.parseFloat(latitudeInput.value) || 40.7128;
  const longitude = Number.parseFloat(longitudeInput.value) || -74.006;

  // Get custom hero image
  const customHero = customHeroInput.value.trim();
  
  // Determine which hero image to use
  let heroImage = "public/hero.jpg";
  
  // Check if we have a local image
  const localImageData = await browser.storage.local.get("heroImageData")
    .catch(() => ({ heroImageData: localStorage.getItem("heroImageData") }));
  
  if (localImageData.heroImageData) {
    // If we have a local image, use that
    heroImage = localImageData.heroImageData;
  } else if (customHero) {
    // Otherwise, if we have a custom URL, use that
    heroImage = customHero;
  }

  // Create settings object
  const settings = {
    darkMode: darkModeCheckbox.checked,
    timeFormat: timeFormat,
    temperatureUnit: temperatureUnit,
    weatherLocation: {
      latitude: latitude,
      longitude: longitude,
    },
    heroImage: heroImage,
    customHero: customHero,
  };

  try {
    // Save settings to storage
    await browser.storage.sync.set(settings);
    showSaveMessage("Settings saved successfully!");
    
    // Update the hero background
    if (localImageData.heroImageData) {
      heroBackground.style.backgroundImage = `url(${localImageData.heroImageData})`;
    } else if (customHero) {
      heroBackground.style.backgroundImage = `url(${customHero})`;
    } else {
      heroBackground.style.backgroundImage = `url(public/hero.jpg)`;
    }
    
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    
    settingsPopup.classList.add("hidden"); // Close the popup after saving
  } catch (error) {
    console.error("Error saving settings:", error);
    // Fallback for local testing
    localStorage.setItem("settings", JSON.stringify(settings));
    showSaveMessage("Settings saved successfully! (local storage)");
    
    // Update the hero background
    if (localImageData.heroImageData) {
      heroBackground.style.backgroundImage = `url(${localImageData.heroImageData})`;
    } else if (customHero) {
      heroBackground.style.backgroundImage = `url(${customHero})`;
    } else {
      heroBackground.style.backgroundImage = `url(public/hero.jpg)`;
    }
    
    if (settings.darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
    
    settingsPopup.classList.add("hidden"); // Close the popup after saving
  }
});

// Reset settings when the reset button is clicked
resetButton.addEventListener("click", resetSettings)

// Reset bookmarks to default settings
resetBookmarksButton.addEventListener("click", resetBookmarks)

// Add the file input handler after the settings form event listeners
// Add this after the resetBookmarksButton event listener

// Handle local image selection
const selectImageButton = document.getElementById("select-image-button");
const customHeroFileInput = document.getElementById("custom-hero-file");

selectImageButton.addEventListener("click", () => {
  customHeroFileInput.click();
});

customHeroFileInput.addEventListener("change", (event) => {
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
});

// Save settings to storage
async function saveSettings(event) {
  event.preventDefault()

  // Get selected time format
  let timeFormat = "24h"
  for (const radio of timeFormatRadios) {
    if (radio.checked) {
      timeFormat = radio.value
      break
    }
  }

  // Get selected temperature unit
  let temperatureUnit = "celsius"
  for (const radio of temperatureUnitRadios) {
    if (radio.checked) {
      temperatureUnit = radio.value
      break
    }
  }

  // Get location coordinates
  const latitude = Number.parseFloat(latitudeInput.value) || 40.7128
  const longitude = Number.parseFloat(longitudeInput.value) || -74.006

  // Get custom hero image
  const customHero = customHeroInput.value.trim()
  const heroImage = customHero || "public/hero.jpg"

  // Create settings object
  const settings = {
    darkMode: darkModeCheckbox.checked,
    customHero: customHero,
    timeFormat: timeFormat,
    temperatureUnit: temperatureUnit,
    weatherLocation: {
      latitude: latitude,
      longitude: longitude,
    },
    heroImage: heroImage,
  }

  try {
    // Save settings to storage
    await browser.storage.sync.set(settings)
    showSaveMessage("Settings saved successfully!")
    applySettings(settings)
  } catch (error) {
    console.error("Error saving settings:", error)
    // Fallback for local testing
    localStorage.setItem("settings", JSON.stringify(settings))
    showSaveMessage("Settings saved successfully! (local storage)")
    applySettings(settings)
  }
}

// Reset settings to defaults
async function resetSettings() {
  if (confirm("Are you sure you want to reset all settings to defaults?")) {
    const defaultSettings = {
      darkMode: false,
      customHero: "",
      timeFormat: "24h",
      temperatureUnit: "celsius",
      weatherLocation: {
        latitude: 40.7128,
        longitude: -74.006,
      },
      heroImage: "public/hero.jpg",
    };

    try {
      // Clear the local image data
      await browser.storage.local.remove("heroImageData");
      
      // Save default settings
      await browser.storage.sync.set(defaultSettings);
      
      // Update the UI
      heroBackground.style.backgroundImage = `url(public/hero.jpg)`;
      loadSettings();
      showSaveMessage("Settings reset to defaults!");
    } catch (error) {
      console.error("Error resetting settings:", error);
      // Fallback for local testing
      localStorage.removeItem("heroImageData");
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      
      // Update the UI
      heroBackground.style.backgroundImage = `url(public/hero.jpg)`;
      loadSettings();
      showSaveMessage("Settings reset to defaults! (local storage)");
    }
  }
}

// Reset bookmarks to default settings
async function resetBookmarks() {
  if (confirm("Are you sure you want to reset all bookmarks to defaults?")) {
    try {
      // Save default bookmarks to storage
      await browser.storage.sync.set({ bookmarks: defaultBookmarks })
      showSaveMessage("Bookmarks reset to defaults!")
      renderBookmarks(defaultBookmarks) // Update the UI with the default bookmarks
    } catch (error) {
      console.error("Error resetting bookmarks:", error)
      // Fallback for local testing
      localStorage.setItem("bookmarks", JSON.stringify(defaultBookmarks))
      showSaveMessage("Bookmarks reset to defaults! (local storage)")
      renderBookmarks(defaultBookmarks) // Update the UI with the default bookmarks
    }
  }
}

// Show save message
function showSaveMessage(message) {
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

// Apply dark mode toggle in real-time
darkModeCheckbox.addEventListener("change", async () => {
  const newDarkMode = darkModeCheckbox.checked;

  const result = await browser.storage.sync.get({
    timeFormat: "24h",
    temperatureUnit: "celsius",
    darkMode: false,
    weatherLocation: {
      latitude: 40.7128,
      longitude: -74.006,
    },
    heroImage: "public/hero.jpg",
  });

  const newSettings = {
    ...result,
    darkMode: newDarkMode,
  };

  await browser.storage.sync.set(newSettings);
  applySettings(newSettings); // Apply immediately after change
});

// Close settings popup when clicking outside
window.addEventListener("click", (event) => {
  if (event.target === settingsPopup) {
    settingsPopup.classList.add("hidden")
  }
})

// Initialize the extension
document.addEventListener("DOMContentLoaded", init)
