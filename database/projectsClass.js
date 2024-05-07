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
    members: initially empty list of user objects. members added by administrator
    tasks: initially empty list. should hold task objects
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
                this.users.addProjectToUser(username, newProject);

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
    // untested
    async deleteProject(username, project) {

        const client = new MongoClient(this.uri);

        try {
            // Connect to MongoDB
            await client.connect(); 
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);

            //delete project based on the username and name associated with project
            const result = await collection.deleteOne({ administrator: username, name: project.name});
            //delete the project from the users database
            this.users.removeProjectFromUser(username, project);
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

    //Method for adding a task to a project
    async addTaskToProject(projectName, task) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { name: projectName },
                { $push: { tasks: task } }
            );

            console.log(`${result.modifiedCount} document(s) updated`);

        } catch (error) {
            console.error('Error adding task to project:', error);
        } finally {
            await client.close(); // Close the connection
        }
    }

    //Method for removing a task from the project database
    // untested
    async removeTaskFromProject(projectName, task) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Update the user's projects array
            const result = await collection.updateOne(
                { name: projectName},
                { $pull: { tasks: task } }
            );

            if (result.modifiedCount === 1) {
                console.log(`Task ${task} removed from ${projectName}`);
            } else {
                console.log(`Task ${task} not found under project ${projectName}`)
            }

        } catch (error) {
            console.error('Error removing task from project', error);
        } finally {
            await client.close(); // Close the connection
        }
    }    

    
    //Method for returning a project from just the name
    async getProject(projectName) {
        const client = new MongoClient(this.uri);

        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);

            // Find the project with the specified ObjectId
            const project = await collection.findOne({ name: projectName });
            
            // Check if the project is found
            if (project) {
                // Print the project object with all its values
                console.log("Project:", project);
                // Return the project object
                return project;
            } else {
                console.log("Project not found.");
                return null;
            }

        } catch (error) {
            console.error('Error getting project:', error);
            return null;
        } finally {
            await client.close(); // Close the connection
        }
    }


}


//usage example for adding a project
//const uri = config.mongoURI;
//const projects = new Projects(uri);

//await projects.createProject("asher", "test project");
//await projects.deleteProject("asher", "test project");

