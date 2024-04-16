import { MongoClient } from 'mongodb';
//import needed database data
import { config } from "./db.js";

/*
SCHEMA FOR USERS BELOW------------------------------------------------------

user = {
    _id: auto generated,
    username: should be given,
    password: should be the hash of the given password,
    projects: an array of project id's related to the user. Initially empty.
}
-----------------------------------------------------------------------------*/

// A class for users with all needed methods to access and alter the users data collection
class Users {
    //constructor sets uri database name and the collection to add to
    constructor() {
        this.uri = config.mongoURI;
        this.dbName = config.dbName;
        this.collectionName = config.usersCollection;
    }

    // method used to create a new user given a username and password
    async createUser(username, password) {
    const client = new MongoClient(this.uri);
    
    try {
        await client.connect(); // Connect to MongoDB
        //get the database
        const database = client.db(this.dbName);
        //get the collection
        const collection = database.collection(this.collectionName);
        //initialize a new user
        const newUser = {
        username: username,
        password: password,
        projects: []
        };
        //insert the new user into the collection
        const result = await collection.insertOne(newUser);
        //print a success message
        console.log(`User ${username} created successfully.`);
        return result.insertedId; // Return the ID of the inserted document
        } catch (error) {//if there was an error print the error
        console.error('Error creating user:', error);
        }finally {
            await client.close(); // Close the connection
        }
    }
}

// Usage example for users class and some associated methods
const uri = config.mongoURI;

//iinitialize a new Users class
const users = new Users(uri);

//create some new users that should be added to the mongodb database
users.createUser("asher", "1234");
users.createUser("cali", "1234");
users.createUser("kiera", "1234");