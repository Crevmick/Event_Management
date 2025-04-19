//importing dependencies 
import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import signupRoute from './routes/Auth/userSignUp.js';
import signinRoute from './routes/Auth/userSignIn.js';

dotenv.config();

connectDB();
//Initialiing the application
const app = express();


app.use(express.json()); // for parsing JSON body

// Mount routes
app.use('/api/signup', signupRoute);
app.use('/api/signin', signinRoute);






//listen to our server
const PORT = process.env.PORT
app.listen (PORT,()=>{
    console.log("Server connected..")
})