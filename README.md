npm install express dotenv
npm install --save-dev @types/express @types/node
-------------------------------------------------------


CREATE TYPE application_status AS ENUM ('Applied','Pending','Rejected','Offer');

create table
--------------------

CREATE TABLE applications(
	id SERIAL PRIMARY KEY,
	company_name VARCHAR(100) NOT NULL ,
	job_title VARCHAR(100) NOT NULL,
	status application_status NOT NULL DEFAULT 'Applied',
	applied_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP

);



create file 
---------------
 .env

EDIT .env FILE
--------------
DB_USER=postgres
DB_HOST=localhost
DB_DATABASE=job_tracker
DB_PASSWORD=1234
DB_PORT=5432
PORT=3000

CREATE FOLDER
--------------
mkdir src/config
touch src/config/database.ts

EDIT database.ts
----------------
import {Pool} from 'pg'
import dotenv from "dotenv"

dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATA,
    password: process.env.PASSWORD,
    port: parseInt(process.env.PORT || "5432"),
});

CREATE tsconfig.json
---------------------

{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020",
    "esModuleInterop": true,
    "moduleResolution": "Node",
    "resolveJsonModule": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "dist"
  }
}


CREATE .gitignore FILE
------------------------
node_modules
 .env

EDIT database.ts
----------------
export const query = (text: string ,params?: any[]) => pool.query(text,params)

CREATE FILE
------------
touch src/server.ts

EDIT server.ts
------------------

import express from "express";
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;


app.use(express.json())

app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
})

RUN COMMAND
-----------
npm run dev

PACKAGE.json
-------------
{
  "name": "job-tracker-api",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
 "scripts": {
  "dev": "nodemon --exec npx ts-node src/server.ts",
  "build": "tsc",
  "start": "node dist/server.js"
},
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^17.2.3",
    "express": "^5.1.0",
    "pg": "^8.16.3"
  },
  "devDependencies": {
    "@types/express": "^5.0.5",
    "@types/node": "^24.10.0",
    "@types/pg": "^8.15.6"
  }
}

EDIT database.ts(check if the connection was successful)
-------------------------------------------------------------

export const testDbConnection = async() => {

    try {
        const client = await pool.connect()
        console.log('Database connection successful');
        client.release()
        
    } catch(error){
        console.error('Unable to connect to the database :',error);
        process.exit(1)
        
    }
}

SERVER.TS
-------------------------------

import { testDbConnection } from "./config/database"; //add import

testDbConnection()//invoke the method

app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
})

database.ts
-------------------
import {Pool} from 'pg'
import dotenv from "dotenv"


dotenv.config()

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT || "5432")
});
-----------------------------------------------------------------

//query function

export const query = (text: string ,params?: any[]) => pool.query(text,params);

//check if database is connetected successfully

export const testDbConnection = async () => {

    try {
        const client = await pool.connect()
        console.log('Database connection successful');
        client.release();
        
    } catch(error){
        console.error('Unable to connect to the database :',error);
        process.exit(1);
        
    }
}
 server.ts
----------------------------
import express from "express";
import dotenv from "dotenv"
import { testDbConnection } from "./config/database";


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;


/*app.use(express.json());

testDbConnection()

app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
})*/

const startServer = async () => {
    await testDbConnection()
    app.use(express.json());



app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
});
};
startServer()

================================================================================================================
CREATE FOLDER
-------------

 mkdir src/types

CREATE FILE
-------------

touch src/types/application.types.ts

EDIT application.types.ts
-----------------------------
export type ApplicationStatus = 'Applied' | 'Pending' | 'Rejected' | 'Offer' ;

export  interface Application {
    id: number;
    company_name : string;
    job_title : string;
    status : ApplicationStatus ;
    applied_at : Date

};

export type NewApplication = Omit<Application, 'id' | 'applied_at'>

export type UpdateApplication = Pick<Application,"status">

CREATE FOLDER
-------------
mkdir src/service
touch src/service/applicationService.ts

APPLICATIONSERVICE.TS
-----------------------------
import { query } from "../config/database";
import { Application, NewApplication } from "../types/application.types";

export const createApplication = async (
    appData: NewApplication
): Promise<Application> => {

    const { company_name, job_title, status } = appData;

    const { rows } = await query(
        "INSERT INTO applications (company_name, job_title, status) VALUES ($1, $2, $3) RETURNING *",
        [company_name, job_title, status]
    );

    return rows[0];
};

CREATE FOLDER
-------------------
mkdir src/controllers
touch src/controllers/applicationControllers.ts

APPLICATIONCONTROLLERS.TS
-------------------------------
import { Request,Response} from 'express';
import * as applicationService from "../service/applicationService"

export const addApplication = async (req: Request ,res : Response) => {
    try{
        const NewApplication = await applicationService.createApplication(req.body)
        res.status(201).json(NewApplication)
    }catch(error){
        res.status(500).json({message : "Error in creating application"});
        
    }
}

CREATE FOLDER
-------------------
mkdir src/routes
touch src/routes/applicationRoutes.ts

APPLICATIONROUTES.TS
----------------------------------
import { Router } from "express"
import { addApplication } from "../controllers/applicationControllers"

const router = Router();

router.post('/applications',addApplication)

export default router;


SERVER.TS(update)
------------------

import express from "express";
import dotenv from "dotenv"
import { testDbConnection } from "./config/database";
import applicationRoutes from "./routes/applicationRoutes";//added import


dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000;


/*app.use(express.json());

testDbConnection()

app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
})*/

const startServer = async () => {
    await testDbConnection()
    app.use(express.json());
    app.use('/api',applicationRoutes) //added this 


app.listen(PORT, () =>{
    console.log(`Server is running on https://localhost:${PORT}`);
    
});
};
startServer()
TEST ON POSTMAN
---------------------

http://localhost:3000/api/Applications

{
    "company_name" : "mLab",
    "job_title": "Professor",
    "status" : "Pending"
}


READ OPERATIONS(EDIT applicationService.ts)
-------------------------------------------

//Read operations

export const findAllApplications = async () : Promise<Application[]> => {
    const {rows } = await query(
        "SELECT * FROM applications ORDER BY applied_at DESC"
    );
    return rows;
};

//Find by ID

export const findApplicationById = async (id:number): Promise<Application | null> =>{
    const { rows } = await query(
        "SELECT * FROM applications WHERE id = $1",
        [id ]
    );
    return rows[0] || null;
    
};

EDIT APPLICATION CONTROLLERS(add read operations function)
-------------------------------------------------------------

export const getAllApplications = async (req: Request , res : Response) => {
    try{
        const applications = await applicationService.findAllApplications();
        res.status(200).json(applications);
    }catch(error){
        res.status(500).json({message:"Error retrieving applications"});
    }
};

export const getAllApplicationsById = async (req: Request , res : Response) => {
    try{
        const id = parseInt(req.params.id)
        const application= await applicationService.findApplicationById(id);
        if(!application){
            return res.status(404).json({message : "Application not found"})
return res.status(200).json(application);
        }
    }catch(error){
        res.status(500).json({message:"Error retrieving application"});
    }
};

EDIT APPLICATIONSROUTER.ts(DEFINE ROUTES)
-----------------------------------------

router.get('/applications',getAllApplications)
