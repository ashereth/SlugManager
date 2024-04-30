import { MongoClient } from 'mongodb';
//import needed database data
import { config } from "./db.js";
import { Users } from "./usersClass.js"

/*
SCHEMA FOR PROJECTS BELOW------------------------------------------------------

project = {
    _id: auto generated,
    name: should be given as projectName (unique),
    administrator: should be given as username,
    members: initially empty list. members added by administrator
    tasks: initially empty list. tasks added by administrator
}
-----------------------------------------------------------------------------*/


export class Projects {
    //constructor sets uri database name and the collection to add to
    constructor() {
        this.uri = config.mongoURI;
        this.dbName = config.dbName;
        this.collectionName = config.projectsCollection;
        this.users = new Users(this.uri);
    }

    // method used to create a new project based on username
    async createProject(username, projectName) {
        const client = new MongoClient(this.uri);
        
        try {
            await client.connect();// Connect to MongoDB
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);
            const existingProject = await collection.findOne({name: projectName});
            if(existingProject){
                console.log(`A project with name: ${projectName} already exists please try again.`)
                return false;
            }else{
                //initialize a new project
                const newProject = {
                    name: projectName,
                    administrator: username,
                    members: [],
                    tasks: []
                }
                //insert the new user into the collection
                const result = await collection.insertOne(newProject);
                //insert the project name into the current users projects
                this.users.addProjectToUser(username, projectName);

                //print a success message
                console.log(`project created for ${newProject.administrator} successfully.`);
                return true;
            }
            
            } catch (error) {//if there was an error print the error
            console.error('Error creating project:', error);
            }finally {
                await client.close(); // Close the connection
        }
    }

    //method used for deleting a project
    async deleteProject(username, projectName) {

        const client = new MongoClient(this.uri);

        try {
            // Connect to MongoDB
            await client.connect(); 
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);

            //delete project based on the username and name associated with project
            const result = await collection.deleteOne({ administrator: username, name: projectName});
            //delete the project from the users database
            this.users.removeProjectFromUser(username, projectName);
            //Check if the project was deleted successfully. deltedCount is a 
            if (result.deletedCount === 1) {
                console.log(`Project ${projectName} was deleted successfully by ${username}`);
            } else {
                console.log(`Failed to delete ${projectName}`);
            }
        } catch (error) {
            //error checking
            console.error('Error deleting project', error);
        } finally {
            //close connection
            await client.close();
        }
    }

    //Method for adding a project to a user in the database
    async addTaskToProject(projectName, taskName) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { name: projectName },
                { $push: { tasks: taskName } }
            );

            console.log(`${result.modifiedCount} document(s) updated`);

        } catch (error) {
            console.error('Error adding task to project:', error);
        } finally {
            await client.close(); // Close the connection
        }
    }

    //Method for removing a task from the project database
    async removeTaskFromProject(projectName, taskName) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { name: projectName},
                { $pull: { tasks: taskName } }
            );

            if (result.modifiedCount === 1) {
                console.log(`Task ${taskName} removed from ${projectName}`);
            } else {
                console.log(`Task ${taskName} not found under project ${projectName}`)
            }

        } catch (error) {
            console.error('Error removing task from project', error);
        } finally {
            await client.close(); // Close the connection
        }
    }
}


//usage example for adding a project
const uri = config.mongoURI;
const projects = new Projects(uri);

//await projects.createProject("asher", "test project");
//await projects.deleteProject("asher", "test project");

