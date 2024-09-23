var express = require('express');
var router = express.Router();
const db = require("../model/helper");
// jwt for authorization and authentication
var jwt = require("jsonwebtoken");
// guard for login
var userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
require("dotenv").config();
// bcrypt for hashing passwords
var bcrypt = require("bcrypt");
const saltRounds = 10;

const supersecret = process.env.SUPER_SECRET;

//helper
async function getAllPeople(){
  const result = await db ("SELECT * FROM People ORDER BY id ASC;");
  return result.data;
}

// get all people 
router.get("/", userShouldBeLoggedIn, async (req, res) => {
  try {
    const people = await getAllPeople();
    res.send(people);
  } catch (error) {
    console.error("Error fetching people:", error);
    res.status(500).send({ error: error.message });
  }
});

// Login
router.post("/login", async (req, res) => {
  // Login requirements
  const { email, password } = req.body;

  try {
    // Find the user
    const results = await db(
      `SELECT * FROM people WHERE email = "${email}";`
    );
    const user = results.data[0];

    // If the user exists
    if (user) {
      // Grab the user's id for later
      const user_id = user.id;

      // Compare the entered password with the hashed password stored in database
      const correctPassword = await bcrypt.compare(password, user.password);

      if (!correctPassword) throw new Error("Incorrect password");

      // If the password is correct, send a token
      var token = jwt.sign({ user_id }, supersecret);
      res.send({ message: "Login successful; here is your token.", token });
    }
    // If the user doesn't exist, send error message
    else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// POST to add a new person
// Claire's note: this will be the register section. Will use the email as the username. For now, need to reigster via Postman
router.post("/register", async (req, res) => {
  const { first_name, last_name, floor, password } = req.body;

  try {
    const email = `${first_name}.${last_name}`.toLowerCase() + "@mvp.com";

    // Variable to hash password
    const hash = await bcrypt.hash(password, saltRounds);
    
    const insertQuery =
      `INSERT INTO People (first_name, last_name, floor, email, password)
      VALUES ('${first_name}', '${last_name}', ${floor}, '${email}', '${hash}');`
    
    await db(insertQuery);

    // Retrieve the newly inserted person
    // Claire's note: LAST_INSERT_ID() is mysql function that returns the id of the most recently inserted row in the current session. I can't get this to work; it keeps getting stuck several inserts back. I'm going to change it to something a little less suave in the interest of time.
    // const idQuery = `SELECT * FROM people WHERE id = LAST_INSERT_ID();`
    // const newPerson = await db(idQuery);

    // Get the most recently inserted person (the highest id since id is auto-incremented)
    const newPerson = await db(
    "SELECT * FROM people ORDER BY id DESC;"
    );

    res.status(201).send(newPerson.data[0]);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

// Profile to show personalized data...TO BE ADDED TO LATER AS VIEW
router.get("/profile", userShouldBeLoggedIn, async (req, res) => {
  try {
    const results = await db(
      `SELECT first_name FROM people WHERE id = ${req.user_id};`
    );
    // Sending the first name for now...more data to be added when view is decided on
    res.send(results.data[0]);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


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