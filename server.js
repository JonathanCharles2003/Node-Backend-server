require('dotenv').config();// require('dotenv'): This part of the code uses the require function to load the "dotenv" module. The "dotenv" module is a third-party library in Node.js that helps you manage environment variables..config(): This is a method provided by the "dotenv" module. It is used to load and configure the environment variables from the ".env" file.
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT');
const cookieParser = require('cookie-parser');
const credentials = require('./middleware/credentials');
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const PORT = process.env.PORT || 3500;//ur checking if the port is present in process.env.PORT or else just use port 3500


// Connect to MongoDB
connectDB(); //goes to config/dbConn

// custom middleware logger
//In an Express.js application, app.use() is a method that is used to register middleware functions.
app.use(logger); //goes to middleware/logEvents 

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials); //goes to middleware/credentials 

// Cross Origin Resource Sharing
app.use(cors(corsOptions));//goes to config/corsOptions
// Here, cors is a middleware for handling (CORS) in your web application.
//CORS is a security feature that controls which websites are allowed to access resources on your server

// built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }))//this line makes sure your web application can understand and process data submitted from HTML forms. It's like a translator for the information people enter in web forms, making it usable by your application(parse data from web forms in the URL-encoded format.). The { extended: false } part just tells the translator to keep things simple while doing its job.

// built-in middleware for json 
app.use(express.json());
//This line adds middleware that can understand and process data sent to your web application in the JSON format. JSON is a common way to send and receive data between web applications.

//middleware for cookies
app.use(cookieParser());
//This line adds middleware that can read, parse, and work with cookies. Cookies are small pieces of data stored on a user's browser, often used for remembering user information or preferences.

//serve static files
app.use('/', express.static(path.join(__dirname, '/public')));
//'/': This specifies that the middleware should be applied to all routes, which means it will be used for all incoming requests to your application.
//express.static(): This is a built-in middleware in Express.js that's used for serving static files like HTML, CSS, JavaScript, and images.
//path.join(__dirname, '/public'): This part tells Express where to find the static files. __dirname represents the current directory, and we're saying that the static files are located in a folder called 'public' within that directory.



// routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));

app.use(verifyJWT);//This verifies if the token is valid or not(expired or not ) for all employee functions 
app.use('/employees', require('./routes/api/employees'));

app.all('*', (req, res) => {//This sets up a catch-all route using app.all. So if every route fails it goes here
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'));
    } else if (req.accepts('json')) {
        res.json({ "error": "404 Not Found" });
    } else {
        res.type('txt').send("404 Not Found");
    }
});

app.use(errorHandler);

//This line of code is about setting up a connection to a MongoDB database and starting a server for a web application
mongoose.connection.once('open', () => {//This code listens for a specific event called 'open' on the MongoDB database connection. The 'open' event is triggered when the connection to the database is successfully established.
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));//it tells your Node.js application to listen for incoming HTTP requests on a specified port (PORT).
});