const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');


require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));

// Middleware for parsing JSON
app.use(bodyParser.json());

// Define routes
app.use('/api/admin', adminRoutes);
app.use('/api', userRoutes);

app.use('/api', userRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
