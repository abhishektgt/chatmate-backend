const mongoose = require("mongoose");

const uri = "mongodb+srv://abhishek:mypassword%40123@chatmate.dbuv1cw.mongodb.net/authdb";

async function inspectDatabase() {
  try {
    await mongoose.connect(uri); // simpler and cleaner

    console.log("✅ Connected to MongoDB");

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();

    if (collections.length === 0) {
      console.log("⚠️ No collections found in authdb.");
    }

    for (const coll of collections) {
      const data = await db.collection(coll.name).find().toArray();
      console.log(`\n📁 Collection: ${coll.name}`);
      console.log(data.length > 0 ? data : "🔍 Empty collection");
    }

    await mongoose.connection.close();
    console.log("\n✅ Disconnected from MongoDB");
  } catch (err) {
    console.error("❌ Error:", err.message);
  }
}

inspectDatabase();
