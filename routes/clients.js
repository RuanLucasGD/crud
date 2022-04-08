var express = require('express');
var router = express.Router();
var ObjectID = require("mongodb").ObjectId;

const db = require('../db');

/* GET users listing. */
router.get('/', async function (req, res, next) {

  const conn = await db.connect();
  const clients = conn.collection("clients");
  const docs = await clients.find().toArray();
  res.render('list', { docs: docs, userAdded: false });
});

router.get('/add', async function (req, res, next) {

  res.render('add', { obj: { name: "", telephone: "", uf: "" }, label: "Adicionar" });
});


router.post('/delete', async function (req, res, next) {

  const id = req.body.hiddenId;
  const conn = await db.connect();
  const clients = conn.collection("clients");

  await clients.deleteOne({ _id: new ObjectID(id) })

  docs = await clients.find().toArray();

  res.render('list', { docs: docs, userAdded: false })

});

router.post('/update', async function (req, res, next) {

  const id = req.body.hiddenId;
  const conn = await db.connect();
  const clients = conn.collection("clients");

  docs = await clients.findOne({ _id: new ObjectID(id) })

  res.render('add', { obj: docs, label: "Atualizar" })
});

router.post('/', async function (req, res, next) {

  const conn = await db.connect();
  const clients = conn.collection("clients");
  const name = req.body.nome;
  const telephone = req.body.telefone;
  const uf = req.body.uf;

  if (req.body.hiddenId) {

    await clients.updateOne(
      {
        _id: new ObjectID(req.body.hiddenId)
      },
      {
        $set: {
          name: name,
          telephone: telephone,
          uf: uf
        }
      })
  }
  else {
    await clients.insertOne({
      name: name,
      telephone: telephone,
      uf: uf
    });
  }

  const docs = await clients.find().toArray();
  res.render("list", { docs: docs, userAdded: true, label: "Adicionar" });
});

module.exports = router;
