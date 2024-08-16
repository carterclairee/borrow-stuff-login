var express = require('express');
var router = express.Router();
const db = require("../model/helper");

//helper
async function getAllPeople(){
  const result = await db ("SELECT * FROM People ORDER BY id ASC;");
  return result.data;
}

// get all people 

router.get("/", async (req, res) => {
  try {
    console.log("Received request to fetch people");
    const people = await getAllPeople();
    res.send(people);
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
    const people = await getAllPeople();
    res.status(201).send(people);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//delete via ID

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db(`DELETE FROM People WHERE id = ${id};`);
    const people = await getAllPeople();
    res.send(people);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
