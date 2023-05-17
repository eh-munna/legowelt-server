// express configuration

const express = require('express');
const port = process.env.PORT || 5000;
const cors = require('cors');

// dotenv

require('dotenv').config();

// using middleware

app.use(cors());
app.use(express.json());

// express app

const app = express();

// basic route testing

app.get('/', (req, res) => {
  res.send('Welcome to the Legowelt server!');
});
// app running

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
