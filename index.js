const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
const port = process.env.PORT || 3200;

const uri = process.env.DB_PATH;
let client = new MongoClient(uri ,{useNewUrlParser:true, useUnifiedTopology: true})



/********************************
             All Routes
*********************************/
app.get('/' , (req, res) => {
    res.send("Welcome to Red Onion Backend Server");
})


app.get('/foods' , (req, res) => {
    client = new MongoClient(uri ,{useNewUrlParser:true});
    client.connect(err => {
        if(err){
            console.log(err);
        }else{
            const collection = client.db('redOnionRestaura').collection('foods');
            collection.find().toArray((rej,documents) => {
                if(rej){
                    console.log(rej);
                    res.status(500).send("Filed to Fetch Data ")
                }else{
                    res.send(documents);
                }
                client.close()
            })
        }
    })
})

app.get('/food/:id', (req,res) => {
    client = new MongoClient(uri,{useNewUrlParser:true,useUnifiedTopology: true})
    const foodId = Number(req.params.id)

    client.connect(err => {
        const collection = client.db('redOnionRestaura').collection('foods');
        console.log(foodId);
        collection.find({id:foodId}).toArray((err, documents) => {
            if(err){
                console.log(err);
            }else{
                res.send(documents[0]);
            }
            client.close();
        })
    })
})

app.get('/features' , (req,res) => {
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('redOnionRestaura').collection('features');
        collection.find().toArray((rej,documents) => {
            if(rej){
                res.status(500).send("Failed to fetch data");
            }else{
                res.send(documents)
            }
        }) 
        
    })

})

// Post routes
app.post('/submitorder' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('redOnionRestaura').collection('orders');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Filed to inset")
            }else{
                res.send(result.ops[0])
            }
        })
    })
})

// Bellows are dummy post method used just one time
app.post('/addfood' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('redOnionRestaura').collection('foods');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Filed to inset")
            }else{
                res.send(result.ops)
            }
        })
    })
})
app.post('/addfeatures' , (req,res) => {
    const data = req.body;
    console.log(data);
    client = new MongoClient(uri , {useNewUrlParser:true , useUnifiedTopology: true});
    client.connect(err => {
        const collection = client.db('redOnionRestaura').collection('features');
        collection.insert(data , (rej, result) =>  {
            if(rej){
                res.status(500).send("Filed to inset")
            }else{
                res.send(result.ops)
            }
        })
    })
})

app.listen(port, err => {
    err ? console.log(err) : console.log("Listing for port :" , port);
})