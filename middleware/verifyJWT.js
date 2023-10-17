const jwt = require('jsonwebtoken');

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;//So, this line of code essentially checks for an 'Authorization' header in either uppercase or lowercase, making it case-insensitive. It's looking for a token that may be included in the request's headers for authentication purposes.
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401);//it verifies if the 'Authorization' header starts with the text 'Bearer '
    const token = authHeader.split(' ')[1];// This code splits the 'Authorization' header to extract the actual token part after 'Bearer '.
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.sendStatus(403); //invalid token
            req.user = decoded.UserInfo.username;//this line takes the 'username' information from the 'decoded' JWT (which was verified to be valid) and assigns it to a property called 'user' in the request object (req). This 'user' property now holds the username of the authenticated user.
            req.roles = decoded.UserInfo.roles;//Similarly, this line takes the 'roles' information from the 'decoded' JWT and assigns it to a property called 'roles' in the request object. This 'roles' property now holds the roles or permissions associated with the authenticated user.
            next();
        }
    );
}

module.exports = verifyJWT