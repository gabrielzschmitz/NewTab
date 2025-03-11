import { weatherInfoElement } from "./dom-elements.js"
import { weatherCodes } from "./default.js"

// Update weather information
export async function updateWeather() {
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
