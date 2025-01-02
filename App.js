const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require('./routes/userRoutes');
const employerRoutes = require('./routes/employer/employerRoutes');
const applicantRoutes = require('./routes/applicant/applicantRoute');
const jobRoutes = require('./routes/job/jobRoute');
const universalRoutes = require('./routes/universals/universalRoute');
const pdfRoutes = require('./routes/pdfRoutes'); // Import the new PDF route
const path = require('path');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
}));

// Serve static files
app.use('/uploads/logos', express.static(path.join(__dirname, 'uploads', 'logos')));
app.use('/uploads/cvtemplates', express.static(path.join(__dirname, 'uploads', 'cvtemplates')));

// Middleware for parsing JSON
app.use(bodyParser.json());

// Define routes
app.use('/api/admin', adminRoutes);
app.use('/api/employers/', employerRoutes);
app.use('/api', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applicant/', applicantRoutes);
app.use('/api/universals/', universalRoutes);
app.use('/api/pdf', pdfRoutes); // Use the new PDF route

// Basic route to check server health
app.get('/', (req, res) => {
  res.send('Server is running!');
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
