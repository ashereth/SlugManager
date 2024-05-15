import { MongoClient } from 'mongodb';
//import needed database data
import { config } from "./db.js";
import { Projects } from "./projectsClass.js"

/*
SCHEMA FOR Tasks BELOW------------------------------------------------------

task = {
    _id: auto generated,
    projectname: name of project that its a part of,
    name: should be given as taskName (unique),
    completed: boolean false on default
}
-----------------------------------------------------------------------------*/


export class Tasks {
    //constructor sets uri database name and the collection to add to
    constructor() {
        this.uri = config.mongoURI;
        this.dbName = config.dbName;
        this.collectionName = config.tasksCollection;
        this.projects = new Projects(this.uri);
    }

    // method used to create a new project based on username
    async createTask(projectName, taskName) {
        const client = new MongoClient(this.uri);
        
        try {
            await client.connect();// Connect to MongoDB
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);
            const existingTask = await collection.findOne({name: taskName});
            if(existingTask){
                console.log(`A task with name: ${taskName} already exists please try again.`)
                return false;
            }else{
                //initialize a new task
                const newTask = {
                    projectName: projectName,
                    name: taskName,
                    completed: false
                }
                //insert the new task into the collection
                const result = await collection.insertOne(newTask);

                //print a success message
                console.log(`task created for project: ${projectName} successfully.`);
                return result.insertedId;
            }
            
            } catch (error) {//if there was an error print the error
            console.error('Error creating task:', error);
            }finally {
                await client.close(); // Close the connection
        }
    }
    /*
    //method used for deleting a task
    async deleteTask(projectName, taskName) {

        const client = new MongoClient(this.uri);

        try {
            // Connect to MongoDB
            await client.connect(); 
            //get the database
            const database = client.db(this.dbName);
            //get the collection
            const collection = database.collection(this.collectionName);

            //delete task based on the project name and task name
            const result = await collection.deleteOne({projectName: projectName, name: taskName});
            //delete the task from the projects database
            this.projects.removeTaskFromProject(projectName, taskName);
            //Check if the task was deleted successfully. deltedCount is a 
            if (result.deletedCount === 1) {
                console.log(`Task ${taskName} was deleted successfully`);
            } else {
                console.log(`Failed to delete ${taskName}`);
            }
        } catch (error) {
            //error checking
            console.error('Error deleting task', error);
        } finally {
            //close connection
            await client.close();
        }
    }
    */
    
}

/*
//usage example for adding a task
const uri = config.mongoURI;
const tasks = new Tasks(uri);

await tasks.createTask("test project", "test task");
await tasks.deleteTask("test project", "test task");
*/
