const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// LdPE7tqkNQ2zi1vG



const uri = "mongodb+srv://rajs45693:LdPE7tqkNQ2zi1vG@cluster0.mi7otul.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();



        const usercollaction = client.db("userDB").collection("user");

        app.get('/user', async (req, res) => {
            const cursor = usercollaction.find();
            const ruselt = await cursor.toArray();
            res.send(ruselt);
        });

        app.get('/update/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await usercollaction.findOne(query);
            res.send(user);
        })

        app.post('/user', async (req, res) => {
            const user = req.body;
            console.log('user comming soon', user)
            const result = await usercollaction.insertOne(user);
            res.send(result);
        })

        app.put('/update/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            console.log(id, user)
            const filter = { _id: new ObjectId(id) }
            const option = { upsert: true }
            const updatesUser = {
                $set: {
                    name: user.name,
                    email: user.email
                }
            }

            const result = await usercollaction.updateOne(filter, updatesUser, option)
            res.send(result)
        })
        app.delete('/user/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id)
            const querry = { _id: new ObjectId(id) }
            const ruselt = usercollaction.deleteOne(querry);
            res.send(ruselt);
        })



        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('server is running');

})
app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})