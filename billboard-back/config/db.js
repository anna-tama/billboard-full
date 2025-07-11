const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017/billboard";

let client;

const connectDB = async () => {
  try {
    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    console.log('MongoDB Connected...');
    return client.db(); // Retorna la instancia de la base de datos.
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;