var express = require('express');
var router = express.Router();
const db = require("../model/helper");

//helper
async function getAllPeople(){
  const result = await db ("SELECT * FROM People ORDER BY id ASC;");
  return result.data;
}

// Escape function 
//function escape(value) {
  //return mysql.escape(value);
//}


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

// get by id   add all the info from Items

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
/*
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

*/



// POST to search for a person by email
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
    
    await db('BEGIN;');
    await db(`UPDATE Items SET free = true, borrowed_by = NULL WHERE borrowed_by = '${id}'`);
    await db(`DELETE FROM Items WHERE belongs_to = '${id}'`);
    await db(`DELETE FROM People WHERE id = '${id}'`);
    await db('COMMIT;');
     res.status(204).send(); 
  } catch (error) {
    await db('ROLLBACK;'); 
    console.error("Error deleting user:", error);
    res.status(500).send({ error: "Failed to delete user and update items" });
  }
});






module.exports = router;
