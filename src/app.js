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
import categoryRoutes from './routes/Event/categoryRoute.js';


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
app.use('/api/', categoryRoutes);


// Mount routes for Google authentication
app.use('/auth', authRouter); // This will handle /auth/google and /auth/google/callback


// Default route for testing
app.get('/', (req, res) => {
    res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Event Registration API</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              text-align: center;
              padding: 50px;
              background-color: #f4f4f9;
              color: #333;
            }
            h1 {
              color: #4CAF50;
            }
            p {
              font-size: 18px;
            }
            a {
              color: #007bff;
              text-decoration: none;
              font-weight: bold;
            }
            a:hover {
              text-decoration: underline;
            }
          </style>
        </head>
        <body>
          <h1>Welcome to the Event Registration API!</h1>
          <p>Status: <span style="color: green;">Success</span></p>
          <p>To view the API documentation, click below:</p>
          <p><a href="https://documenter.getpostman.com/view/43171328/2sB2j3CsSm" target="_blank">View API Documentation</a></p>
        </body>
      </html>
    `);
  });
  


//listen to our server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
