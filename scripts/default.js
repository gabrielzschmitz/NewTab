// Default bookmarks
export const defaultBookmarks = [
  { name: "gmail", url: "https://gmail.com" },
  { name: "drive", url: "https://drive.google.com" },
  { name: "reddit", url: "https://reddit.com" },
  { name: "github", url: "https://github.com" },
  { name: "claude", url: "https://claude.ai" },
  { name: "calendar", url: "https://calendar.google.com" },
  { name: "docs", url: "https://docs.google.com" },
  { name: "youtube", url: "https://youtube.com" },
  { name: "slack", url: "https://slack.com" },
  { name: "gemini", url: "https://gemini.google.com" },
  { name: "keep", url: "https://keep.google.com" },
  { name: "sheets", url: "https://sheets.google.com" },
  { name: "insta", url: "https://instagram.com" },
  { name: "feedly", url: "https://feedly.com" },
  { name: "chatgpt", url: "https://chat.openai.com" },
]

// Default settings
export const defaultSettings = {
  darkMode: false,
  customHero: "",
  timeFormat: "24h",
  temperatureUnit: "celsius",
  weatherLocation: {
    latitude: 40.7128,
    longitude: -74.006,
  },
  heroImage: "public/hero.jpg",
}

// Weather codes mapping
export const weatherCodes = {
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
