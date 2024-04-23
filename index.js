// Main application file that handles backend tasks such as route handling and http request processing

/* ---------- Assuming you have all needed packages installed -----------------------
        use command: powershell -ExecutionPolicy Bypass -Command "nodemon index.js"
                    in a vscode terminal to start up server
-------------------------------------------------------------------------------------*/

/* ---------------- SET-UP ---------------- */
import express from "express";                              // express module
import { dirname } from "path";                             // extract directory name from file path
import { fileURLToPath } from "url";                        // convert a file URL to a file path string
import bodyParser from "body-parser";                       // parse body of HTTP requests
import { Users } from "./database/usersClass.js";           // import the Users class
import { config } from "./database/db.js";                  // configuration settings

// dynamically get path to directory
const __dirname = dirname(fileURLToPath(import.meta.url));
// set main application variable using express
const app = express();
const port = 3000;

//bodyParser can now parse forms
app.use(bodyParser.urlencoded({extended: true}));

// serve static files from the 'static' directory
app.use(express.static(__dirname + "/static"));

/* ---------------- VIEWS ---------------- */
// main route; index page
app.get("/", (req, res) => {
    res.render(__dirname + "/templates/index.ejs");
});

// register page
app.get("/register", (req, res) => {
    res.render(__dirname + "/templates/register.ejs");
});

app.post("/register", (req, res) => {
    const uri = config.mongoURI;                            // retrieve mongoDB URI
    const users = new Users(uri);                           // new instance of Users class
    const {username, password} = req.body;                  // extract user/pass from request body
    //console.log(username, password);
    users.createUser(username, password);
    res.status(201).json({username, password});             // send 'created' response back to client
});

// make app listen on a port and print out the url of the running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});