// express configuration

const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');
// express app

const app = express();

// dotenv

require('dotenv').config();

// using middleware

app.use(cors());
app.use(express.json());

// mongodb configuration

const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0lo6seg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connectDB() {
  try {
    await client.connect();

    // database name
    const legoWeltDB = client.db('legoWelt');

    // collection name
    const toysCollection = legoWeltDB.collection('toysCollection');

    // get all toys

    app.get('/toys', async (req, res) => {
      const toys = toysCollection.find();
      const result = await toys.toArray();
      res.send(result);
    });

    // get a toy based on category
    app.get('/toys/:text', async (req, res) => {
      const toyCategory = req.params.text;
      if (
        toyCategory === 'lego-cars' ||
        toyCategory === 'lego-city' ||
        toyCategory === 'lego-architecture'
      ) {
        const toys = toysCollection.find({ subCategory: toyCategory });
        const result = await toys.toArray();
        return res.send(result);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

connectDB();

// basic route testing

app.get('/', (req, res) => {
  res.send('Welcome to the Legowelt server!');
});

// app running

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
