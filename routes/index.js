var express = require('express');
var router = express.Router();
const db = require("../model/helper");
const mysql = require("mysql");

/* GET home page. 
//router.get('/', function(req, res, next) {
 // res.send({ title: 'Express' });
//});
*/


//"SELECT * FROM Items ORDER BY id ASC;"

    // SELECT * FROM Items LEFT JOIN People ON Items.belongs_to = People.id;





//helper join to get owner info as well 
async function getAllItems(){
  const result = await db ("SELECT Items.id, Items.item, Items.free, Items.borrowed_by, People.id, People.first_name, People.last_name, People.floor, People.email FROM Items  LEFT JOIN People ON Items.belongs_to = People.id;");
  return result.data;
}

// get all items 

router.get("/", async (req, res) => {
  try {
    console.log("Received request to fetch items");
    const items = await getAllItems();
    res.send(items);
  } catch (error) {
    console.error("Error fetching items:", error); 
    res.status(500).send({ error: error.message });
  }
});

// get by id 

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

//get by search count

//

router.get("/search/:item", async (req, res) => {
  console.log("REQ.PARAMS", req.params);
  const {item } = req.params;
  try{
      const query = `SELECT COUNT (*) as count FROM Items WHERE item = '${item}'`;
      const results = await db(mysql.format(query, [item]));

      if (results.data.length === 0 || results.data[0].count === 0) {
        return res.status(200).send({ count: 0, message: "Item not found" });     
          }

          res.send({ count: results.data[0].count, message: "Item found" });
        } catch (error) {
          res.status(500).send({ error: error.message });
        }
});

//get by search details 

//SELECT * FROM Items LEFT JOIN People ON Items.belongs_to = People.id;

//SELECT Items.id, Items.item, Items.free, Items.borrowed_by, People.id, People.first_name, People.last_name, People.floor, People.email  FROM Items  LEFT JOIN People ON Items.belongs_to = People.id WHERE item = "camera";

router.get("/details/:item", async (req, res) => {
  const { item } = req.params;

  try {
    const query = `SELECT Items.id, Items.item, Items.free, Items.borrowed_by, People.id, People.first_name, People.last_name, People.floor, People.email  FROM Items  LEFT JOIN People ON Items.belongs_to = People.id WHERE item = '${item}'`;
    const results = await db(mysql.format(query, [item]));

    if (results.data.length === 0) {
      return res.status(404).send({ message: "Item not found" });
    }

    res.send(results.data);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});









//post
//INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('camera', true, 1, NULL);

router.post("/", async (req, res) => {
  console.log("REQ.BODY", req.body);
  const { item, free, belongs_to, borrowed_by } = req.body;

  try {
    await db(
      `INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('${item}', true, '${belongs_to}', NULL );`
    );
    
    const items = await getAllItems();
    res.status(201).send(items);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

//patch




//delete via ID

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
