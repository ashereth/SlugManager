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


## High Level Goals:
- User Roles and Permissions: The app should support administrators and team members, each with different permissions. Administrators control task creation, deadlines, and task assignments.

- Login Page that takes user to dashboard

- Managers have the ability to assign and modify tasks

- Team members can only modify the completion of their own tasks

- Progress Tracking: Team members should be able to log their progress on the tasks that they are assigned. They might also be able to add attachments and comments as needed to provide updates on their task.

- Individual tracking of tasks for a specific user

- Overall team tracking visible by team members (Not necessary)

- Shows overall completion status of tasks

- Dashboard: Team members should have access to a dashboard that provides an overview of their assigned tasks, the current progress made on the task, and the deadlines they are supposed to meet.

- Dashboard layout is the same for team members, but shows their individual tasks

- Dashboard should vary for an administrator, showing all of the current tasks and their status

### User Stories to be Implemented
- As a user, I want to be able to create and log into my account so that I can see any account data related to my account and no other accounts
- As a user, I want to be able to create and join projects so that I can have personal task trackers as well as group task trackers
- As a user I want to be able to have a special role for each project I am apart of so that each team member can have specific permissions based on their role
- As a project ‘administrator’ I want to be able to add and edit tasks to a project so that me and any other team members can see the tasks for this project
- As a project ‘administrator’ I want to be able to assign tasks to other team members
- As a team member I want to be able to update my progress on any assigned tasks so that I can inform the rest of my team members on my progress