const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xhyhe.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express()
app.use(bodyParser.json());
app.use(cors());

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const productsCollection = client.db("emaJohnStore").collection("products");
    const ordersCollection = client.db("emaJohnStore").collection("orders");
    //post data in database
    app.post('/addProduct', (req, res) => {
        const product = req.body;
        productsCollection.insertMany(product)
            .then(result => {
                console.log(result);
            })
    })
    //get all product
    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })
    //get one product
    app.get('/product/:key', (req, res) => {
        productsCollection.find({ key: req.params.key})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    })

    app.post('/productsByKeys',(req, res)=>{
        const productKeys = req.body;
        productsCollection.find({ key: {$in: productKeys}})
        .toArray((err, documents) => {
            res.send(documents)
        })
    })

    app.post('/addOrder', (req, res) => {
        const order = req.body;
        ordersCollection.insertOne(order)
            .then(result => {
                res.send(result.acknowledged);
            })
    })

});



app.get('/', (req, res) => {
    res.send('Hello ema watson!')
})

app.listen(process.env.PORT || 5000);