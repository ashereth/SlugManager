// Main application file that handles backend tasks such as route handling and http request processing

/* ---------- Assuming you have all needed packages installed -----------------------
        use command (for windows): powershell -ExecutionPolicy Bypass -Command "nodemon index.js"
                    in a vscode terminal to start up server
-------------------------------------------------------------------------------------*/

/* ---------------- SET-UP ---------------- */
import express from "express";                              // express module
import { dirname } from "path";                             // extract directory name from file path
import { fileURLToPath } from "url";                        // convert a file URL to a file path string
import bodyParser from "body-parser";                       // parse body of HTTP requests
import { Users } from "./database/usersClass.js";           // import the Users class
import { Projects } from "./database/projectsClass.js";     //import projects class
import { config } from "./database/db.js";                  // configuration settings
import session from 'express-session';
import { createHash } from 'crypto';

// function for hashing passwords used by login in order to compare hashes of given password and one in database
function hash(string) {
    return createHash('sha256').update(string).digest('hex');
} 

/*---------------- express server setup -------------------------------------- */
// dynamically get path to directory
const __dirname = dirname(fileURLToPath(import.meta.url));
// set main application variable using express
const app = express();
//set port for server to run on
const port = 3000;
//bodyParser can now parse forms
app.use(bodyParser.urlencoded({extended: true}));
// serve static files from the 'static' directory
app.use(express.static(__dirname + "/static"));
//set up the session in order to save user data like whether they are logged in or the current users username etc.
app.use(session({
    secret: 'slugmanager',
    resave: false,
    saveUninitialized: true,
}));

// Middleware to check if user is logged in
function isLoggedIn(req, res, next) {
    if (!req.session.isLoggedIn) {
        return res.redirect('/register');
    }
    next();
}


/* ---------------- VIEWS ---------------- */
// main route; index page
// user must be logged in to access
app.get("/", isLoggedIn, (req, res) => {

    //get the projects of the user

    // filled projects array with some test projects
    let projects = [{
        _id: "1",
        name: "test project 1",
        administrator: "acegamer",
        members: ["ace", "asher", "Gino"],
        tasks: []
    },
    {
        _id: "2",
        name: "test project 2",
        administrator: "Gino",
        members: ["Gino"],
        tasks: []
    }];
    //render homepage
    res.render(__dirname + "/templates/index.ejs", {projects: projects});
});

// register page
app.get("/register", (req, res) => {
    //on first time registration error should be false
    res.render(__dirname + "/templates/register.ejs", {error: false});
});

app.post("/register", async (req, res) => {
    const uri = config.mongoURI;                            // retrieve mongoDB URI
    const users = new Users(uri);                           // new instance of Users class
    const {username, password} = req.body;                  // extract user/pass from request body    
    //sign in using the user info
    try {
        //make sure user doesnt already exist by calling createUser
        //must use await so that function finishes before executing more code
        let success = await users.createUser(username, password);
        if (success) {
            //if success=true and it was a new user send them to login page
            res.redirect("/login");
        } else {
            //if it wasnt a new user send an error and reload
            res.render(__dirname + "/templates/register.ejs", { error: "Invalid username or password" });
        }
    } catch (error) {//catch any weird unexpected errors
        console.error("Login error:", error);
        res.render(__dirname + "/templates/register.ejs", { error: "An error occurred during login. Please try again." });
    }
});

// login page
app.get("/login", (req, res) => {
    res.render(__dirname + "/templates/login.ejs");
});

app.post("/login", async (req, res) => {
    const uri = config.mongoURI;
    const users = new Users(uri);
    const { username, password } = req.body;

    try {
        // try to login, must use await to ensure the function finishes returning before doing other stuff
        let success = await users.login(username, hash(password));  // Assuming hash is a function you've defined elsewhere
        //if it worked send users to homepage if not send to login
        if (success) {
            //set session variables
            req.session.isLoggedIn = true;
            req.session.username = username;
            res.redirect("/");
        } else {
            res.render(__dirname + "/templates/login.ejs", { error: "Invalid username or password" });
        }
    } catch (error) {//catch any weird unexpected errors
        console.error("Login error:", error);
        res.render(__dirname + "/templates/login.ejs", { error: "An error occurred during login. Please try again." });
    }
});

//form for making new projects
// user must be logged in to access
app.get("/newProject", isLoggedIn, (req, res) => {
    res.render(__dirname + "/templates/newProject.ejs");
});

//handles post request for making new projects
app.post("/newProject", async (req, res) =>{
    //get the project name from the form
    const { projectName } = req.body;
    //get mongodb database
    const uri = config.mongoURI;
    const projects = new Projects(uri);

    try {
        //try to make project
        let success = await projects.createProject(req.session.username, projectName);
        //send to homepage
        res.redirect("/");
    } catch (error) {//catch any weird unexpected errors and reload page
        console.error("Project creation error:", error);
        res.render(__dirname + "/templates/newProject.ejs", { error: "An error occurred during login. Please try again." });
    }
});

// make app listen on a port and print out the url of the running app
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
