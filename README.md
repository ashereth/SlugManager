# SlugManager
All code related to group project for cse115a at UCSC. Made by Asher Etherington, Kenny Losier, Mia Santos, Nathan Le, Poppy Garner, Gino Zarich.

__Link to deployed website [here](https://slugmanager.onrender.com/)__

## Database Setup
Connection to the database is made using a hidden .env file. In order to use this project on your own you must create your own .env file in the root directory and give
it a port number to run on aswell as the connection string to a mongodb database.
Format the .env file like the example below:

```
mongoURI=<connection string here>

PORT=<port number here>
```

## Running Project
In order to run navigate to the project folder after downloading all files and creating your own .env file then run $`npm start` and the project should begin to run on whatever port you wrote in the .env file.
