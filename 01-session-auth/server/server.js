const express = require('express');

const PORT = process.env.PORT || 5000;

const app = express();

// middleware to change req.body to a json object
app.use(express.json());

// route to test if server is working
app.get('/', (req, res) => {
    res.send('Hello World!');
})

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})