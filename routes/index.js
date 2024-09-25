var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const mysql = require("mysql");
// For protecting endpoints
var userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
//app.use(express.json());

// Claire's note: full url is http://localhost:4000/api/index

//helper join to get owner info as well 
async function getAllItems(){
  const result = await db ("SELECT Items.id, Items.item, Items.free, Items.borrowed_by, People.id, People.first_name, People.last_name, People.floor, People.email FROM Items  LEFT JOIN People ON Items.belongs_to = People.id;");
  return result.data;
}

// get all items 
router.get("/", async (req, res) => {
  try {
    const items = await getAllItems();
    res.send(items);
  } catch (error) {
    console.error("Error fetching items:", error); 
    res.status(500).send({ error: error.message });
  }
});

// Get items that have been borrowed (free = 0)
router.get("/borrowedItems", userShouldBeLoggedIn, async (req, res) => {
  try {
    const query = `SELECT i.*, p.first_name, p.last_name FROM Items AS i LEFT JOIN people AS p ON p.id = i.belongs_to WHERE free = false AND borrowed_by = ${req.user_id};`;

    const borrowedItems = await db(query);
    res.send(borrowedItems);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


// get item by id 
router.get("/:id", async (req, res) => {
  console.log("REQ.PARAMS", req.params);
  const { id } = req.params; 
  try {
    const results = await db(`SELECT * FROM Items WHERE id = ${id};`);

    if (results.data.length === 0) {
      return res.status(404).send({ message: " not found" });
    }

    res.send(results.data[0]); 
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//get item by search count
router.get("/search/:item", async (req, res) => {
  console.log("REQ.PARAMS", req.params);
  const {item } = req.params;
  try{
      const query = `SELECT COUNT (*) as count FROM Items WHERE item = '${item}'`;
      // Sanitized to thwart sql injection attacks
      const results = await db(mysql.format(query, [item]));

      if (results.data.length === 0 || results.data[0].count === 0) {
        return res.status(200).send({ count: 0, message: "Item not found" });     
          }

          res.send({ count: results.data[0].count, message: "Item found" });
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
});

//get item by search details 

// Claire's note: This one aggregates items if someone has more than one.
router.get("/details/:item", async (req, res) => {
  const { item } = req.params;

  try {
    const query = `SELECT People.id, People.first_name, People.last_name, People.floor, People.email, COUNT(Items.id) as itemCount, '${item}' as item FROM Items LEFT JOIN People ON Items.belongs_to = People.id WHERE item = '${item}' GROUP BY People.id`;
    const results = await db(mysql.format(query, [item]));

    if (results.data.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.send(results.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// Get information about owner and borrower of items
router.get("/borrowableItems/:item", async (req, res) => {
  const { item } = req.params;

  try {
    const query = `SELECT Items.* , People.id AS PeopleId, PeopleBorrow.id AS PeopleBorrowId, People.first_name AS first_name_belong, People.last_name AS last_name_belong, PeopleBorrow.first_name AS borrowed_by_first_name, PeopleBorrow.last_name AS borrowed_by_last_name from Items LEFT JOIN People ON Items.belongs_to = People.id LEFT JOIN People AS PeopleBorrow ON Items.borrowed_by = PeopleBorrow.id WHERE Items.item = '${item}'`;
    const results = await db(mysql.format(query, [ item ]));

    if (results.data.length === 0) {
      return res.status(404).send({ message: "Items not found" });
    }

    res.send(results.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//post a new item
//INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('camera', true, 1, NULL);
// Only posts for logged in user
router.post("/", userShouldBeLoggedIn, async (req, res) => {
  const { item } = req.body;

  try {
    await db(
      `INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('${item}', true, '${req.user_id}', NULL );`
    ); 
    const items = await getAllItems();
    res.status(201).send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//put to return an item
router.put("/return/:id", async (req, res) => {
  const { id } = req.params; 
  console.log("REQ.PARAMS", req.params);
  try{
    await db (`UPDATE Items SET free = !free, borrowed_by = NULL WHERE id = ${id};`);
    const items = await getAllItems();
    res.send(items)
  }
  catch (error) {
  res.status(500).send({ error: error.message });
}
});

// Borrow an item and update the database to mark the item as taken
// Adjust this when authorization is added
router.put("/:id", async (req, res) => {
  const { id } = req.params; 
  const { email } = req.body;  // Extract the user ID from the request body

  if (!email) {
    return res.status(400).send({ error: "Email is required" });
  }

  try {

    const personResult = await db(`SELECT * FROM People WHERE email = '${email}';`);
   
    const personId = personResult.data[0].id
   
    if (!personId) {
      return res.status(404).send({ error: "Person not found" });
    }
    // Update the item to set it as borrowed by the user and mark it as not free
    await db(`UPDATE Items SET free = false, borrowed_by = '${personId}' WHERE id = '${id}';`);
    
    const itemResult = await db(`SELECT * FROM Items WHERE id = '${id}';`);
    const updatedItem = itemResult.data[0];

    res.send(updatedItem); // Send the updated item back to the client
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// delete item via ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db(`DELETE FROM Items WHERE id = ${id};`);
    const items = await getAllItems();
    res.send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});


module.exports = router;
