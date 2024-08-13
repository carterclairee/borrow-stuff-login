var express = require('express');
var router = express.Router();
const db = require("../model/helper");



// get all people 

router.get("/", async (req, res) => {
  try {
    console.log("Received request to fetch people");
    const results = await db("SELECT * FROM People ORDER BY id ASC;");
    res.send(results.data); // Send only the data part
  } catch (error) {
    console.error("Error fetching people:", error); // Log errors to the console
    res.status(500).send({ error: error.message });
  }
});

// get by id 

router.get("/:id", async (req, res) => {
  console.log("REQ.PARAMS", req.params);
  const { id } = req.params; 
  try {
    const results = await db(`SELECT * FROM People WHERE id = ${id};`);

    if (results.data.length === 0) {
      return res.status(404).send({ message: " not found" });
    }

    res.send(results.data[0]); // Send only the first result since ID is unique
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


//post comes here

//INSERT INTO People (first_name, last_name, floor, email) VALUES ("Betty", "Boop", 3, "email");

router.post("/", async (req, res) => {
  console.log("REQ.BODY", req.body);
  const { first_name, last_name, floor, email } = req.body;

  try {
    await db(
      `INSERT INTO People (first_name, last_name, floor, email) VALUES ('${first_name}', '${last_name}', '${floor}', '${email}');`
    );
    const result = await db(
      `SELECT * FROM People WHERE id = LAST_INSERT_ID();`
    );
    
    res.status(201).send(result);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//delete via ID

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const results = await db(`DELETE FROM People WHERE id = ${id};`);
    res.send({ message: "deleted" });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
