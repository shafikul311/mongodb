const express = require("express");

const bodyParser = require("body-parser");

const ObjectId = require("mongodb").ObjectId;

const password = "hCEtGqLD0rVlKyZz";

const MongoClient = require("mongodb").MongoClient;
const uri =
  "mongodb+srv://mydbUser:hCEtGqLD0rVlKyZz@cluster0.ywwhy.mongodb.net/organicdb?retryWrites=true&w=majority";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
client.connect((err) => {
  const productCollection = client.db("organicdb").collection("products");
  app.get("/products", (req, res) => {
    productCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });



  // AddProduct


  app.post("/addProduct", (req, res) => {
    const product = req.body;
    productCollection.insertOne(product).then((result) => {
      console.log("data added success");
      res.redirect('/')
    });
  });

  app.get("/product/:id", (req, res) => {
    productCollection
      .find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      });
  });


  // update


  app.patch("/update/:id", (req, res) => {
    console.log(req.body.price);
    productCollection
      .updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: { price: req.body.price, quantity: req.body.quantity },
        }
      )

      .then((result) => {
        
        res.send(result.modifiedCount > 0)
      });
  });

 

  // delete

  app.delete("/delete/:id", (req, res) => {
    productCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(3000);
