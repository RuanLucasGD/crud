var express = require('express');
var router = express.Router();
var ObjectID = require("mongodb").ObjectId;

const db = require('../db');

/* GET users listing. */
router.get('/', async function (req, res, next) {

  const conn = await db.connect();
  const clients = conn.collection("clients");
  const docs = await clients.find().toArray();
  console.log(docs);
  res.render('list', { docs: docs, userAdded: false });
});

router.get('/add', async function (req, res, next) {

  res.render('add');
});

router.get('/edit/:id', async function (req, res, next) {

  const id = req.params.id;
  const conn = await db.connect();
  const clients = conn.collection("clients");
  const docs = await clients.find({ _id: ObjectID(id) }).toArray();

  res.render('edit', { docs: docs });
});

router.post('/', async function (req, res, next) {

  const conn = await db.connect();
  const clients = conn.collection("clients");
  const name = req.body.nome;
  const telephone = req.body.telefone;
  const uf = req.body.uf;
  await clients.insertOne({
    name: name,
    telephone: telephone,
    uf: uf
  });

  const docs = await clients.find().toArray();
  res.render("list", { docs: docs, userAdded: true });
});

module.exports = router;
