const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;//This line gets the cookies from the request and stores them in the cookies variable.
    if (!cookies?.jwt) return res.sendStatus(401);//This code checks if there's a cookie named 'jwt' in the cookies
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();//It searches the database for a user who has the same 'refreshToken' value.
    if (!foundUser) return res.sendStatus(403); //Forbidden 
    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);//If there is an error during token verification || It compares the username found in the foundUser object (from the database) with the username decoded from the token.
            const roles = Object.values(foundUser.roles);//This code extracts the user's roles from the foundUser object and puts them into an array.
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            res.json({ roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }