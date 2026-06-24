# Configuration of .env files

This explains how to set up and configure the local environment variables required

## Create the frontend environment file

In the root directory of the frontend folder create a new file named exactly: `.env`

### Add the env variables to the frontend env file

Open the newly created `.env` file in your text editor and add the following two configuration lines:

VITE_SERVER_IP="http://localhost:"
VITE_PORT="5000"

## Create the backend environment file

In the root directory of the backend folder create a new file named exactly: `.env`

### Add the env variables to the backend env file

Open the newly created `.env` file in your text editor and add the following two configuration lines:

PORT=5000
CSV_PATH="" <= path to where the csv file is on the local machine (must be a .csv file)

#### Running frontend

Run the command "cd frontend" from the projects root directory to get into /frontend
Run the command "npm run dev" and visit the displayed url

#### Running backend

Run the command "cd backend" from the projects root directory to get into /backend
Run the command "node server.js" to start the backend

##### Login

Current dummy user has the login
email: a@b.com
password: test
