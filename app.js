const express = require("express");
const app = express();
app.use(express.json())

const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://user0:Mch12345@cluster0.cdojv.mongodb.net/<dbname>?retryWrites=true&w=majority";

async function getClient() {
    return await MongoClient.connect(uri, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true,
    });
}

app.get('/', (req, res)=>{
    res.send("Welcome!!!")
})

app.get('/api/users', async (req, res)=>{

    const client = await getClient();
    const collection = client.db("test").collection("dog");
    const items = await collection.find({}).toArray();
    res.send(items)
    client.close();
})

app.post('/api/users', async (req, res)=>{

    const client = await getClient();
    const collection = client.db("test").collection("dog");
    const result = await collection.insertOne(req.body);
    res.send(result.insertedId)
    client.close();
})


app.delete('/api/users', async (req, res)=>{

    const client = await getClient();
    const collection = client.db("test").collection("dog");
    const id = req.body._id
    await collection.deleteOne({_id: new mongodb.ObjectID(id)});
    res.status(201).send();
    client.close();

})
app.put('/api/users', async (req, res)=>{

    const client = await getClient();
    const collection = client.db("test").collection("dog");

    const body = req.body
    const id = body._id
    delete body["_id"];
    var newvalues = { $set: body };

    await collection.updateOne({_id: new mongodb.ObjectID(id)}, newvalues);
    res.status(204).send();
    client.close();

})


const port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log("I am listening...")
})