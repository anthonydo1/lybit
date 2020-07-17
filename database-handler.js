import mongoose from 'mongodb';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

const MongoClient = mongoose.MongoClient;
const url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.rxyjm.azure.mongodb.net/urldb?retryWrites=true&w=majority`;

let _db;


// MongoDb server connection
function connectToServer(callback) {
    MongoClient.connect(url, { useUnifiedTopology: true, useNewUrlParser: true, }, (err, client) => {
        if (err) console.log('MongoDb Error: ', err);
        _db = client.db('urldb');
        return callback(err);
    })
};

// Returns connected db instance
function getDb() {
    return _db;
};

// Creates and hashes url, checks for collisions in db
async function createURL(url) {
    const hash = uuidv4(url).substring(0,7);                     // Hash url and truncate to first 7 characters
    const collisionCheck = await getURL(hash).catch( () => {} ); // Check if hash exists in db

    if (collisionCheck === undefined) {                          // If collisionCheck is undefined, db has no collisions
        const data = {
            'id': hash,
            'url': url
        }
    
        _db.collection('urls').insertOne(data);                  // Add hash and original url to db
        console.log(`Shortened ${url} to ${hash}`);
        return hash;
    } else {
        createURL(url);                                          // If collision exists, create a different hash.
    }
};

// Returns original URL from hash id, otherwise returns nothing.
async function getURL(id) {
    if (id == '') return await '';

    const query = { 
        "id": id
    };

    let link = await _db.collection('urls').find(query).toArray();
    
    return await link[0].url;
};

export { connectToServer, getDb, createURL, getURL };