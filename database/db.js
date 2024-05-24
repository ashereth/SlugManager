import dotenv from 'dotenv';
dotenv.config();
// uri for mongodb database
export const config = {
    mongoURI: process.env.mongoURI,
    dbName: "slugmanager",
    usersCollection: "users",
    projectsCollection: "projects",
    tasksCollection: "tasks"
};
