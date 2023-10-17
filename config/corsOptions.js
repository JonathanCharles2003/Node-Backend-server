const allowedOrigins = require('./allowedOrigins');

const corsOptions = {
    origin: (origin, callback) => {//this code is defining a function that checks the origin of a web request and communicates the result using the provided callback function
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {//if (allowedOrigins.indexOf(origin) !== -1 || !origin) {: This line checks if the requesting website's origin (represented by origin) is in a list of allowed origins (allowedOrigins) or if there's no origin information (!origin). If it's in the list of allowed origins or there's no origin info, it's considered allowed.
            callback(null, true)//we tell the browser that it's okay to proceed by calling callback(null, true). The null represents no error, and true means it's allowed.
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200//This indicates that the CORS options request was successful.
}   

module.exports = corsOptions;