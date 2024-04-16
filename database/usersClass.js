import { MongoClient } from 'mongodb';
//import needed database data
import { config } from "./db.js";
//library for hashing passwords
import { createHash } from 'crypto';
import exp from 'constants';

// function for hashing passwords
function hash(string) {
    return createHash('sha256').update(string).digest('hex');
} 

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
export class Users {
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
        await client.connect();// Connect to MongoDB
        //get the database
        const database = client.db(this.dbName);
        //get the collection
        const collection = database.collection(this.collectionName);
        //initialize a new user
        const newUser = {
        username: username,
        password: hash(password),
        projects: []
        };

        //Check for existing user
        const existingUser = await collection.findOne({ username: username });
        if (existingUser) {
            console.log('User ${username} already exists. Please login');
            return null;
        }

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

    //returns true or false based on if user exist and password matches
    async login(username, password){
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);
            //Check for existing user
            const user = await collection.findOne({ username: username, password: password });
            if (user) {
                console.log(`User ${user.username} logged in successfully with password ${user.password}`);
                return true;
            } else {
                console.log('Invalid username or password. Try again.');
                return false;
            }
        }catch (error) {//if there was an error print the error
            console.error('Error finding user:', error);
        }finally {
            await client.close(); // Close the connection
        }
    }

    //Method for adding a project to a user in the database
    async addProjectToUser(username, projectName) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { username: username },
                { $push: { projects: projectName } }
            );

            console.log(`${result.modifiedCount} document(s) updated`);

        } catch (error) {
            console.error('Error adding project to user:', error);
        } finally {
            await client.close(); // Close the connection
        }
    }

    //Method for removi a project to a user in the database
    async removeProjectFromUser(username, projectName) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { username: username },
                { $pull: { projects: projectName } }
            );

            if (result.modifiedCount === 1) {
                console.log('Project ${projectName} removed by user ${username}');
            } else {
                console.log('Project ${projectName} not found under user ${username} ')
            }

        } catch (error) {
            console.error('Error removing project', error);
        } finally {
            await client.close(); // Close the connection
        }
    }
}
/*
// Usage example for users class and some associated methods
const uri = config.mongoURI;

//iinitialize a new Users class
const users = new Users(uri);
///create some new users that should be added to the mongodb database
await users.createUser("asher", "1234");
await users.createUser("cali", "1234");
await users.createUser("kiera", "1234");//tesing login function
await users.login("asher", hash("1234"));
*/

