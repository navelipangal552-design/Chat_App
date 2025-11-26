// index.js
const { MongoClient } = require("mongodb");

// replace with your own connection string from MongoDB Atlas
const uri = "mongodb+srv://navelipangal552_db_user:wVGlBBl01Lni0Lx4@cluster0.sdaqnmm.mongodb.net/chat_App?appName=Cluster0";

async function run() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas!");

    const db = client.db("testdb");          // database name
    const collection = db.collection("users"); // collection name

    // sample data to insert
    const user = { name: "Naveli", age: 22, city: "India" };

    const result = await collection.insertOne(user);
    console.log("Data inserted with ID:", result.insertedId);

  } catch (err) {
    console.error("Error:", err);
  } finally {
    await client.close();
  }
}

run();
