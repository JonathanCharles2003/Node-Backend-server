const mongoose = require('mongoose');//imports mongoose library for MongoDB

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DATABASE_URI, { //is used to access the database URI from the environment variables(env).
            useUnifiedTopology: true,//This option is used to enable the use of the new server discovery and monitoring engine in MongoDB. It's typically set to true, which is recommended in most cases.Enabling this option ensures that your application uses the latest and recommended methods for handling server discovery and monitoring, which can improve performance and reliability.
            useNewUrlParser: true//This option is used to enable the use of the new URL parser in MongoDB. It is also typically set to true, and it's recommended for compatibility with recent MongoDB driver versions.This option is important for correctly parsing the connection string, especially when you have special characters or URL-encoded elements in your URI.
        });
    } catch (err) {
        console.error(err);
    }
}

module.exports = connectDB