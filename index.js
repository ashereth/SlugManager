// Main application file that handles backend tasks such as
//   route handling and http request processing

/* ---------- Assuming you have all needed packages installed -----------------------
        use command: powershell -ExecutionPolicy Bypass -Command "nodemon index.js"
                    in a vscode terminal to start up server
-------------------------------------------------------------------------------------*/
import express from "express";
import { dirname } from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import { Users } from "./database/usersClass.js";
import { config } from "./database/db.js";

// dynamically get path to directory
const __dirname = dirname(fileURLToPath(import.meta.url));
// set main application variable using express
const app = express();
const port = 3000;//port to run on

app.use(bodyParser.urlencoded({extended: true}));//bodyparser can now parse forms

// main route
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/templates/index.html");
});

app.get("/register", (req, res) => {
    res.sendFile(__dirname + "/templates/register.html");
});

app.post("/register", (req, res) => {
    const uri = config.mongoURI;
    const users = new Users(uri);
    const {username, password} = req.body;
    users.createUser(username, password);
    res.status(201).json({username, password});
});

//make app listen on a port and print out the url of the running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});