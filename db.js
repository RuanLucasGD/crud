const { MongoClient } = require("mongodb")
const uri = "mongodb://localhost:27017/mydb"
const client = new MongoClient(uri)

async function connect() {

    if (global.db) {
        return global.db;
    }

    const conn = await client.connect();

    if (!conn) {

        return new Error("Erro ao conectar");
    }

    else {
        console.log("Conectado");
    }

    global.db = conn.db("mydb");
    return global.db;
}

module.exports = { connect };