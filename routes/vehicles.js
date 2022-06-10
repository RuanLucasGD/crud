var express = require('express');
var md5 = require('md5')
var router = express.Router();
var ObjectID = require("mongodb").ObjectId;

const db = require('../db');

router.post('/', async function (req, res, next) {

  const id = req.body.vehicleId;
  const conn = await db.connect();
  const vehicles = await conn.collection("vehicles");

  if (id) {
    const docs = await vehicles.findOne({ _id: new ObjectID(id) });

    res.send(docs);
  } else {
    const docs = await vehicles.find().toArray();
    res.send(docs);
  }
});


router.post('/list', async function (req, res, next) {

  const id = req.body.vehiclesId;
  const conn = await db.connect();
  const vehicles = await conn.collection("vehicles");

  if (id) {
    const docs = await vehicles.findOne({ user: new ObjectID(id) });
    res.send(docs);
  } else {
    const docs = await vehicles.find().toArray();
    res.send(docs);
  }
});

router.post('/remove', async function (req, res, next) {
  const id = req.body.vehicleId;
  const index = req.body.index;
  const conn = await db.connect();
  const vehicles = await conn.collection("vehicles");

  var vehiclesData = await vehicles.findOne({ _id: new ObjectID(id) });
  console.log(vehiclesData.vehicles)
  vehiclesData.vehicles.splice(index, 1)
  console.log(vehiclesData.vehicles)

  await vehicles.updateOne({ _id: new ObjectID(id) }, { $set: { vehicles: vehiclesData.vehicles } }).then((r) => {
    res.send(r)
  });
});

router.post('/add', async function (req, res, next) {

  const conn = await db.connect();
  const vehicles = await conn.collection("vehicles");

  const vehicleId = req.body.vehicleId;
  var name = req.body.name;
  var value = req.body.value;
  var brand = req.body.brand;

  console.log(req.body);

  if (vehicleId) {

    var vehiclesData = await vehicles.findOne({ _id: new ObjectID(vehicleId) });

    vehiclesData.vehicles.push({
      name: name,
      value: value,
      brand: brand
    });

    await vehicles.updateOne({ _id: new ObjectID(vehicleId) }, { $set: { vehicles: vehiclesData.vehicles } });

    vehiclesData = await vehicles.findOne({ _id: new ObjectID(vehicleId) }).then((r) => {
      res.send(r);

      console.log(r)
    });

    console.log(vehiclesData)
  }
  else {
    res.send({ message: "vehicles _id not assigned" })
  }
});


router.post('/edit', async function (req, res, next) {

  const conn = await db.connect();
  const vehicles = await conn.collection("vehicles");

  const vehicleId = req.body.vehicleId;
  var name = req.body.name;
  var value = req.body.value;
  var brand = req.body.brand;
  var index = req.body.index;

  console.log(req.body);

  if (vehicleId) {

    var vehiclesData = await vehicles.findOne({ _id: new ObjectID(vehicleId) });

    vehiclesData.vehicles[index] = {
      name: name,
      value: value,
      brand: brand
    };

    await vehicles.updateOne({ _id: new ObjectID(vehicleId) }, { $set: { vehicles: vehiclesData.vehicles } });

    vehiclesData = await vehicles.findOne({ _id: new ObjectID(vehicleId) }).then((r) => {
      res.send(r)
      console.log(r)
    });
  }
  else {
    res.send({ message: "vehicles _id not assigned" })
  }
});

module.exports = router;
