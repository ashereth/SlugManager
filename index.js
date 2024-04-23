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
import session from 'express-session';

// dynamically get path to directory
const __dirname = dirname(fileURLToPath(import.meta.url));
// set main application variable using express
const app = express();
const port = 3000;//port to run on

app.use(bodyParser.urlencoded({extended: true}));//bodyparser can now parse forms

//set up session to save session variables
app.use(session({
    secret: 'slugmanager',
    resave: false,
    saveUninitialized: true,
}));

// main route
app.get("/home", (req, res) => {
    //if user is logged in show them main page if not send them to register
    if (req.session.isLoggedIn) {
        res.render(__dirname + "/templates/index.ejs");
    }else{
        res.render(__dirname + "/templates/register.ejs");
    }
});

app.get("/register", (req, res) => {
    res.render(__dirname + "/templates/register.ejs");
});

app.post("/register", (req, res) => {
    const uri = config.mongoURI;
    const users = new Users(uri);
    const {username, password} = req.body;

    try {
        users.createUser(username, password);
        req.session.username = username; // Store username in session
        req.session.isLoggedIn = true; // Set logged in status
        //res.status(201).json({ message: "User registered and logged in!" });
        res.redirect('/home');
    } catch (error) {
        res.status(500).json({ error: "Failed to register user" });
    }
});

app.get("/login", (req, res) => {
    res.render(__dirname + "/templates/login.ejs");
});

app.post("/login", async (req, res) => {
    const uri = config.mongoURI;
    const users = new Users(uri);
    const {username, password} = req.body;

    try {
        const user = await users.getUserByUsername(username);
        if (!user) {
            return res.status(404).json({message: "User not found"});
        }

        const isPasswordValid = await users.comparePassword(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Incorrect password"});
        }

        res.status(200).json({message: "Login successful"});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: "Internal server error"});
    }
});

//make app listen on a port and print out the url of the running
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});