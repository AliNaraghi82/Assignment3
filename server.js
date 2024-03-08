/********************************************************************************
 *  WEB322 – Assignment 04
 *
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *
 *  https://www.senecacollege.ca/about/policies/academic-integrity-policy.html
 *
 *  Name:Ali Naraghi  Student ID:123747222  Date:Mar.8.2024
 *  Published URL:https://misty-pink-dugong.cyclic.app
 *
 ********************************************************************************/

const express = require("express");
const unCountryData = require("./Modules/unCountries");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "views");

function onHttpStart() {
  console.log("Express http server listening on: " + HTTP_PORT);
}

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/un/countries", async (req, res) => {
  try {
    const { region } = req.query;
    if (region) {
      const countriesByRegion = await unCountryData.getCountriesByRegion(
        region
      );
      res.render("countries", { countries: countriesByRegion });
    } else {
      const allCountries = await unCountryData.getAllCountries();
      res.render("countries", { countries: allCountries });
    }
  } catch (err) {
    res
      .status(404)
      .render("404", {
        message: "The region you are looking for is not available.",
      });
  }
});

app.get("/un/countries/:a2code", async (req, res) => {
  try {
    const country = await unCountryData.getCountryByCode(req.params.a2code);
    if (country) {
      res.render("country", { country });
    } else {
      throw new Error("Country not found");
    }
  } catch (err) {
    res
      .status(404)
      .render("404", {
        message: "The country you are looking for is not available.",
      })();
  }
});

app.use((req, res) => {
  res.status(404).render("404", {
    message: "I'm sorry, we're unable to find what you're looking for",
  });
});

unCountryData
  .initialize()
  .then(() => {
    app.listen(HTTP_PORT, onHttpStart);
  })
  .catch((err) => {
    console.error("Error initializing data service: ", err);
  });
