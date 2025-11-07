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




















http://localhost:8080/api/auth/




{
  "email": "test@example.com",
  "password": "123456",
  "name": "John Doe",
  "role": "submitter",
  "display_picture": "http://example.com/pic.png"
}

======================================================

LESSON 5.3
------------------------

APPLICATIONSERVICE.ts
------------------------
//read operations

export const findAllApplications = async (): Promise<Application[]> => {
    const {rows} = await query (
        "SELECT * FROM applications ORDER BY applied_at DESC"
    );
    return rows;
}


export const findAllApplicationById = async (id:number): Promise<Application | null> => {
    const {rows} = await query(
        "SELECT * FROM applications WHERE id = $1",[id,

        ]
    );
    return rows[0] || null;

}

APPLICATIONCONTROLLERS.ts
-------------------------
//from read operations

export const getAllApplications = async (req: Request, res: Response) => {
    try {
        const applications = await applicationService.findAllApplications();
        res.status(200).json(applications);

    }catch(error){
        res.status(500).json({message : "Error retrieving applications"});
    }
};
export const getAllApplicationById = async (req: Request,res : Response) =>{
    try{
        // /api/applications/1
        const id = parseInt(req.params.id)
        const application = await applicationService.findAllApplicationById(id)
        if(!application){
            return res.status(200).json(application)
        }
 res.status(200).json(application);

    }catch(error){
        res.status(500).json({message:"Error retrieving application"})
    }
}

APPLICATIONROUTES.ts
---------------------

router.get('/applications' , getAllApplications)
router.get('/applications/:id' , getAllApplicationById)



APPLICATIONCONTROLLERS.ts
-------------------------
//update operations

export const updateApplicationById = async(req: Request, res : Response) => {
    try{
        const id = parseInt(req.params.id)
        const updateApplication = await applicationService.updateApplication(id,
            req.body
        );

        if(!updateApplication){
            return res.status(404).json({message : "Application not found"})
        }
        res.status(200).json(updateApplication);
    } catch(error){

        res.status(500).json({message:"Error updating application"})
    }
};

//delete operations

export const deleteApplicationById = async (req: Request , res : Response) => {
     try{
        const id = parseInt(req.params.id);
        const deleteApplication = await applicationService.deleteApplication(id);
             if(!deleteApplication){
            return res.status(404).json({message : "Application not found"});
        }
        res.status(200).json({ message : "Application Deleted Succcesfully"});
    
     } catch (error){

        console.log(error);
        
        res.status(500).json({message:"Error deleting  application"})
     }
}
APPLICATIONSERVICE.ts
------------------------

//update operations

export const updateApplication = async (id : number, appData : Application) : Promise<Application | null> => {
    const {status} = appData
    const {rows} = await query("UPDATE applications SET status = $1 WHERE id = $2 RETURNING *", 
        [status, id]
    );
    return rows[0] || null;
};

//delete operations

export const deleteApplication = async (id : number) : Promise<Application | null > => {
    const {rows} = await query(
        "DELETE FROM  applications WHERE id = $1 RETURNING *",
         [id]
    );
    return rows[0] || null;
}

Then add routes

                                         AUTH
------------------------------------------------------------------------------------------------------------------

npm i -D @types/jsonwebtoken @types/bcrypt

CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	email VARCHAR(255) UNIQUE NOT NULL,
	password_hash VARCHAR(255) NOT NULL,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE applications
ADD COLUMN user_id INTEGER;



ALTER TABLE applications
ADD CONSTRAINT fk_user
FOREIGN KEY (user_id)
REFERENCES users(id)
ON DELETE CASCADE;

.ENV
------------
JWT_SECRET=this-key-is-very-secret

CREATE FILE
----------------
touch src/types/user.types.ts

export interface User {
    id: number,
    email: string,
    password_hash: string;

}

CREATE FILE
----------------

touch src/types/express.d.ts

import { User } from "./user.types";

