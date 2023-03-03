const express = require('express');
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const app = express();

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('Server is open on port 5000')
})

app.listen(port, () => {
    console.log(`this server in open on port ${port}`);
})