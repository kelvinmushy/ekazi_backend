const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import cors
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const employerRoutes=require('./routes/employer/employerRoutes')
const path = require('path');
const jobRoutes=require('./routes/job/jobRoute')
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));


app.use('/uploads/logos', express.static(path.join(__dirname, 'uploads', 'logos')));

// Middleware for parsing JSON
app.use(bodyParser.json());

// Define routes
app.use('/api/admin', adminRoutes);

//employer Routes
app.use('/api/employers/', employerRoutes);

//job route will be here

app.use('/api', userRoutes);

app.use('/api/jobs', jobRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
