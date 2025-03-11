import { timeElement, timeSuffixElement, dateElement } from "./dom-elements.js"

// Update time and date
export function updateTimeAndDate() {
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
