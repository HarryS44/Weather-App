import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.open-meteo.com/v1/forecast";

const welcomeCities = [
  { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
  { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
  { name: "New York City", latitude: 40.7128, longitude: -74.0060 }
];

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", async (req, res) => {
  const welcomeCities = [
    { name: "Paris", latitude: 48.8566, longitude: 2.3522 },
    { name: "Tokyo", latitude: 35.6895, longitude: 139.6917 },
    { name: "New York City", latitude: 40.7128, longitude: -74.0060 }
  ];

  try {
    const responses = await axios.get(API_URL, {
      params: {
        latitude: welcomeCities.map(city => city.latitude).join(","),
        longitude: welcomeCities.map(city => city.longitude).join(","),
        hourly: "temperature"
      }
    });

    console.log(responses.data, welcomeCities);
    res.render("index.ejs", { weatherData: responses.data, welcomeCities });
  } catch (error) {
    console.error("Error fetching weather data:", error);
    res.status(500).send("Error fetching weather data");
  }
});



app.get("/forecast", (req, res) => {
  const location = req.query.location;
  res.render("index.ejs", { location });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});