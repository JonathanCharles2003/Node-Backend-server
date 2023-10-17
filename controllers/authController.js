const User = require('../model/User');
const bcrypt = require('bcrypt');//We're importing a module called 'bcrypt' that is used for password hashing and security. It's a common library for securely storing and checking passwords.
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body;//This line extracts the 'user' and 'pwd' values from the request's body. 
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    const foundUser = await User.findOne({ username: user }).exec();//.findOne({ username: user }): This part of the code instructs the database to find a single document where the 'username' field matches the 'user' value. In other words, it's searching for a user with the same username as the one provided in the 'user'. The .exec() function is used to execute the query.
    if (!foundUser) return res.sendStatus(401); //Unauthorized 
    // evaluate password 
    const match = await bcrypt.compare(pwd, foundUser.password);//stores True or False
    if (match) {
        const roles = Object.values(foundUser.roles).filter(Boolean);//foundUser.roles is assumed to be an object with different roles as properties.Object.values(foundUser.roles) takes all the values from that object and puts them into an array. In this case, it turns the roles into an array..filter(Boolean) is used to remove any "falsy" values from the array. This means it keeps only the roles that have a truthy value (values that are not empty, undefined, null, or equivalent to false).
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }//UserInfo": A label for the part of the token that holds user information.//"username": foundUser.username: The user's username is included in the token, so the system knows which user this token belongs to.//"roles": roles: The user's roles (like "admin" or "user") are included so the system can check what this user is allowed to do.
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );
        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);
        console.log(roles);

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, { httpOnly: true,  sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });//secure: true
        //This line creates a secure HTTP cookie named 'jwt' and sets its value to the refresh token. The 'sameSite' attribute is set to 'None', which can be used in certain cross-origin scenarios. secure:true should be added in under normal circumstances but thunderclient will not work if that is present 
        // Send authorization roles and access token to user
        res.json({ roles, accessToken });

    } else {
        res.sendStatus(401);//False ie Unauthorized 
    }
}

module.exports = { handleLogin };