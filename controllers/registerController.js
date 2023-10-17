const User = require('../model/User');
const bcrypt = require('bcrypt');
//We're importing a module called 'bcrypt' that is used for password hashing and security. It's a common library for securely storing and checking passwords.

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body;//This line extracts the 'user' and 'pwd' values from the request's body. 
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password are required.' });

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ username: user }).exec();//.findOne({ username: user }): This part of the code instructs the database to find a single document where the 'username' field matches the 'user' value. In other words, it's searching for a user with the same username as the one provided in the 'user'. The .exec() function is used to execute the query.
    if (duplicate) return res.sendStatus(409); //Conflict 

    try {
        //encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);//This line uses 'bcrypt' to hash the 'pwd' (password) with a strength of 10, which is a measure of how secure the hashing process should be.

        //create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log(result);//

        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleNewUser };