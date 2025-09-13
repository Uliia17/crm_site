const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://polska1991:okten@cluster0.j7cchxx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let client;
let db;

async function connectDB() {
    if (db) return db;

    client = new MongoClient(uri);
    await client.connect();

    db = client.db("crmDB");
    console.log("✅ MongoDB connected");
    return db;
}

module.exports = connectDB;
