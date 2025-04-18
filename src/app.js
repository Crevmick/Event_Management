//importing dependencies 
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';


connectDB();



dotenv.config();


//Initialiing the application
const app = express();









//listen to our server
const PORT = process.env.PORT
app.listen (PORT,()=>{
    console.log("Server connected..")
})