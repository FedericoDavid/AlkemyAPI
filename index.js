const express = require("express");
const mysql = require("mysql");
const app = express();
const cors = require("cors");

app.use(express.json());
app.use(cors());

var PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

//MySQL Config
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password411",
  database: "abmsys",
});

// Route
app.get("/", (req, res) => {
  res.send("Welcome to ABM Alkemy API");
});

//All movements
app.get("/movements", (req, res) => {
  const sql = "SELECT * FROM moves";

  db.query(sql, (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      res.json(results);
    } else {
      res.send("Not result");
    }
  });
});

//Movements by ID
app.get("/movements/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT * FROM moves WHERE id = ${id}`;
  db.query(sql, (error, result) => {
    if (error) throw error;

    if (result.length > 0) {
      res.json(result);
    } else {
      res.send("Not result");
    }
  });
});

//Add new move
app.post("/add", (req, res) => {
  const sql = "INSERT INTO moves SET ?";

  const movementObj = {
    concept: req.body.concept,
    amount: req.body.amount,
    date: req.body.date,
    type: req.body.type,
  };

  db.query(sql, movementObj, (error) => {
    if (error) throw error;
    res.send("New movement added");
  });
});

//update movements
app.put("/update/:id", (req, res) => {
  const { id } = req.params;
  const { concept, amount, type, date } = req.body;
  const sql = `UPDATE moves SET concept = '${concept}', amount='${amount}', type='${type}', date='${date}' WHERE id =${id}`;

  db.query(sql, (error) => {
    if (error) throw error;
    res.send("Movement updated!");
  });
});

//delete movements
app.delete("/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM moves WHERE id= ${id}`;

  db.query(sql, (error) => {
    if (error) throw error;
    res.send("Delete movement");
  });
});

// Check connection
db.connect((error) => {
  if (error) throw error;
  console.log("Database running!");
});
