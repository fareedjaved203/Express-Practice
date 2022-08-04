const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs"); //for partials
const requests = require("requests");

const staticPath = path.join(__dirname, "../public");
app.use("/public", express.static(staticPath));

const templatePath = path.join(__dirname, "../templates/views");
const partialPath = path.join(__dirname, "../templates/partials");
//to set view engine
app.set("view engine", "hbs");
app.set("views", templatePath);

hbs.registerPartials(partialPath);

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/about", (req, res) => {
  requests(
    `https://api.openweathermap.org/data/2.5/weather?q=${req.query.name}&appid=5337018fdf305b9742eb18c44ffd2746`
  )
    .on("data", (chunk) => {
      const obj = JSON.parse(chunk);
      const arr = [obj]; //to convert into array of objects as before
      // console.log(
      //   `City Name is ${arr[0].name} And Temperature is ${arr[0].main.temp}`
      // );

      res.write(arr[0].name);
    })
    .on("end", (err) => {
      if (err) return console.log("connection closed due to errors", err);

      res.end();
    });
});
app.get("/about/*", (req, res) => {
  res.render("404", {
    errorComment: "More About page couldn't be Found",
  });
});
app.get("*", (req, res) => {
  //always put at the bottom
  //404 pages
  res.render("404", {
    //404 is the file name
    errorComment: "Page Could Not be Found", //{{errorComment}} used in 404.hbs
  });
});

app.listen(8000, () => {
  console.log("Listening to the port 8000");
});
