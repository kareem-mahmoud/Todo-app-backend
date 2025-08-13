const mongoosedb = require('mongoose');
const dotenv = require('dotenv'); // Load environment variables
dotenv.config({path: './config.env'}); // Load environment variables from .env file

// Ensure the environment variables are loaded
const PORT = process.env.PORT // Define the port number
const mongoURI = process.env.DATABASE_URL; //localhost:27017/todos
// Default to localhost
mongoosedb.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('Database connected'))
.catch(err => console.error('Database connection error:', err));

module.exports = {
  PORT
};