declare global {
    namespace Express {
        export interface Request{
            user?: User;
        }
    }
}

CREATE FILE
--------------
touch src/service/userService.ts

import { query } from "../config/database"
import bcrypt from "bcryptjs"
import { User } from "../types/user.types"

export const findUserByEmail = async(email : string) : Promise <User | null> => {
    const {rows} = await query(
        "SELECT * FROM users WHERE email = $1",[email]);
        return rows[0] || null;
}

export const createUser = async(
    email: string,
    password: string
) : Promise<User> => {
    const salt = await bcrypt.genSalt(10)
    const password_hash = await bcrypt.hash(password, salt);

    const {rows} = await query(
        "INSERT INTO users (email,password_hash) VALUES ($1,$2) RETURNING id ,email",
        [email, password_hash]
    );
     return rows[0] || null;
}

CREATE FILE authControllers.ts
-------------------------------

touch src/controllers/authController.ts
import { Request,Response } from "express";
import * as userService from '../service/userService'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const register = async(req : Request,res: Response) => {
    const {email,password} = req.body
    if(!email || !password){
        return res.status(400).json({message : "Email and password are required"})
    }
    try{
        const existingUser = await userService.findUserByEmail(email)
        if(!existingUser){
            return res.status(409).json({message: "Email is already in use"});
        }
        const user = await userService.createUser(email,password)
        res.status(201).json({message : "user registered successfully" , userId: user.id})

    } catch (error){
        res.status(500).json({message : "Error registering the user"})
    }
};

export const login = async (req: Request, res: Response) => {
    const { email,password } = req.body;
    if(!email || !password){
        return res.status(400).json({ message : "Email and password are required"});
    }

    try{

    const user = await userService.findUserByEmail(email);

    if(!user){
        return res.status(409).json({message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password_hash)

        if(!isMatch){
            return res.status(401).json({message : " Invalid password"});
        }
        const payload = {userId: user.id ,email:user.email}
        const token = jwt.sign(payload, process.env.JWT_SECRET!,{
            expiresIn: "1h"
        });

        res.status(200).json({ message: "Login Successful", token})
    }catch(error){
        return res.status(400).json({ message : "Error logging in"});
    }
}

CREATE FILE authRoutes.ts
-------------------------------

touch src/routes/authRoutes.ts

import { Router } from "express";
import { register, login } from "../controllers/authController"

const router = Router()

router.post('./register',register)
router.post('./login', login)

export default router;


CREATE FOLDER
----------------
mkdir src/middleware
touch src/middleware/authMiddleware.ts
import { Request, Response,NextFunction } from "express";
import jwt from "jsonwebtoken"
import { findUserByEmail } from "../service/userService";
import { User } from "../types/user.types"
import { log } from "node:console";

interface JwtPayload {
    userId: number,
    email: string

}

export const protect = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let token;
    if(
        req.headers.authorization && 
        req.headers.authorization.startsWith("Bearer"))
        {
        try{
            console.log(req.headers, 'request headers');
            console.log(req.headers.authorization , "token");
            
            token = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload
            console.log(decoded, 'decoded token');

            const user : User | null = await findUserByEmail(decoded.email)
            
            req.user = user || undefined

            if(!req.user){
                return res.status(401)
                .json({message: "Not authorize, user not found"});
            }

            return next()
        }catch(error){
       
          return res.status(401).json({message: "Not authorized, token failed"})
            
        }
    }else{
       res.status(400).json({message : "Not authorized, no token"})
    }
	return res.status(400).json({message : "Not authorized"}) 
}
}

EDIT tsconfig.json
----------------------------
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "CommonJS",
    "moduleResolution": "node",
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src/**/*"],
  "files" : ["src/types/express.d.ts"]
}


SERVER.TS
----------------

import authRoutes from "./routes/authRoutes"

app.use("/auth",authRoutes)

APPLICATIONROUTES.ts
---------------------

router.use(protect)

import { protect } from "../middleware/authMiddleware";






































