const express = require("express");
const app = express();
const path = require("path");

const { handleBarsHelpers } = require("./helpers");

const { router: waitersRouter } = require("./routes/waiters");
const { router: ordersRouter } = require("./routes/orders");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

PORT = 3000;

// Database
const db = require("./database/db-connector");

// Handlebars
const exphbs = require("express-handlebars");
const { query } = require("express");

// Helper Functions
app.engine(
  ".hbs",
  exphbs({
    extname: ".hbs",
    helpers: handleBarsHelpers,
  })
);
app.set("view engine", ".hbs");

// Static Files
app.use(express.static(path.join(__dirname, "public")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

/*
    ROUTES
*/

// GET ROUTE FOR MAIN PAGE
app.get("/", function (req, res) {
  res.render("index");
});

//GET ROUTE FOR MAIN PAGE
app.get("/index_private", function (req, res) {
  res.render("index_private");
});

// ROUTES FOR WAITERS
app.use("/waiters", waitersRouter);

// ROUTES FOR ORDERS
app.use("/orders", ordersRouter);

// ROUTES FOR CUSTOMERS
app.get("/customers_public", function (req, res) {
  // Declare Query 1
  let query1;

  // If there is a query string, we run the query
  if (req.query.lname != undefined) {
    query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM bsg_planets;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
      // Save the people
      let people = rows;

      // Run the second query
      db.pool.query(query2, (error, rows, fields) => {
        // Save the planets
        let planets = rows;

        // Construct an object for reference in the table
        // Array.map is awesome for doing something with each
        // element of an array.
        let planetmap = {};
        planets.map((planet) => {
          let id = parseInt(planet.id, 10);

          planetmap[id] = planet["name"];
        });

        // Overwrite the homeworld ID with the name of the planet in the people object
        people = people.map((person) => {
          return Object.assign(person, {
            homeworld: planetmap[person.homeworld],
          });
        });

        return res.render("customers_public", {
          data: people,
          planets: planets,
        });
      });
    });
  } else {
    return res.render("customers_public");
  }
});

// ROUTES FOR SHIFTS

app.get("/shifts", function (req, res) {
  // Declare Query 1
  let query1;

  // If there is no query string, we just perform a basic SELECT
  if (req.query.lname === undefined) {
    query1 = "SELECT * FROM bsg_people;";
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`;
  }

  // Query 2 is the same in both cases
  let query2 = "SELECT * FROM bsg_planets;";

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let people = rows;

    // Run the second query
    db.pool.query(query2, (error, rows, fields) => {
      // Save the planets
      let planets = rows;

      // Construct an object for reference in the table
      // Array.map is awesome for doing something with each
      // element of an array.
      let planetmap = {};
      planets.map((planet) => {
        let id = parseInt(planet.id, 10);

        planetmap[id] = planet["name"];
      });

      // Overwrite the homeworld ID with the name of the planet in the people object
      people = people.map((person) => {
        return Object.assign(person, {
          homeworld: planetmap[person.homeworld],
        });
      });

      return res.render("shifts", { data: people, planets: planets });
    });
  });
});

// ROUTE FOR CUSTOMERS EMPLOYEE ONLY

app.get("/customers_private", function (req, res) {
  // Declare Query 1
  let query1;

  // If there is no query string, we just perform a basic SELECT
  if (req.query.lname === undefined) {
    query1 = "SELECT * FROM bsg_people;";
  }

  // If there is a query string, we assume this is a search, and return desired results
  else {
    query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`;
  }

  // Query 2 is the same in both cases
  let query2 = "SELECT * FROM bsg_planets;";

  // Run the 1st query
  db.pool.query(query1, function (error, rows, fields) {
    // Save the people
    let people = rows;

    // Run the second query
    db.pool.query(query2, (error, rows, fields) => {
      // Save the planets
      let planets = rows;

      // Construct an object for reference in the table
      // Array.map is awesome for doing something with each
      // element of an array.
      let planetmap = {};
      planets.map((planet) => {
        let id = parseInt(planet.id, 10);

        planetmap[id] = planet["name"];
      });

      // Overwrite the homeworld ID with the name of the planet in the people object
      people = people.map((person) => {
        return Object.assign(person, {
          homeworld: planetmap[person.homeworld],
        });
      });

      return res.render("customers_private", {
        data: people,
        planets: planets,
      });
    });
  });
});

// ROUTE FOR MENU ITEMS---------------------------------------------------------------------------------------------------------------

app.get("/menu_items", function (req, res) {
  // Declare Query 1
  let query1;

  // If there is a query string, we run the query
  if (req.query.lname != undefined) {
    query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM bsg_planets;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
      // Save the people
      let people = rows;

      // Run the second query
      db.pool.query(query2, (error, rows, fields) => {
        // Save the planets
        let planets = rows;

        // Construct an object for reference in the table
        // Array.map is awesome for doing something with each
        // element of an array.
        let planetmap = {};
        planets.map((planet) => {
          let id = parseInt(planet.id, 10);

          planetmap[id] = planet["name"];
        });

        // Overwrite the homeworld ID with the name of the planet in the people object
        people = people.map((person) => {
          return Object.assign(person, {
            homeworld: planetmap[person.homeworld],
          });
        });

        return res.render("menu_items", { data: people, planets: planets });
      });
    });
  } else {
    query1 = `SELECT * FROM bsg_people WHERE lname LIKE "${req.query.lname}%"`;

    // Query 2 is the same in both cases
    let query2 = "SELECT * FROM bsg_planets;";

    // Run the 1st query
    db.pool.query(query1, function (error, rows, fields) {
      // Save the people
      let people = rows;

      // Run the second query
      db.pool.query(query2, (error, rows, fields) => {
        // Save the planets
        let planets = rows;

        // Construct an object for reference in the table
        // Array.map is awesome for doing something with each
        // element of an array.
        let planetmap = {};
        planets.map((planet) => {
          let id = parseInt(planet.id, 10);

          planetmap[id] = planet["name"];
        });

        // Overwrite the homeworld ID with the name of the planet in the people object
        people = people.map((person) => {
          return Object.assign(person, {
            homeworld: planetmap[person.homeworld],
          });
        });

        return res.render("menu_items", { planets: planets });
      });
    });
  }
});

/*
    LISTENER
*/
app.listen(PORT, function () {
  console.log(
    "Express started on http://localhost:" +
      PORT +
      "; press Ctrl-C to terminate."
  );
});
