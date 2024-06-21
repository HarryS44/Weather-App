import axios from "axios";
import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_URL = "https://api.open-meteo.com/v1/forecast";

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.get("/forecast", (req, res) => {
 const location = req.body.location;
 res.render("index.ejs")
 console.log(location)
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});