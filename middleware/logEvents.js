const { format } = require('date-fns');//This line imports the format function from the 'date-fns' library. The format function is used for formatting dates and times.  
const { v4: uuid } = require('uuid');//This line imports the v4 function from the 'uuid' library and assigns it to a variable named uuid. The uuid variable is used to generate random and unique identifiers

const fs = require('fs');//The 'fs' module provides functions for working with the file system, such as reading and writing files.
const fsPromises = require('fs').promises;//These Promise-based functions make it easier to work with asynchronous file operations.
const path = require('path');//The 'path' module provides utilities for working with file and directory paths.

const logEvents = async (message, logName) => {
    const dateTime = `${format(new Date(), 'yyyyMMdd\tHH:mm:ss')}`;//This line uses the imported format function to create a formatted date and time string in the 'yyyyMMdd HH:mm:ss' format. This string is stored in the dateTime variable.
    const logItem = `${dateTime}\t${uuid()}\t${message}\n`;//This line creates a log item string that includes the formatted date and time, a generated UUID, and the provided message.

    try {
        if (!fs.existsSync(path.join(__dirname, '..', 'logs'))) {//This line checks if a directory named 'logs' does not exist in the current script's directory. The fs.existsSync function checks for the existence of a file or directory.
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'));//If the 'logs' directory does not exist, this line creates it using the Promise-based mkdir function from fsPromises
        }

        await fsPromises.appendFile(path.join(__dirname, '..', 'logs', logName), logItem);//This line appends the logItem to a file in the 'logs' directory. The file name is determined by the logName parameter. The appendFile function is asynchronous and part of fsPromises.

    } catch (err) {
        console.log(err);
    }
}   

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt');//This line calls the logEvents function to log information about the incoming request. It includes the HTTP method, request origin, and URL.
    //req.method: This is the HTTP request method (e.g., GET, POST, PUT).
    //req.headers.origin: This is the value of the "Origin" header in the HTTP request, which typically represents the origin of the request (e.g., the domain making the request).
    //req.url: This is the URL path of the request.
    //'reqLog.txt': This is the name of the log file where the log entry will be appended. It specifies the file where the log entry will be saved. In this case, it's a file named 'reqLog.txt'.
    console.log(`${req.method} ${req.path}`);
    next();//next() is used to pass control to the next middleware or route handler
    //Without next(), the request-response cycle would be halted at the current middleware, and subsequent middleware or route handlers would not be executed
}

module.exports = { logger, logEvents };