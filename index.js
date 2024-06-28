import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.open-meteo.com/v1/forecast";
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

    return lat && lon ? { lat, lon } : Promise.reject(new Error("Location not found"));
  } catch (error) {
    throw new Error("Error getting geocoding data ${error.message}");
  }
}

async function getWeather(lat, lon) {
  try {
    const response = await axios.get(API_URL, {
      params: {
        latitude: lat,
        longitude: lon,
        hourly: "temperature",
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Error getting weather data ${error.message}");
  }
}

app.get("/", async (req, res) => {
  const welcomeCities = [
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "New York City", latitude: 40.7128, longitude: -74.006 },
  ];

  try {
    const responses = await axios.get(API_URL, {
      params: {
        latitude: welcomeCities.map((city) => city.latitude).join(","),
        longitude: welcomeCities.map((city) => city.longitude).join(","),
        hourly: "temperature",
      },
    });

    console.log(responses.data, welcomeCities);
    res.render("index.ejs", { weatherData: responses.data, welcomeCities });
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
    res.render("weather", { location, weather: weatherData });
  } catch (error) {
    console.error(error.message);
    res.render("weather", { location, weather: null, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//Get UV Wind speed diretion and send to weather ejs

//As challenge comment code one complete