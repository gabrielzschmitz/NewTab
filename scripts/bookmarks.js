import { defaultBookmarks } from "./default.js"
import { bookmarksGridElement } from "./dom-elements.js"
import { getEditMode, showSaveMessage, hideAddBookmarkForm } from "./ui.js"

// Add delete buttons to bookmarks
export function addDeleteButtonsToBookmarks() {
  // First, remove any existing delete buttons to avoid duplicates
  document.querySelectorAll(".delete-bookmark-btn").forEach((btn) => btn.remove())
  
  // Then add fresh delete buttons to all bookmarks
  const bookmarkElements = document.querySelectorAll(".bookmark")

  bookmarkElements.forEach((bookmark) => {
    const deleteButton = document.createElement("button")
    deleteButton.className = "delete-bookmark-btn"
    deleteButton.textContent = "-"
    deleteButton.addEventListener("click", (event) => {
      event.preventDefault()
      event.stopPropagation()
      removeBookmark(bookmark)
    })
    bookmark.appendChild(deleteButton)
  })
}

// Load bookmarks
export async function loadBookmarks() {
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
export function renderBookmarks(bookmarks) {
  bookmarksGridElement.innerHTML = ""

  bookmarks.forEach((bookmark) => {
    const bookmarkElement = document.createElement("a")
    bookmarkElement.href = bookmark.url
    bookmarkElement.className = "bookmark"
    bookmarkElement.textContent = bookmark.name

    bookmarksGridElement.appendChild(bookmarkElement)
  })

  // If in edit mode, add delete buttons
  if (getEditMode()) {
    addDeleteButtonsToBookmarks()
  }
}

// Add New Bookmark logic
export function addNewBookmark() {
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

// Remove Bookmark from the Grid
export function removeBookmark(bookmarkElement) {
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
    if (getEditMode()) {
      addDeleteButtonsToBookmarks()
    }
  })
}

// Reset bookmarks to default settings
export async function resetBookmarks() {
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
