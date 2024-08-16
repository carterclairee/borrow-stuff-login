var express = require('express');
var router = express.Router();
const db = require("../model/helper");

/* GET home page. 
//router.get('/', function(req, res, next) {
 // res.send({ title: 'Express' });
//});
*/

//helper
async function getAllItems(){
  const result = await db ("SELECT * FROM Items ORDER BY id ASC;");
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

//post

router.post("/", async (req, res) => {
  console.log("REQ.BODY", req.body);
  const { item, free, belongs_to, borrowed_by } = req.body;

  try {
    await db(
      `INSERT INTO Items (item, free, belongs_to, borrowed_by) VALUES ('${item}', '${free}', '${belongs_to}', '${borrowed_by}');`
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
