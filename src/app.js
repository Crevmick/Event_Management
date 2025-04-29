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
import EventRegistration from './routes/Event/EventRegistration.js'; 

dotenv.config();

//connect DB 
connectDB();
//Initialiing the application
const app = express();


app.use(express.json()); // for parsing JSON body
app.use(morgan('dev'));
app.use(cors())



// Mount routes
app.use('/api/auth/signup', signupRoute);
app.use('/api/auth/signin', signinRoute);
app.use('/api/events', eventRoute);
app.use('/api/events', EventRegistration);

// Mount routes for Google authentication
app.use('/auth', authRouter); // This will handle /auth/google and /auth/google/callback


// Default route for testing
app.get('/', (req, res) => {
    res.send('Welcome to the Event Registration API!');
});


//listen to our server
const PORT = process.env.PORT;
const HOST = process.env.HOST;
app.listen (PORT, HOST,()=>{
    console.log(`Server running at http://${HOST}:${PORT}/`);
})