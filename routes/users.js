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
    const people = await getAllPeople();
    res.send(people);
  } catch (error) {
    console.error("Error fetching people:", error); // Log errors to the console
    res.status(500).send({ error: error.message });
  }
});

// get by people id
router.get("/:id", async (req, res) => {
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

// POST to search for a person by email
// Claire's note: POST chosen vs GET to protect email info, probably?
router.post("/search", async (req, res) => {
  const { email } = req.body;

  try {
    const query = `SELECT * FROM People WHERE email = '${email}'`;
    const results = await db(query);

    if (results.data.length > 0) {
      res.status(200).json(results.data[0]);
    } else {
      res.status(404).send({ error: "Person not found" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// POST to add a new person
router.post("/", async (req, res) => {
  const { first_name, last_name, floor } = req.body;

  try {
    const email = `${first_name}.${last_name}`.toLowerCase() + "@mvp.com";
    
    const insertQuery = `
      INSERT INTO People (first_name, last_name, floor, email)
      VALUES ('${first_name}', '${last_name}', ${floor}, '${email}');
    `;
    
    const result = await db(insertQuery);

    // Retrieve the newly inserted person
    // Claire's note: LAST_INSERT_ID() is mysql function that returns the id of the most recently inserted row in the current session
    const idQuery = `SELECT * FROM People WHERE id = LAST_INSERT_ID()`;
    const newPerson = await db(idQuery);

    res.status(201).json(newPerson.data[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


//delete via ID
/*
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
*/

// I'm moving out 
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    // BEGIN: Ensures that all database operations within the transaction are either completed or rolled back if any part fails
    await db('BEGIN;');
    // Person returns borrowed items on moving out
    await db(`UPDATE Items SET free = true, borrowed_by = NULL WHERE borrowed_by = '${id}'`);
    // Delete person's items
    await db(`DELETE FROM Items WHERE belongs_to = '${id}'`);
    // Finally, delete person
    await db(`DELETE FROM People WHERE id = '${id}'`);
    // COMMIT: permanently save transaction only if all are completed
    await db('COMMIT;');
     res.status(204).send(); 
  } catch (error) {
    // ROLLBACK: if there's an error, none of the changes will be applied
    await db('ROLLBACK;'); 
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Failed to delete user and update items" });
  }
});


module.exports = router;