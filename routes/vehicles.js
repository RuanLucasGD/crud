var express = require('express');
var router = express.Router();
var ObjectID = require("mongodb").ObjectId;

const db = require('../db');



/* GET users listing. */
router.get('/', async function (req, res, next) {
  const conn = await db.connect();
  const vehicles = conn.collection("vehicles");
  const docs = await vehicles.find().toArray();
  res.send(docs);
});

router.post('/delete', async function (req, res, next) {
  const id = req.body.id;
  const conn = await db.connect();
  const vehicles = conn.collection("vehicles");

  await vehicles.deleteOne({ _id: new ObjectID(id) })

});

router.post('/update', async function (req, res, next) {

  const id = req.body.hiddenId;
  const conn = await db.connect();
  const vehicles = conn.collection("vehicles");

  docs = await vehicles.findOne({ _id: new ObjectID(id) })

  res.render('add', { obj: docs, label: "Atualizar" })
});

router.post('/', async function (req, res, next) {

  const conn = await db.connect();
  const vehicles = conn.collection("vehicles");
  const name = req.body.name;
  const value = req.body.value;
  const brand = req.body.brand;

  var r = null;

  if (req.body._id) {

    r = await vehicles.updateOne(
      {
        _id: new ObjectID(req.body._id)
      },
      {
        $set: {
          name: name,
          value: value,
          brand: brand
        }
      })
  }
  else {
    r = await vehicles.insertOne({
      name: name,
      value: value,
      brand: brand
    });
  }
  console.log(r);
});



module.exports = router;
