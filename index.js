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

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0lo6seg.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  useNewUrlParser: true,
  useUnifiedTopology: true,
  maxPoolSize: 10,
});

async function connectDB() {
  try {
    client.connect((error) => {
      if (error) {
        console.log(error);
        return;
      }
    });

    // database name
    const legoWeltDB = client.db('legoWelt');

    // collection name
    const toysCollection = legoWeltDB.collection('toysCollection');

    // indexing toys
    const indexKeys = { toyName: 1 };
    const indexOptions = { name: 'toyName' };
    const result = await toysCollection.createIndex(indexKeys, indexOptions);

    // app.get('/toySearchByName/text', async (req, res) => {
    //   const text = req.params.text;
    //   const result = await toysCollection
    //     .find({
    //       $or: [{ toyName: { $regex: text, $options: 'i' } }],
    //     })
    //     .toArray();
    //   res.send(result);
    // });

    // searching toys

    app.get('/toySearchByName/:text', async (req, res) => {
      const text = req.params.text;
      const result = await toysCollection
        .find({ toyName: { $regex: text, $options: 'i' } })
        .toArray();
      res.send(result);
    });

    // get all toys

    app.get('/toys', async (req, res) => {
      const toys = toysCollection.find().limit(20);
      const result = await toys.toArray();
      res.send(result);
    });

    // get a toy based on id
    app.get('/toy/:id', async (req, res) => {
      const toyId = req.params.id;
      const query = { _id: new ObjectId(toyId) };
      const result = await toysCollection.findOne(query);
      res.send(result);
    });

    // get a toy base on email
    app.get('/myToy/:email', async (req, res) => {
      const result = await toysCollection
        .find({
          sellerEmail: req.params.email,
        })
        .toArray();
      res.send(result);
    });

    // get a toy based on category
    app.get('/loadToy/:text', async (req, res) => {
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
      // const toys = toysCollection.find({});
      // const result = await toys.toArray();
      // res.send(result);
    });

    // sorting toys base on price
    app.get('/sortHighPrice', async (req, res) => {
      const toys = await toysCollection.find({}).sort({ price: -1 }).toArray();
      return res.send(toys);
    });

    // add a new toy

    app.post('/add-toy', async (req, res) => {
      const newToy = req.body;
      const result = await toysCollection.insertOne(newToy);
      res.send(result);
    });

    // update a toy based on id

    app.patch('/update-toy/:id', async (req, res) => {
      const toyId = req.params.id;
      const update = req.body;
      const query = { _id: new ObjectId(toyId) };
      const updateDoc = {
        $set: {
          price: update.price,
          description: update.description,
          availableQuantity: update.availableQuantity,
        },
      };
      const result = await toysCollection.updateOne(query, updateDoc);
      res.send(result);
    });

    // delete a toy based on id

    app.delete('/delete-toy/:id', async (req, res) => {
      const toyId = req.params.id;
      const query = { _id: new ObjectId(toyId) };
      const result = await toysCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // client.close();
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

// https://legowelt-server.vercel.app/
