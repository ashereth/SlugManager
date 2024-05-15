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
    description: description of task (string),
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
    async createTask(projectName, taskName, description) {
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
                    description: description,
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
    
    //method for getting task object by task name
    async getTask(taskName){
        const client = new MongoClient(this.uri);
        try {
            await client.connect();
            const database = client.db(this.dbName);
            const collection = database.collection(this.collectionName);
            const task = await collection.findOne({name: taskName});
            if (task) {
                //console.log('task = '+task);
                return task;
            } else {
                console.log(`No task found with the name: ${taskName}`);
                return null;
            }
        } catch (error) {
            console.error(`Error retrieving task by name (${taskName}):`, error);
        } finally {
            await client.close();
        }
    }

    async toggleTaskCompletion(taskName) {
        const client = new MongoClient(this.uri);
        try {
            await client.connect(); // Connect to MongoDB
            const database = client.db(this.dbName); // Get the database
            const collection = database.collection(this.collectionName); // Get the collection
    
            // Retrieve the current task to check its completion status
            const task = await collection.findOne({ name: taskName });
            if (task) {
                // Toggle the completion status
                const newCompletionStatus = !task.completed;
    
                // Update the task with the new status
                const updateResult = await collection.updateOne(
                    { name: taskName },
                    { $set: { completed: newCompletionStatus } }
                );
    
                if (updateResult.matchedCount === 1) {
                    //console.log(`Task '${taskName}' completion status updated to '${newCompletionStatus}'.`);
                    return true;
                } else {
                    //console.log(`No update performed for task '${taskName}'.`);
                    return false;
                }
            } else {
                console.log(`No task found with the name '${taskName}'.`);
                return false;
            }
        } catch (error) {
            console.error(`Error toggling task completion status (${taskName}):`, error);
            return false;
        } finally {
            await client.close(); // Close the connection
        }
    }
    
    
}

/*
//usage example for adding a task
const uri = config.mongoURI;
const tasks = new Tasks(uri);

await tasks.createTask("test project", "test task");
*/
