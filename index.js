const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())




const uri = process.env.db_uri;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollection = client.db('brrtika').collection('brrtikaCategory');
        const booksCollection = client.db('brrtika').collection('bookCollection');
        const ourServicesCollection = client.db('brrtika').collection('ourServices');
        const ourAmbassadorCollection = client.db('brrtika').collection('ourAmbassador');
        const addBooksCollection = client.db('brrtika').collection('addBooks');
        // get request
        app.get('/', async (req, res) => {
            const query = {};
            const result = await categoryCollection.find(query).toArray();
            if (result) {
                return res.send(result)
            } else {
                return res.send({ message: "data not found" })
            }
        })
        app.get('/our_ambassador', async (req, res) => {
            const query = {};
            const result = await ourAmbassadorCollection.find(query).toArray();
            if (result) {
                return res.send(result)
            } else {
                return res.send({ message: "data not found" })
            }
        })


        app.get('/our_services', async (req, res) => {
            const query = {};
            const result = await ourServicesCollection.find(query).toArray();
            if (result) {
                return res.send(result)
            } else {
                return res.send({ message: "data not found" })
            }
        })

        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) }
            const query = {};
            const bookCategory = await categoryCollection.findOne(filter);
            const books = await booksCollection.find(query).toArray();
            const findBooks = books.find(books => books.category_id === bookCategory.category);
            res.send(findBooks)
        })


        app.get('/add_books', async (req, res) => {
            const query = {};
            const result = await addBooksCollection.find(query).toArray();
            res.send(result)
        })

        app.post('/add_books', async (req, res) => {
            const book = req.body;
            console.log(book);
            const result = await addBooksCollection.insertOne(book);
        })

        app.post('/category', async (req, res) => {
            const category = req.body;
            const id = category._id;
            const filter = { _id: new ObjectId(id) }
            const query = {};
            const bookCategory = await categoryCollection.findOne(filter);
            const books = await booksCollection.find(query).toArray();
            const findBooks = books.find(books => books.category_id === bookCategory.category);
            console.log(id);
            res.send(findBooks)
        })

        // Post request
        app.post('/category/:id', async (req, res) => {
            const filter = req.body;
            const query = {};
            const books = await booksCollection.find(query).toArray();
            const findBooks = books.find(bookCategory => bookCategory.category_id === filter.category);
            res.send(findBooks)
        })

    }
    finally {

    }
}

run().catch(e => console.log(e))



app.get('/', (req, res) => {
    res.send('Server is open on port 5000')
})

app.listen(port, () => {
    console.log(`this server in open on port ${port}`);
})
