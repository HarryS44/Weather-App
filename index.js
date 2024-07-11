import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

const Geocoding_API_URL = "https://nominatim.openstreetmap.org/search";

const welcomeCities = [
  { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
  { name: "New York City", latitude: 40.7128, longitude: -74.006 },
];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function getCoordinates(location) {
  try {
    const response = await axios.get(Geocoding_API_URL, {
      params: {
        q: location,
        format: "json",
        limit: 1,
      },
    });
    const { lat, lon } = response.data?.[0] || {};

    if (!lat || !lon) {
      throw new Error("Location not found");
    }

    return { lat, lon };
  } catch (error) {
    throw new Error(`Error getting geocoding data: ${error.message}`);
  }
}

async function getWeather(lat, lon) {
  const API_URL = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&hourly=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,visibility,wind_speed_10m,wind_direction_10m&daily=temperature_2m_max,temperature_2m_min,uv_index_max&timezone=auto`;

  try {
    const response = await axios.get(API_URL)
    console.log(
      "Weather data response:",
      JSON.stringify(response.data)
    );
    return response.data;
  } catch (error) {
    console.log(`Error fetching weather data: ${error.message}`);
    return null; // Return null in case of error
  }
}

app.get("/", async (req, res) => {
  try {
    const weatherData = await Promise.all(
      welcomeCities.map(async (city) => {
        const response = await getWeather(city.latitude, city.longitude);
        return response;
      })
    );
    console.log(
      "Weather data for welcome cities:",
      JSON.stringify(weatherData, null, 2)
    );
    res.render("index", { weatherData, welcomeCities });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
});

app.post("/forecast", async (req, res) => {
  const location = req.body.location;
  try {
    const coordinates = await getCoordinates(location);
    const weatherData = await getWeather(coordinates.lat, coordinates.lon);
    console.log("Forecast for location:", location, weatherData, coordinates);
    res.render("weather", { location, weatherData });
  } catch (error) {
    console.error(error.message);
    res.render("weather", {
      location,
      weatherData: null,
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
