import { defaultSettings } from "./default.js"
import { 
  heroBackground, 
  darkModeCheckbox, 
  customHeroInput, 
  timeFormatRadios, 
  latitudeInput, 
  longitudeInput, 
  temperatureUnitRadios 
} from "./dom-elements.js"
import { showSaveMessage } from "./ui.js"

// Load user settings
export async function loadSettings() {
  try {
    const settings = await browser.storage.sync.get(defaultSettings);

    // Try to get the local image data if it exists
    const localImageData = await browser.storage.local.get("heroImageData");
    
    // Apply settings
    if (localImageData.heroImageData) {
      // If we have local image data, use that
      heroBackground.style.backgroundImage = `url(${localImageData.heroImageData})`;
    } else if (settings.customHero) {
      // If we have a custom URL, use that
      heroBackground.style.backgroundImage = `url(${settings.customHero})`;
    } else {
      // Otherwise use the default hero image with the correct extension URL
      const heroImageUrl = browser.runtime.getURL(settings.heroImage);
      heroBackground.style.backgroundImage = `url(${heroImageUrl})`;
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
    applySettings(defaultSettings);
  }
}

// Apply user settings
export function applySettings(settings) {
  if (settings.darkMode) {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
  
  // Don't set the background image here, as it's handled in loadSettings
}

// Save settings to storage
export async function saveSettings(event) {
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
  
  // Determine which hero image to use for storage
  let heroImage = "public/hero.jpg";
  
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
    showSaveMessage("Settings saved successfully! Reloading page...")
    
    // Close the popup
    settingsPopup.classList.add("hidden")
    
    // Reload the page after a short delay to show the message
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  } catch (error) {
    console.error("Error saving settings:", error)
    // Fallback for local testing
    localStorage.setItem("settings", JSON.stringify(settings))
    showSaveMessage("Settings saved successfully! Reloading page...")
    
    // Close the popup
    settingsPopup.classList.add("hidden")
    
    // Reload the page after a short delay to show the message
    setTimeout(() => {
      window.location.reload()
    }, 1500)
  }
}

// Reset settings to defaults
export async function resetSettings() {
  if (confirm("Are you sure you want to reset all settings to defaults?")) {
    try {
      // Clear the local image data
      await browser.storage.local.remove("heroImageData");
      
      // Save default settings
      await browser.storage.sync.set(defaultSettings);
      
      // Show message and reload
      showSaveMessage("Settings reset to defaults! Reloading page...");
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (error) {
      console.error("Error resetting settings:", error);
      // Fallback for local testing
      localStorage.removeItem("heroImageData");
      localStorage.setItem("settings", JSON.stringify(defaultSettings));
      
      // Show message and reload
      showSaveMessage("Settings reset to defaults! Reloading page...");
      
      // Reload the page after a short delay
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    }
  }
}

// Import from ui.js
import { settingsPopup } from "./dom-elements.js"
