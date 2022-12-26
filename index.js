const express = require('express');
const app = express();
const port = process.env.PROT || 8000;
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

app.use(express.json());
app.use(cors());
// NQ1nGh0YUiRiRYeb
// userDBinfo
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.myfzpsp.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();

    const userCollection = client.db('userInfo').collection('usersdata');

    app.get('/users', async (req, res) => {
      const carsor = await userCollection.find({}).toArray();
      res.send({ success: true, data: carsor });
    });
    app.get('/users/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const user = await userCollection.findOne(query);
      res.send(user);
    });

    // post user collection
    app.post('/users', async (req, res) => {
      const userInfo = req.body;
      const doc = {
        name: userInfo.name,
        selected: userInfo.selected,
        condition: userInfo.condition,
      };

      const result = await userCollection.insertOne(doc);
      res.send({ status: 200, data: result });
    });
    //  delete collection
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const result = await userCollection.deleteOne(filter);
      res.send(result);
    });

    app.put('/users/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const user = req.body;
      const options = { upsert: true };

      const updatedDoc = {
        $set: {
          name: user.name,
          selected: user.selected,
        },
      };
      const result = await userCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
    console.log('database is connected');
  } finally {
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
