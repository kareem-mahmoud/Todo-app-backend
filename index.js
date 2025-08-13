const express = require('express');
const cors = require('cors');

// Connect to MongoDB
const db = require('./db-connection/database-connection'); // Import the database connection
// Connect to Routes
const routes = require('./main-routes/app-routes'); // Import the routes from app-routes.js



const app = express();
// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON bodies

// Get all Routers
app.use(routes);

// Start the server
app.listen(db.PORT, () => {
    console.log(`Server is running on http://localhost:${db.PORT}`);
});
