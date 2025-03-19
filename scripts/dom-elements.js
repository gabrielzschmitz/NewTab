// Polyfill for browser API when running in a standard browser environment
if (typeof browser === "undefined") {
  var browser = chrome || browser
}

// DOM Elements
let timeElement;
let timeSuffixElement;
let dateElement;
let weatherInfoElement;
let bookmarksGridElement;
let heroBackground;
let editModeToggleButton;
let addBookmarkPopup;
let bookmarkForm;
let showAddBookmarkBtn;
let cancelBtn;
let openSettingsBtn;
let settingsPopup;
let closeSettingsBtn;
let settingsForm;
let darkModeCheckbox;
let primaryColorInput;
let secondaryColorInput;
let customHeroInput;
let timeFormatRadios;
let latitudeInput;
let longitudeInput;
let temperatureUnitRadios;
let resetButton;
let resetBookmarksButton;
let selectImageButton;
let customHeroFileInput;
let resetHeroImageButton;

// Initialize DOM elements
export function initDomElements() {
  timeElement = document.getElementById("time")
  timeSuffixElement = document.getElementById("time-suffix")
  dateElement = document.getElementById("date")
  weatherInfoElement = document.getElementById("weather-info")
  bookmarksGridElement = document.getElementById("bookmarks-grid")
  heroBackground = document.querySelector(".hero-background")
  editModeToggleButton = document.getElementById("edit-mode-toggle")

  addBookmarkPopup = document.getElementById("add-bookmark-popup")
  bookmarkForm = document.getElementById("bookmark-form")
  showAddBookmarkBtn = document.getElementById("show-add-bookmark-btn")
  cancelBtn = document.querySelector(".cancel-btn")

  // Settings popup elements
  openSettingsBtn = document.getElementById("open-settings")
  settingsPopup = document.getElementById("settings-popup")
  closeSettingsBtn = document.getElementById("close-settings")
  settingsForm = document.getElementById("settings-form")
  darkModeCheckbox = document.getElementById("dark-mode")
  primaryColorInput = document.getElementById("primary-color")
  secondaryColorInput = document.getElementById("secondary-color")
  customHeroInput = document.getElementById("custom-hero")
  timeFormatRadios = document.getElementsByName("time-format")
  latitudeInput = document.getElementById("latitude")
  longitudeInput = document.getElementById("longitude")
  temperatureUnitRadios = document.getElementsByName("temperature-unit")
  resetButton = document.getElementById("reset-button")
  resetBookmarksButton = document.getElementById("reset-bookmarks-button")
  selectImageButton = document.getElementById("select-image-button")
  customHeroFileInput = document.getElementById("custom-hero-file")
  resetHeroImageButton = document.getElementById("reset-hero-image-button");
}

// Export getters for DOM elements
export { 
  timeElement,
  timeSuffixElement,
  dateElement,
  weatherInfoElement,
  bookmarksGridElement,
  heroBackground,
  editModeToggleButton,
  addBookmarkPopup,
  bookmarkForm,
  showAddBookmarkBtn,
  cancelBtn,
  openSettingsBtn,
  settingsPopup,
  closeSettingsBtn,
  settingsForm,
  darkModeCheckbox,
  primaryColorInput,
  secondaryColorInput,
  customHeroInput,
  timeFormatRadios,
  latitudeInput,
  longitudeInput,
  temperatureUnitRadios,
  resetButton,
  resetBookmarksButton,
  selectImageButton,
  customHeroFileInput,
  resetHeroImageButton
}
