import express from 'express';
import { connectToServer, getDb, createURL, getURL } from './database-handler.js';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = 3000;
const header = `http://localhost:${PORT}/`;


// MIDDLEWARE
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));
app.set('view engine', 'ejs');

// MONGODB SERVER CONNECTION
connectToServer((err) => {
    if (err) console.log(err);
})

// DEFAULT LANDING PAGE
app.get('/', (req, res) => res.send('./index.html'));

// REDIRECT SHORTENED URL
app.get('/:id', (req, res) => {
    if (req.params.id == null) res.send('Hello');

    getURL(req.params.id).then((link) => {
        res.redirect(link);
    }).catch( () => {res.send('Error not found')})
});

// CREATE SHORTENED URL
app.post('/', (req, res) => {
    createURL(req.body.url).then ( (url) => {
        res.send({
            'url': url
        });
    })
})

// LISTEN TO PORT
app.listen(PORT, () => console.log(`Listening on http://localhost:${PORT}/`));

