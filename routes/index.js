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

// Get items that are available (free = 1)
router.get("/borrowableItems", userShouldBeLoggedIn, async (req, res) => {
  try {
    const borrowableItems = await db(
      `SELECT i.*, p.first_name, p.last_name FROM items AS i LEFT JOIN people AS p ON p.id = i.belongs_to WHERE free = true;`
    );
    res.status(200).send(borrowableItems.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
})

// Search for items by item name
router.get("/borrowableItems/:item", userShouldBeLoggedIn, async (req, res) => {
  const { item } = req.params;

  try {
    const query = `SELECT Items.* , People.id AS PeopleId, PeopleBorrow.id AS PeopleBorrowId, People.first_name AS first_name_belong, People.last_name AS last_name_belong, PeopleBorrow.first_name AS borrowed_by_first_name, PeopleBorrow.last_name AS borrowed_by_last_name from Items LEFT JOIN People ON Items.belongs_to = People.id LEFT JOIN People AS PeopleBorrow ON Items.borrowed_by = PeopleBorrow.id WHERE Items.item = '${item}'`;
    
    const results = await db(mysql.format(query, [ item ]));

    if (results.data.length === 0) {
      return res.status(404).send({ message: "Items not found" });
    }

    res.status(200).send(results.data);
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
router.put("/return/:id", userShouldBeLoggedIn, async (req, res) => {
  const { id } = req.params; 
 
  try{
    await db (`UPDATE Items SET free = !free, borrowed_by = NULL WHERE id = ${id} AND borrowed_by = ${req.user_id};`);

    // Send list of updated borrowed items
    const items = await db(`SELECT i.*, p.first_name, p.last_name FROM Items AS i LEFT JOIN people AS p ON p.id = i.belongs_to WHERE free = false AND borrowed_by = ${req.user_id};`);

    res.status(200).send(items)
  }
  catch (error) {
  res.status(500).send({ error: error.message });
}
});

// Borrow an item and update the database to mark the item as taken
router.put("/:itemId", userShouldBeLoggedIn, async (req, res) => {
  const { itemId } = req.params; 
  console.log(req.user_id);

  try {
    // if (!req.user_id) {
    //   return res.status(404).send({ error: "Person not found" });
    // }
    // Update the item to set it as borrowed by the user and mark it as not free
    await db(`UPDATE Items SET free = false, borrowed_by = '${req.user_id}' WHERE id = '${itemId}';`);

    const updatedBorrowableItems = await db(
      `SELECT i.*, p.first_name, p.last_name FROM items AS i LEFT JOIN people AS p ON p.id = i.belongs_to WHERE free = true;`
    );

    res.send(updatedBorrowableItems.data); // Send the updated item back to the client
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// delete item via ID
router.delete("/:id", userShouldBeLoggedIn, async (req, res) => {
  const { id } = req.params; 
  try {
    await db(`DELETE FROM Items WHERE id = ${id};`);
    const results = await db(
      `SELECT p.first_name, p.last_name, i.id AS item_id, i.item, i.free, i.borrowed_by FROM people As p LEFT JOIN items AS i ON p.id = i.belongs_to WHERE p.id = ${req.user_id};`
    );
    res.send(results.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
