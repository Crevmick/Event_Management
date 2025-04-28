//importing dependencies 
import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import connectDB from './config/db.js';
import signupRoute from './routes/Auth/userSignUp.js';
import signinRoute from './routes/Auth/userSignIn.js';
import authRouter from './routes/Auth/authRouter.js';  // Import authRouter for Google login
import eventRoute from './routes/Event/event.js';

dotenv.config();

//connect DB 
connectDB();
//Initialiing the application
const app = express();


app.use(express.json()); // for parsing JSON body
app.use(morgan('tiny'));
app.use(cors)


// Mount routes
app.use('/api/auth/signup', signupRoute);
app.use('/api/auth/signin', signinRoute);
app.use('/api/events', eventRoute);



// Mount routes for Google authentication
app.use('/auth', authRouter); // This will handle /auth/google and /auth/google/callback



//listen to our server
const PORT = process.env.PORT
app.listen (PORT,()=>{
    console.log("Server connected..")
})