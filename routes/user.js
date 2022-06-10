var express = require('express');
var md5 = require('md5')
var router = express.Router();
var ObjectID = require("mongodb").ObjectId;

const db = require('../db');

console.log(md5(123));

router.post('/drop', async function (req, res, next) {

    const conn = await db.connect();
    const users = await conn.collection("users");
    const vehicles = await conn.collection("vehicles");

    await users.drop();
    await vehicles.drop();

    res.send('db clean');
})

router.post('/signin', async function (req, res, next) {

    const conn = await db.connect();
    const users = await conn.collection("users");
    const vehicles = await conn.collection("vehicles");
    const name = req.body.name;
    const password = req.body.password;

    const existentUser = await users.findOne({ name: name, password: password })

    if (existentUser) {
        res.send(existentUser);
    } else {
        users.insertOne({
            name: name,
            password: password
        }).then((userReq) => {

            vehicles.insertOne({ vehicles: [] }).then((vehiclesReq) => {
                users.updateOne({ _id: userReq.insertedId }, { $set: { vehicleId: vehiclesReq.insertedId } }).then(() => {
                    users.findOne({ name: name, password: password }).then((userReq) => {
                        res.send(userReq);
                    })
                });
            })
        });
    }
});

router.post('/login', async function (req, res, next) {

    const conn = await db.connect();
    const users = await conn.collection("users");
    const name = req.body.name;
    const password = req.body.password;

    const r = await users.findOne({ name: name })

    if (r) {

        if (r.password === password) {
            res.send({ message: "ok", user: r._id, vehicleId: r.vehicleId });
        }
        else {
            res.send({ message: "password incorrect" })
        }
    }
    else {
        res.send({ message: "user not exist" })
    }
});

router.get('/all', async function (req, res, next) {

    const conn = await db.connect();
    const users = await conn.collection("users");
    const name = req.body.name;
    const password = req.body.password;

    const docs = await users.find().toArray();
    res.send(docs)
});


module.exports = router;