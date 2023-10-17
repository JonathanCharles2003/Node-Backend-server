const allowedOrigins = require('../config/allowedOrigins');

const credentials = (req, res, next) => {
    const origin = req.headers.origin;// We're getting information about where the request is coming from. This information is stored in the "Origin" header of the incoming request and is stored in the origin variable.
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true);//If the website is on the allowed list, we're telling the browser that it's allowed to send credentials (like cookies) with this request     
    }
    next();
}

module.exports = credentials